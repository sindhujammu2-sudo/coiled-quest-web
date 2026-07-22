import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { Play, Pause, RotateCcw, Gamepad2, Info, Home } from "lucide-react";
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

  // Auto-start countdown when entering the game screen
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
          <div key={g.countdown} className="text-7xl sm:text-8xl font-bold text-gradient animate-countdown">
            {g.countdown > 0 ? g.countdown : "GO"}
          </div>
        </div>
      );
    }
    if (g.status === "paused") {
      return (
        <div className="absolute inset-0 grid place-items-center bg-background/60 backdrop-blur-md animate-fade-in-up">
          <div className="glass rounded-2xl px-6 py-4 text-center">
            <div className="text-2xl font-bold">Paused</div>
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
            className="inline-flex items-center gap-2 rounded-2xl gradient-primary px-6 py-3 font-semibold text-primary-foreground hover:brightness-110 transition-all active:scale-[0.98] glow-primary"
          >
            <Play className="h-5 w-5" /> Start Game
          </button>
        </div>
      );
    }
    if (g.status === "gameover") {
      return <GameOverModal score={g.score} highScore={g.highScore} onPlayAgain={g.restart} />;
    }
    return null;
  }, [g.status, g.countdown, g.score, g.highScore, g.start, g.restart]);

  return (
    <main className="min-h-screen w-full px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl gradient-primary glow-primary">
              <Gamepad2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-xl sm:text-2xl font-bold tracking-tight">
                <span className="text-gradient">Neon Snake</span>
              </h1>
              <p className="hidden sm:block text-xs text-muted-foreground">Classic snake, modern feel.</p>
            </div>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl glass px-3 py-2 text-sm font-semibold hover:bg-primary/10 transition-colors"
          >
            <Home className="h-4 w-4" /> Home
          </Link>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Board column */}
          <div className="space-y-4">
            <ScorePanel score={g.score} highScore={g.highScore} elapsed={g.elapsed} />
            <div className="relative">
              <GameBoard snake={g.snake} food={g.food} ateTick={g.ateTick} overlay={overlay} onSwipe={g.changeDirection} />
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {g.status === "idle" || g.status === "gameover" ? (
                <button
                  onClick={g.start}
                  className="inline-flex items-center gap-2 rounded-xl gradient-primary px-4 py-2.5 font-semibold text-primary-foreground hover:brightness-110 transition-all active:scale-[0.98]"
                >
                  <Play className="h-4 w-4" /> Start
                </button>
              ) : (
                <button
                  onClick={g.togglePause}
                  disabled={g.status === "countdown"}
                  className="inline-flex items-center gap-2 rounded-xl glass px-4 py-2.5 font-semibold hover:bg-primary/10 transition-colors disabled:opacity-50"
                >
                  {g.status === "paused" ? <><Play className="h-4 w-4" /> Resume</> : <><Pause className="h-4 w-4" /> Pause</>}
                </button>
              )}
              <button
                onClick={g.restart}
                className="inline-flex items-center gap-2 rounded-xl glass px-4 py-2.5 font-semibold hover:bg-primary/10 transition-colors"
              >
                <RotateCcw className="h-4 w-4" /> Restart
              </button>
            </div>

            {/* Swipe on the board to change direction on touch devices */}
            <p className="lg:hidden text-center text-xs text-muted-foreground pt-1">
              Swipe up, down, left, or right on the board to steer.
            </p>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
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
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">How to play</h2>
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

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-block rounded-md border border-border bg-secondary/60 px-1.5 py-0.5 text-[11px] font-medium text-foreground mx-0.5">
      {children}
    </kbd>
  );
}
