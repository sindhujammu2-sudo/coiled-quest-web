import { memo, useEffect, useRef } from "react";
import { BOARD_SIZE, type Direction, type Point } from "@/lib/snake/types";

interface Props {
  snake: Point[];
  food: Point;
  ateTick: number;
  overlay?: React.ReactNode;
  onSwipe?: (dir: Direction) => void;
}

function GameBoardImpl({ snake, food, ateTick, overlay, onSwipe }: Props) {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;

    const onStart = (e: TouchEvent) => {
      // Prevent multi-touch pinch/zoom while interacting with the board
      if (e.touches.length > 1) {
        e.preventDefault();
        touchStart.current = null;
        return;
      }
      const t = e.touches[0];
      touchStart.current = { x: t.clientX, y: t.clientY };
      e.preventDefault();
    };
    const onMove = (e: TouchEvent) => {
      // Always block scroll/zoom while touching the board
      e.preventDefault();
    };
    const onEnd = (e: TouchEvent) => {
      const start = touchStart.current;
      touchStart.current = null;
      if (!start || !onSwipe) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      if (Math.max(absX, absY) < 20) return;
      if (absX > absY) onSwipe(dx > 0 ? "RIGHT" : "LEFT");
      else onSwipe(dy > 0 ? "DOWN" : "UP");
      e.preventDefault();
    };
    const onGesture = (e: Event) => e.preventDefault();

    el.addEventListener("touchstart", onStart, { passive: false });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd, { passive: false });
    el.addEventListener("touchcancel", onEnd, { passive: false });
    // iOS Safari pinch/zoom gesture events
    el.addEventListener("gesturestart", onGesture as EventListener);
    el.addEventListener("gesturechange", onGesture as EventListener);
    el.addEventListener("gestureend", onGesture as EventListener);

    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
      el.removeEventListener("gesturestart", onGesture as EventListener);
      el.removeEventListener("gesturechange", onGesture as EventListener);
      el.removeEventListener("gestureend", onGesture as EventListener);
    };
  }, [onSwipe]);


  const cellPct = 100 / BOARD_SIZE;
  const headKey = `${snake[0].x},${snake[0].y}`;
  const bodySet = new Set(snake.slice(1).map((s) => `${s.x},${s.y}`));

  return (
    <div
      ref={boardRef}
      className="relative aspect-square w-full max-w-[560px] mx-auto rounded-2xl glass overflow-hidden glow-primary touch-none select-none overscroll-contain"
      style={{
        backgroundImage:
          `linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px)`,
        backgroundSize: `${cellPct}% ${cellPct}%`,
        touchAction: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
      }}
      role="img"
      aria-label="Snake game board. Swipe to change direction."
    >

      {/* Food */}
      <div
        key={`food-${food.x}-${food.y}`}
        className="absolute animate-food-pop"
        style={{
          left: `${food.x * cellPct}%`,
          top: `${food.y * cellPct}%`,
          width: `${cellPct}%`,
          height: `${cellPct}%`,
          padding: `${cellPct * 0.08}%`,
        }}
      >
        <div
          className="relative h-full w-full animate-food"
          style={{
            filter: "drop-shadow(0 0 6px var(--color-food)) drop-shadow(0 0 10px var(--color-food))",
          }}
        >
          <svg viewBox="0 0 32 32" className="h-full w-full" aria-hidden="true">
            <defs>
              <radialGradient id="appleGrad" cx="0.35" cy="0.3" r="0.8">
                <stop offset="0%" stopColor="oklch(0.9 0.18 30)" />
                <stop offset="55%" stopColor="var(--color-food)" />
                <stop offset="100%" stopColor="oklch(0.45 0.2 20)" />
              </radialGradient>
            </defs>
            {/* Leaf */}
            <path
              d="M18 8c2-3 6-4 8-3 0 3-2 6-5 7-1.5.5-3 .3-4 0z"
              fill="oklch(0.72 0.18 145)"
              stroke="oklch(0.45 0.15 145)"
              strokeWidth="0.6"
              strokeLinejoin="round"
            />
            {/* Stem */}
            <path d="M16 10c0-2 .6-3 1.6-4" stroke="oklch(0.35 0.08 60)" strokeWidth="1.3" strokeLinecap="round" fill="none" />
            {/* Apple body */}
            <path
              d="M16 11c-4-2-9 0-9 6 0 6 4 12 9 12s9-6 9-12c0-6-5-8-9-6z"
              fill="url(#appleGrad)"
              stroke="oklch(0.4 0.2 25)"
              strokeWidth="0.5"
            />
            {/* Highlight */}
            <ellipse cx="12" cy="16" rx="2.2" ry="3" fill="oklch(0.97 0.06 30)" opacity="0.7" />
          </svg>
        </div>
      </div>

      {/* Snake */}
      {snake.map((seg, i) => {
        const key = `${seg.x},${seg.y}`;
        const isHead = i === 0;
        return (
          <div
            key={`seg-${i}-${key}`}
            className="absolute transition-[left,top] duration-75 ease-linear"
            style={{
              left: `${seg.x * cellPct}%`,
              top: `${seg.y * cellPct}%`,
              width: `${cellPct}%`,
              height: `${cellPct}%`,
              padding: `${cellPct * 0.06}%`,
              zIndex: isHead ? 2 : 1,
            }}
          >
            <div
              className="h-full w-full rounded-[22%]"
              style={{
                background: isHead
                  ? "linear-gradient(135deg, var(--color-snake-head), var(--color-snake))"
                  : "linear-gradient(135deg, var(--color-snake), oklch(0.62 0.16 155))",
                boxShadow: isHead
                  ? "0 0 12px var(--color-snake), inset 0 0 4px oklch(0.98 0.05 150)"
                  : "inset 0 0 3px oklch(0.35 0.1 155)",
              }}
            />
          </div>
        );
      })}

      {/* Ate flash */}
      <div key={`flash-${ateTick}`} className="pointer-events-none absolute inset-0" />

      {overlay}
      {/* silence unused warnings */}
      <span className="hidden">{headKey}{bodySet.size}</span>
    </div>
  );
}

export const GameBoard = memo(GameBoardImpl);
