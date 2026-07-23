import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Play, Pause, RotateCcw, Trophy, Sparkles } from "lucide-react";

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
    <main className="relative min-h-screen w-full overflow-hidden bg-orbs">
      {/* Ambient orbs */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative min-h-screen grid place-items-center px-4 py-12">
        <div className="w-full max-w-xl text-center animate-fade-in-up">
          {/* Logo */}
          <div className="mx-auto mb-8 relative h-28 w-28 sm:h-32 sm:w-32">
            <div className="absolute inset-0 rounded-3xl gradient-primary glow-primary blur-md opacity-70" />
            <div className="relative grid h-full w-full place-items-center rounded-3xl gradient-primary glow-primary">
              <SnakeLogo />
            </div>
          </div>

          {/* Title */}
          <h1 className="font-display text-5xl sm:text-7xl font-black tracking-tight uppercase">
            <span className="text-gradient">Snake</span>{" "}
            <span className="text-foreground">Game</span>
          </h1>

          {/* Tagline */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <p className="font-display text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-muted-foreground">
              Eat • Grow • Survive
            </p>
          </div>

          {/* High Score card */}
          <div className="glass mx-auto mt-10 flex items-center gap-4 rounded-2xl px-6 py-4 w-fit">
            <div className="grid h-11 w-11 place-items-center rounded-xl gradient-accent">
              <Trophy className="h-5 w-5 text-accent-foreground" />
            </div>
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                High Score
              </div>
              <div className="font-display text-3xl font-bold tabular-nums text-gradient">
                {highScore.toString().padStart(4, "0")}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleStart}
              className="group inline-flex items-center gap-2 rounded-2xl gradient-primary px-7 py-3.5 font-display font-bold uppercase tracking-wider text-primary-foreground hover:brightness-110 hover:-translate-y-0.5 transition-all active:scale-[0.97] glow-primary"
            >
              <Play className="h-5 w-5 transition-transform group-hover:translate-x-0.5" /> Start
            </button>
            <button
              disabled={!gameStarted}
              onClick={() => navigate({ to: "/game" })}
              className="inline-flex items-center gap-2 rounded-2xl glass px-6 py-3.5 font-display font-bold uppercase tracking-wider hover:bg-primary/10 hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              title={gameStarted ? "Resume / pause current game" : "Start a game first"}
            >
              <Pause className="h-5 w-5" /> Pause
            </button>
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 rounded-2xl glass px-6 py-3.5 font-display font-bold uppercase tracking-wider hover:bg-primary/10 hover:-translate-y-0.5 transition-all active:scale-[0.97]"
            >
              <RotateCcw className="h-5 w-5" /> Restart
            </button>
          </div>

          <p className="mt-10 text-xs text-muted-foreground">
            Steer with <Link to="/game" className="text-primary hover:underline">arrow keys, WASD, or swipe</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}

function SnakeLogo() {
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16 sm:h-20 sm:w-20 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20 h16 a6 6 0 0 1 6 6 v12 a6 6 0 0 0 6 6 h10" />
      <circle cx="49" cy="20" r="3.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
