import { Timer, Trophy, Apple } from "lucide-react";

interface Props {
  score: number;
  highScore: number;
  elapsed: number;
}

function fmt(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const r = (s % 60).toString().padStart(2, "0");
  return `${m}:${r}`;
}

export function ScorePanel({ score, highScore, elapsed }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      <Stat icon={<Apple className="h-4 w-4" />} label="Score" value={score} />
      <Stat icon={<Trophy className="h-4 w-4" />} label="Best" value={highScore} />
      <Stat icon={<Timer className="h-4 w-4" />} label="Time" value={fmt(elapsed)} />
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="glass rounded-xl px-3 py-2.5 min-w-0">
      <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] sm:text-xs uppercase tracking-wider">
        {icon}<span className="truncate">{label}</span>
      </div>
      <div className="mt-0.5 text-lg sm:text-xl font-bold tabular-nums truncate">{value}</div>
    </div>
  );
}
