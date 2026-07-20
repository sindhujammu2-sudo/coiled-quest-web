import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { Direction } from "@/lib/snake/types";

interface Props {
  onDirection: (d: Direction) => void;
}

function PadButton({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="glass grid place-items-center rounded-2xl h-14 w-14 sm:h-16 sm:w-16 text-primary active:scale-95 transition-transform hover:bg-primary/10"
    >
      {children}
    </button>
  );
}

export function TouchControls({ onDirection }: Props) {
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-2 w-fit mx-auto select-none touch-manipulation">
      <div />
      <PadButton label="Up" onClick={() => onDirection("UP")}><ChevronUp className="h-7 w-7" /></PadButton>
      <div />
      <PadButton label="Left" onClick={() => onDirection("LEFT")}><ChevronLeft className="h-7 w-7" /></PadButton>
      <div />
      <PadButton label="Right" onClick={() => onDirection("RIGHT")}><ChevronRight className="h-7 w-7" /></PadButton>
      <div />
      <PadButton label="Down" onClick={() => onDirection("DOWN")}><ChevronDown className="h-7 w-7" /></PadButton>
      <div />
    </div>
  );
}
