import { useCallback, useEffect, useRef, useState } from "react";
import {
  BOARD_SIZE,
  DIFFICULTY_SPEED,
  DIR_VECTORS,
  OPPOSITE,
  type Difficulty,
  type Direction,
  type GameStatus,
  type Point,
} from "@/lib/snake/types";
import {
  sfx,
  startMusic,
  stopMusic,
  setVolume as setAudioVolume,
  setSfxEnabled,
  setMusicEnabled,
} from "@/lib/snake/sounds";
import { haptics } from "@/lib/snake/haptics";

const HIGH_SCORE_KEY = "snake:highScore";
const SETTINGS_KEY = "snake:settings";

function centerSnake(): Point[] {
  const c = Math.floor(BOARD_SIZE / 2);
  return [
    { x: c, y: c },
    { x: c - 1, y: c },
    { x: c - 2, y: c },
  ];
}

function randomFood(snake: Point[]): Point {
  const occupied = new Set(snake.map((s) => `${s.x},${s.y}`));
  const free: Point[] = [];
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      if (!occupied.has(`${x},${y}`)) free.push({ x, y });
    }
  }
  return free[Math.floor(Math.random() * free.length)];
}

export function useSnakeGame() {
  const [snake, setSnake] = useState<Point[]>(() => centerSnake());
  const [food, setFood] = useState<Point>(() => randomFood(centerSnake()));
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [status, setStatus] = useState<GameStatus>("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [sfxOn, setSfxOn] = useState(true);
  const [musicOn, setMusicOn] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [elapsed, setElapsed] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [ateTick, setAteTick] = useState(0);

  // Refs for latest values used inside intervals / listeners
  const directionRef = useRef(direction);
  const queuedDirRef = useRef<Direction | null>(null);
  const statusRef = useRef(status);
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const sfxOnRef = useRef(sfxOn);

  useEffect(() => { directionRef.current = direction; }, [direction]);
  useEffect(() => { statusRef.current = status; }, [status]);
  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { foodRef.current = food; }, [food]);
  useEffect(() => { sfxOnRef.current = sfxOn; }, [sfxOn]);

  // Load high score + persisted settings
  useEffect(() => {
    try {
      const v = localStorage.getItem(HIGH_SCORE_KEY);
      if (v) setHighScore(parseInt(v, 10) || 0);
      const s = localStorage.getItem(SETTINGS_KEY);
      if (s) {
        const p = JSON.parse(s) as Partial<{
          difficulty: Difficulty; sfxOn: boolean; musicOn: boolean; volume: number;
        }>;
        if (p.difficulty) setDifficulty(p.difficulty);
        if (typeof p.sfxOn === "boolean") setSfxOn(p.sfxOn);
        if (typeof p.musicOn === "boolean") setMusicOn(p.musicOn);
        if (typeof p.volume === "number") setVolume(p.volume);
      }
    } catch {}
  }, []);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ difficulty, sfxOn, musicOn, volume }),
      );
    } catch {}
  }, [difficulty, sfxOn, musicOn, volume]);

  // Push audio settings to engine live (no restart needed)
  useEffect(() => { setAudioVolume(volume); }, [volume]);
  useEffect(() => { setSfxEnabled(sfxOn); }, [sfxOn]);
  useEffect(() => { setMusicEnabled(musicOn); }, [musicOn]);

  // Music playback bound to game state (music gain handles the mute)
  useEffect(() => {
    if (status === "playing") startMusic();
    else stopMusic();
    return () => stopMusic();
  }, [status]);

  // Elapsed timer
  useEffect(() => {
    if (status !== "playing") return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  const changeDirection = useCallback((next: Direction) => {
    const current = queuedDirRef.current ?? directionRef.current;
    if (OPPOSITE[current] === next || current === next) return;
    queuedDirRef.current = next;
  }, []);

  const step = useCallback(() => {
    if (statusRef.current !== "playing") return;

    if (queuedDirRef.current) {
      directionRef.current = queuedDirRef.current;
      queuedDirRef.current = null;
    }
    const dir = directionRef.current;
    const vec = DIR_VECTORS[dir];
    const currentSnake = snakeRef.current;
    const head = currentSnake[0];
    const newHead: Point = { x: head.x + vec.x, y: head.y + vec.y };

    // Wall collision
    if (newHead.x < 0 || newHead.y < 0 || newHead.x >= BOARD_SIZE || newHead.y >= BOARD_SIZE) {
      endGame();
      return;
    }
    // Self collision (ignore tail because it moves)
    const willEat = newHead.x === foodRef.current.x && newHead.y === foodRef.current.y;
    const body = willEat ? currentSnake : currentSnake.slice(0, -1);
    if (body.some((s) => s.x === newHead.x && s.y === newHead.y)) {
      endGame();
      return;
    }

    const nextSnake = [newHead, ...body];
    setSnake(nextSnake);
    setDirection(dir);

    if (willEat) {
      setScore((s) => s + 1);
      setFood(randomFood(nextSnake));
      setAteTick((t) => t + 1);
      if (sfxOnRef.current) sfx.eat();
    }
  }, []);

  const endGame = useCallback(() => {
    statusRef.current = "gameover";
    setStatus("gameover");
    if (sfxOnRef.current) sfx.gameOver();
    stopMusic();
    setScore((s) => {
      setHighScore((hi) => {
        const nh = Math.max(hi, s);
        try { localStorage.setItem(HIGH_SCORE_KEY, String(nh)); } catch {}
        return nh;
      });
      return s;
    });
  }, []);

  // Game tick
  useEffect(() => {
    if (status !== "playing") return;
    const speed = DIFFICULTY_SPEED[difficulty];
    const id = setInterval(step, speed);
    return () => clearInterval(id);
  }, [status, difficulty, step]);

  const beginCountdown = useCallback(() => {
    // Reset board
    const initialSnake = centerSnake();
    setSnake(initialSnake);
    setFood(randomFood(initialSnake));
    setDirection("RIGHT");
    directionRef.current = "RIGHT";
    queuedDirRef.current = null;
    setScore(0);
    setElapsed(0);
    setStatus("countdown");
    setCountdown(3);
  }, []);

  // Countdown effect
  useEffect(() => {
    if (status !== "countdown") return;
    if (countdown <= 0) {
      setStatus("playing");
      if (sfxOnRef.current) sfx.start();
      return;
    }
    if (sfxOnRef.current) sfx.tick();
    const id = setTimeout(() => setCountdown((c) => c - 1), 800);
    return () => clearTimeout(id);
  }, [status, countdown]);

  const togglePause = useCallback(() => {
    setStatus((s) => (s === "playing" ? "paused" : s === "paused" ? "playing" : s));
  }, []);

  const restart = useCallback(() => {
    beginCountdown();
  }, [beginCountdown]);

  // Keyboard controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) e.preventDefault();
      if (k === "arrowup" || k === "w") changeDirection("UP");
      else if (k === "arrowdown" || k === "s") changeDirection("DOWN");
      else if (k === "arrowleft" || k === "a") changeDirection("LEFT");
      else if (k === "arrowright" || k === "d") changeDirection("RIGHT");
      else if (k === "p") togglePause();
      else if (k === "r") restart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [changeDirection, togglePause, restart]);

  return {
    snake, food, direction, status, score, highScore, difficulty,
    sfxOn, musicOn, volume, elapsed, countdown, ateTick,
    setDifficulty, setSfxOn, setMusicOn, setVolume,
    start: beginCountdown, togglePause, restart, changeDirection,
  };
}
