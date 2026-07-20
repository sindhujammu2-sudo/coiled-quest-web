// Simple WebAudio-based SFX (no external assets required).
let ctx: AudioContext | null = null;
function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

function beep(freq: number, duration: number, type: OscillatorType = "sine", gain = 0.08) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
  osc.connect(g).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

export const sfx = {
  eat: () => beep(660, 0.09, "square", 0.06),
  gameOver: () => {
    beep(300, 0.15, "sawtooth", 0.08);
    setTimeout(() => beep(180, 0.25, "sawtooth", 0.08), 120);
  },
  start: () => beep(520, 0.08, "sine", 0.05),
  tick: () => beep(880, 0.05, "sine", 0.04),
};

// Background music: gentle looping arpeggio
let musicTimer: ReturnType<typeof setInterval> | null = null;
export function startMusic() {
  const c = getCtx();
  if (!c || musicTimer) return;
  const notes = [261.63, 329.63, 392, 523.25, 392, 329.63];
  let i = 0;
  musicTimer = setInterval(() => {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "triangle";
    osc.frequency.value = notes[i % notes.length];
    g.gain.setValueAtTime(0.03, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.4);
    osc.connect(g).connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + 0.4);
    i++;
  }, 380);
}
export function stopMusic() {
  if (musicTimer) {
    clearInterval(musicTimer);
    musicTimer = null;
  }
}
