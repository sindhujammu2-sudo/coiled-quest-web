import { Trophy, RotateCcw } from "lucide-react";

interface Props {
  score: number;
  highScore: number;
  onPlayAgain: () => void;
}

export function GameOverModal({ score, highScore, onPlayAgain }: Props) {
  const isNewHigh = score > 0 && score >= highScore;
  return (
    <div className="absolute inset-0 z-10 grid place-items-center bg-background/70 backdrop-blur-md animate-fade-in-up">
      <div className="glass rounded-2xl p-6 sm:p-8 mx-4 w-full max-w-sm text-center">
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full gradient-accent">
          <Trophy className="h-7 w-7 text-accent-foreground" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Game Over</h2>
        {isNewHigh && (
          <p className="mt-1 text-sm text-gradient font-semibold">New High Score!</p>
        )}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="glass rounded-xl p-3">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Score</div>
            <div className="mt-1 text-2xl font-bold">{score}</div>
          </div>
          <div className="glass rounded-xl p-3">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Best</div>
            <div className="mt-1 text-2xl font-bold">{Math.max(score, highScore)}</div>
          </div>
        </div>
        <button
          onClick={onPlayAgain}
          className="mt-6 inline-flex items-center gap-2 justify-center w-full rounded-xl gradient-primary text-primary-foreground font-semibold px-4 py-3 hover:brightness-110 transition-all active:scale-[0.98]"
        >
          <RotateCcw className="h-4 w-4" /> Play Again
        </button>
      </div>
    </div>
  );
}
