import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Play, Pause, RotateCcw, Gamepad2, Trophy } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Neon Snake — Play the Modern Snake Game" },
      {
        name: "description",
        content:
          "Neon Snake landing page. Start a new game, view your high score, and jump into a modern take on the classic Snake game.",
      },
      { property: "og:title", content: "Neon Snake — Play the Modern Snake Game" },
      {
        property: "og:description",
        content:
          "Start a new game, view your high score, and jump into a modern take on the classic Snake game.",
      },
    ],
  }),
  component: LandingPage,
});

const HIGH_SCORE_KEY = "snake:highScore";

function LandingPage() {
  const navigate = useNavigate();
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(HIGH_SCORE_KEY);
      if (v) setHighScore(parseInt(v, 10) || 0);
      setGameStarted(sessionStorage.getItem("snake:started") === "1");
    } catch {}
  }, []);

  const handleStart = () => {
    try {
      sessionStorage.setItem("snake:started", "1");
    } catch {}
    navigate({ to: "/game" });
  };

  const handleRestart = () => {
    try {
      sessionStorage.setItem("snake:started", "1");
      sessionStorage.setItem("snake:restart", "1");
    } catch {}
    navigate({ to: "/game" });
  };

  return (
    <main className="min-h-screen w-full grid place-items-center px-4 py-10">
      <div className="w-full max-w-xl text-center animate-fade-in-up">
        {/* Logo */}
        <div className="mx-auto mb-6 grid h-28 w-28 sm:h-32 sm:w-32 place-items-center rounded-3xl gradient-primary glow-primary animate-countdown">
          <Gamepad2 className="h-16 w-16 sm:h-20 sm:w-20 text-primary-foreground" />
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
          <span className="text-gradient">Snake Game</span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground">
          A modern, neon take on the classic. Eat, grow, and beat your best.
        </p>

        {/* High Score */}
        <div className="glass mx-auto mt-8 inline-flex items-center gap-3 rounded-2xl px-5 py-3">
          <Trophy className="h-5 w-5 text-primary" />
          <div className="text-left">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              High Score
            </div>
            <div className="text-2xl font-bold tabular-nums">{highScore}</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleStart}
            className="inline-flex items-center gap-2 rounded-2xl gradient-primary px-6 py-3 font-semibold text-primary-foreground hover:brightness-110 transition-all active:scale-[0.98] glow-primary"
          >
            <Play className="h-5 w-5" /> Start
          </button>
          <button
            disabled={!gameStarted}
            onClick={() => navigate({ to: "/game" })}
            className="inline-flex items-center gap-2 rounded-2xl glass px-6 py-3 font-semibold hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title={gameStarted ? "Resume / pause current game" : "Start a game first"}
          >
            <Pause className="h-5 w-5" /> Pause
          </button>
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 rounded-2xl glass px-6 py-3 font-semibold hover:bg-primary/10 transition-colors"
          >
            <RotateCcw className="h-5 w-5" /> Restart
          </button>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Tip: use <Link to="/game" className="text-primary hover:underline">arrow keys, WASD, or swipe</Link> to steer.
        </p>
      </div>
    </main>
  );
}
