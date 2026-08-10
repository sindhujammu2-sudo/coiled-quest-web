# 🐍 Snake Game

A modern, responsive remake of the classic Snake game — built with React 19, TypeScript, TanStack Start, and Tailwind CSS v4. Dark neon theme, glassmorphism UI, WebAudio sound effects, haptics, and full touch support.

**Live demo:** https://coiled-quest-web.lovable.app

---

## Features

- **Classic gameplay** — 20×20 grid, food spawning, growth, wall & self collision detection
- **Two-screen flow** — polished landing page (`/`) and dedicated game screen (`/game`)
- **Multiple control schemes** — Arrow keys, WASD, `P` to pause, `R` to restart, and swipe gestures on touch devices
- **Three difficulty levels** — Easy, Medium, Hard (tick speeds of 160 / 110 / 70 ms)
- **Live settings panel** — change difficulty, toggle SFX/music, and adjust master volume without restarting
- **Audio engine** — procedural WebAudio SFX (eat, game over, countdown) plus a looping background arpeggio, with independent music/SFX gain nodes
- **Haptic feedback** — subtle vibration on eat, pause, and game over (where supported)
- **Persistence** — high score and settings saved to `localStorage`
- **Mobile-first UX** — scroll, bounce, and pinch-zoom suppressed on the board for reliable swipes
- **Design system** — Orbitron/Inter typography, neon accents, ambient glow orbs, and glass surfaces driven entirely by semantic CSS tokens

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | React 19 + TanStack Start (file-based routing) |
| Language | TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v4 (CSS-first `@theme` tokens) |
| UI primitives | shadcn/ui + Radix UI |
| Icons | lucide-react |
| Audio | Web Audio API (no assets, fully procedural) |

## Getting Started

### Prerequisites

- Node.js 20+ (or [Bun](https://bun.sh))

### Installation

```bash
git clone <your-repo-url>
cd snake-game
bun install    # or: npm install
```

### Development

```bash
bun run dev    # http://localhost:8080
```

### Production build

```bash
bun run build
bun run preview
```

### Other scripts

| Script | Description |
| --- | --- |
| `dev` | Start the dev server with HMR |
| `build` | Production build |
| `build:dev` | Development-mode build |
| `preview` | Serve the production build locally |
| `lint` | Run ESLint |
| `format` | Format the codebase with Prettier |

## Project Structure

```text
src/
├── routes/
│   ├── __root.tsx           # App shell, fonts, global metadata
│   ├── index.tsx            # Home screen (logo, high score, Start/Pause/Restart)
│   └── game.tsx             # Game screen (top bar, board, settings sidebar)
├── components/snake/
│   ├── GameBoard.tsx        # Grid rendering, snake/food, swipe & gesture handling
│   ├── ScorePanel.tsx       # Score, high score, elapsed time
│   ├── SettingsPanel.tsx    # Difficulty, SFX/music toggles, volume slider
│   └── GameOverModal.tsx    # Final score, high score, Play Again / Home
├── hooks/
│   └── useSnakeGame.ts      # Core game loop, state machine, persistence
├── lib/snake/
│   ├── types.ts             # Constants, types, direction vectors
│   ├── sounds.ts            # WebAudio engine (master/music/SFX gain)
│   └── haptics.ts           # navigator.vibrate wrappers
└── styles.css               # Design tokens, glassmorphism & animation utilities
```

## How to Play

1. Press **Start** on the home screen (or open `/game`).
2. Steer the snake with the **arrow keys**, **WASD**, or by **swiping** on the board.
3. Eat the red dot to grow and score a point.
4. Avoid the walls and your own tail — one hit ends the run.
5. Beat your high score; it's saved automatically.

| Key | Action |
| --- | --- |
| `↑ ↓ ← →` / `W A S D` | Move |
| `P` | Pause / resume |
| `R` | Restart |

## Configuration

Gameplay constants live in `src/lib/snake/types.ts`:

```ts
export const BOARD_SIZE = 20;

export const DIFFICULTY_SPEED = {
  easy: 160,
  medium: 110,
  hard: 70,
};
```

Change `BOARD_SIZE` for a larger or smaller grid, or tune the tick intervals (in milliseconds) to adjust the pace.

## Accessibility & Performance

- Semantic HTML with descriptive `aria-label`s on the board and interactive controls
- Keyboard-only play fully supported
- Memoized board rendering to keep the game loop smooth
- Per-route metadata (title, description, Open Graph, Twitter card)

## License

MIT — free to use, modify, and distribute.
