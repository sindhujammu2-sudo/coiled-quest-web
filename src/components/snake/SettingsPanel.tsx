import { Settings2, Volume2, VolumeX, Music, Music2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { Difficulty } from "@/lib/snake/types";

interface Props {
  difficulty: Difficulty;
  onDifficulty: (d: Difficulty) => void;
  sfxOn: boolean;
  onSfx: (v: boolean) => void;
  musicOn: boolean;
  onMusic: (v: boolean) => void;
  volume: number;
  onVolume: (v: number) => void;
}

const DIFFICULTIES: { id: Difficulty; label: string }[] = [
  { id: "easy", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "hard", label: "Hard" },
];

export function SettingsPanel({
  difficulty,
  onDifficulty,
  sfxOn,
  onSfx,
  musicOn,
  onMusic,
  volume,
  onVolume,
}: Props) {
  return (
    <div className="glass rounded-2xl p-4 space-y-5">
      <div className="flex items-center gap-2">
        <Settings2 className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Settings
        </h2>
      </div>

      {/* Difficulty */}
      <div>
        <div className="mb-2 text-xs font-medium text-muted-foreground">Difficulty</div>
        <div className="grid grid-cols-3 gap-2">
          {DIFFICULTIES.map((d) => {
            const active = difficulty === d.id;
            return (
              <button
                key={d.id}
                onClick={() => onDifficulty(d.id)}
                className={
                  "rounded-xl px-3 py-2 text-sm font-semibold transition-all active:scale-95 " +
                  (active
                    ? "gradient-primary text-primary-foreground glow-primary"
                    : "glass hover:bg-primary/10")
                }
              >
                {d.label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Speed takes effect on the next game.
        </p>
      </div>

      {/* Sound effects */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {sfxOn ? (
            <Volume2 className="h-4 w-4 text-primary" />
          ) : (
            <VolumeX className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-sm font-medium">Sound effects</span>
        </div>
        <Switch checked={sfxOn} onCheckedChange={onSfx} aria-label="Toggle sound effects" />
      </div>

      {/* Music */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {musicOn ? (
            <Music className="h-4 w-4 text-primary" />
          ) : (
            <Music2 className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-sm font-medium">Music</span>
        </div>
        <Switch checked={musicOn} onCheckedChange={onMusic} aria-label="Toggle music" />
      </div>

      {/* Volume */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">Volume</span>
          <span className="text-xs tabular-nums text-muted-foreground">
            {Math.round(volume * 100)}%
          </span>
        </div>
        <Slider
          value={[Math.round(volume * 100)]}
          min={0}
          max={100}
          step={1}
          onValueChange={(v) => onVolume((v[0] ?? 0) / 100)}
          aria-label="Master volume"
        />
      </div>
    </div>
  );
}
