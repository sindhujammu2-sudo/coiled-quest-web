import { Trophy, RotateCcw, Home, Skull } from "lucide-react";

interface Props {
  score: number;
  highScore: number;
  onPlayAgain: () => void;
  onHome?: () => void;
}

export function GameOverModal({ score, highScore, onPlayAgain, onHome }: Props) {
  const isNewHigh = score > 0 && score >= highScore;
  return (
    <div className="absolute inset-0 z-10 grid place-items-center bg-background/70 backdrop-blur-md animate-fade-in-up">
      <div className="glass rounded-3xl p-6 sm:p-8 mx-4 w-full max-w-sm text-center animate-fade-in-up">
        <div className="mx-auto mb-4 relative h-16 w-16">
          <div className="absolute inset-0 rounded-full gradient-accent blur-lg opacity-70" />
          <div className="relative grid h-full w-full place-items-center rounded-full gradient-accent">
            {isNewHigh ? (
              <Trophy className="h-8 w-8 text-accent-foreground" />
            ) : (
              <Skull className="h-8 w-8 text-accent-foreground" />
            )}
          </div>
        </div>

        <h2 className="font-display text-3xl font-black uppercase tracking-wider text-foreground">
          Game Over
        </h2>
        {isNewHigh && (
          <p className="mt-2 font-display text-sm font-bold uppercase tracking-[0.25em] text-gradient">
            ★ New High Score ★
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border/60 bg-secondary/40 p-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Score</div>
            <div className="mt-1 font-display text-3xl font-bold tabular-nums text-foreground">{score}</div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-secondary/40 p-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Best</div>
            <div className="mt-1 font-display text-3xl font-bold tabular-nums text-gradient">
              {Math.max(score, highScore)}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            onClick={onPlayAgain}
            className="inline-flex items-center gap-2 justify-center rounded-xl gradient-primary text-primary-foreground font-display font-bold uppercase tracking-wider px-4 py-3 hover:brightness-110 transition-all active:scale-[0.98] glow-primary"
          >
            <RotateCcw className="h-4 w-4" /> Play Again
          </button>
          {onHome && (
            <button
              onClick={onHome}
              className="inline-flex items-center gap-2 justify-center rounded-xl border border-border bg-secondary/40 font-display font-bold uppercase tracking-wider px-4 py-3 hover:bg-primary/10 transition-all active:scale-[0.98]"
            >
              <Home className="h-4 w-4" /> Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
