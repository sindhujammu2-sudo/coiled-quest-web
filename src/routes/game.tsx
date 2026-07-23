import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { Play, Pause, RotateCcw, Info, Home } from "lucide-react";
import { useSnakeGame } from "@/hooks/useSnakeGame";
import { GameBoard } from "@/components/snake/GameBoard";
import { ScorePanel } from "@/components/snake/ScorePanel";
import { GameOverModal } from "@/components/snake/GameOverModal";
import { SettingsPanel } from "@/components/snake/SettingsPanel";

export const Route = createFileRoute("/game")({
  component: SnakePage,
});

function SnakePage() {
  const g = useSnakeGame();
  const navigate = useNavigate();

  useEffect(() => {
    let shouldRestart = false;
    try {
      shouldRestart = sessionStorage.getItem("snake:restart") === "1";
      if (shouldRestart) sessionStorage.removeItem("snake:restart");
      sessionStorage.setItem("snake:started", "1");
    } catch {}
    if (shouldRestart) g.restart();
    else if (g.status === "idle") g.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const overlay = useMemo(() => {
    if (g.status === "countdown") {
      return (
        <div className="absolute inset-0 grid place-items-center bg-background/40 backdrop-blur-sm">
          <div key={g.countdown} className="font-display text-7xl sm:text-8xl font-black text-gradient animate-countdown">
            {g.countdown > 0 ? g.countdown : "GO"}
          </div>
        </div>
      );
    }
    if (g.status === "paused") {
      return (
        <div className="absolute inset-0 grid place-items-center bg-background/60 backdrop-blur-md animate-fade-in-up">
          <div className="glass rounded-2xl px-8 py-5 text-center">
            <div className="font-display text-2xl font-bold uppercase tracking-widest text-gradient">Paused</div>
            <div className="text-sm text-muted-foreground mt-1">Press P or resume to continue</div>
          </div>
        </div>
      );
    }
    if (g.status === "idle") {
      return (
        <div className="absolute inset-0 grid place-items-center bg-background/50 backdrop-blur-sm">
          <button
            onClick={g.start}
            className="inline-flex items-center gap-2 rounded-2xl gradient-primary px-6 py-3 font-display font-bold uppercase tracking-wider text-primary-foreground hover:brightness-110 transition-all active:scale-[0.98] glow-primary"
          >
            <Play className="h-5 w-5" /> Start Game
          </button>
        </div>
      );
    }
    if (g.status === "gameover") {
      return (
        <GameOverModal
          score={g.score}
          highScore={g.highScore}
          onPlayAgain={g.restart}
          onHome={() => navigate({ to: "/" })}
        />
      );
    }
    return null;
  }, [g.status, g.countdown, g.score, g.highScore, g.start, g.restart, navigate]);

  const isRunning = g.status === "playing" || g.status === "paused" || g.status === "countdown";

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-orbs">
      <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-5 sm:py-8">
        {/* Top bar */}
        <header className="glass rounded-2xl p-2 sm:p-3 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 sm:flex sm:gap-3">
          <Link
            to="/"
            aria-label="Home"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold hover:bg-primary/10 active:scale-[0.97] transition-all"
          >
            <Home className="h-5 w-5" />
            <span className="hidden sm:inline">Home</span>
          </Link>

          <div className="hidden sm:block h-6 w-px bg-border" />

          <div className="min-w-0 flex items-center justify-end gap-2 sm:flex-1 sm:justify-start sm:gap-3">
            <StatChip label="Score" value={g.score} accent />
            <StatChip label="Best" value={g.highScore} />
          </div>

          <div className="col-span-2 grid grid-cols-2 gap-2 sm:col-auto sm:flex sm:items-center sm:gap-2">
            {isRunning ? (
              <button
                onClick={g.togglePause}
                disabled={g.status === "countdown"}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl gradient-primary px-4 text-sm font-semibold text-primary-foreground hover:brightness-110 active:scale-[0.97] transition-all disabled:opacity-50"
              >
                {g.status === "paused" ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                <span>{g.status === "paused" ? "Resume" : "Pause"}</span>
              </button>
            ) : (
              <button
                onClick={g.start}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl gradient-primary px-4 text-sm font-semibold text-primary-foreground hover:brightness-110 active:scale-[0.97] transition-all"
              >
                <Play className="h-5 w-5" />
                <span>Start</span>
              </button>
            )}
            <button
              onClick={g.restart}
              aria-label="Restart"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold hover:bg-primary/10 active:scale-[0.97] border border-border transition-all"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Restart</span>
            </button>
          </div>
        </header>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
          {/* Board column */}
          <div className="space-y-4">
            <div className="lg:hidden">
              <ScorePanel score={g.score} highScore={g.highScore} elapsed={g.elapsed} />
            </div>
            <div className="relative">
              <GameBoard snake={g.snake} food={g.food} ateTick={g.ateTick} overlay={overlay} onSwipe={g.changeDirection} />
            </div>
            <p className="lg:hidden text-center text-xs text-muted-foreground pt-1">
              Swipe on the board to steer.
            </p>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="hidden lg:block">
              <ScorePanel score={g.score} highScore={g.highScore} elapsed={g.elapsed} />
            </div>
            <SettingsPanel
              difficulty={g.difficulty}
              onDifficulty={g.setDifficulty}
              sfxOn={g.sfxOn}
              onSfx={g.setSfxOn}
              musicOn={g.musicOn}
              onMusic={g.setMusicOn}
              volume={g.volume}
              onVolume={g.setVolume}
            />

            <div className="glass rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Info className="h-4 w-4 text-primary" />
                <h2 className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">How to play</h2>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Kbd>↑ ↓ ← →</Kbd> or <Kbd>W A S D</Kbd> to move</li>
                <li><Kbd>P</Kbd> to pause/resume</li>
                <li><Kbd>R</Kbd> to restart</li>
                <li>Eat the red dot to grow and score</li>
                <li>Avoid walls and yourself</li>
              </ul>
            </div>
          </aside>
        </div>

        <footer className="mt-10 text-center text-xs text-muted-foreground">
          Built with React, TypeScript & Tailwind.
        </footer>
      </div>
    </main>
  );
}

function StatChip({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="flex items-baseline gap-2 rounded-xl px-3 py-1.5 border border-border/60 bg-secondary/40 min-w-0">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">{label}</span>
      <span className={`font-display text-lg sm:text-xl font-bold tabular-nums ${accent ? "text-gradient" : "text-foreground"}`}>
        {value.toString().padStart(3, "0")}
      </span>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-block rounded-md border border-border bg-secondary/60 px-1.5 py-0.5 text-[11px] font-medium text-foreground mx-0.5">
      {children}
    </kbd>
  );
}
