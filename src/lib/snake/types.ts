export type Point = { x: number; y: number };
export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
export type Difficulty = "easy" | "medium" | "hard";
export type GameStatus = "idle" | "countdown" | "playing" | "paused" | "gameover";

export const BOARD_SIZE = 20;

export const DIFFICULTY_SPEED: Record<Difficulty, number> = {
  easy: 160,
  medium: 110,
  hard: 70,
};

export const DIR_VECTORS: Record<Direction, Point> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

export const OPPOSITE: Record<Direction, Direction> = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};
