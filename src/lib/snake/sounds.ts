// Simple WebAudio-based SFX (no external assets required).
let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let musicGain: GainNode | null = null;
let sfxGain: GainNode | null = null;

// User-tunable levels
let volume = 0.8; // master 0..1
let sfxEnabled = true;
let musicEnabled = true;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(ctx.destination);
    musicGain = ctx.createGain();
    musicGain.gain.value = musicEnabled ? 1 : 0;
    musicGain.connect(masterGain);
    sfxGain = ctx.createGain();
    sfxGain.gain.value = sfxEnabled ? 1 : 0;
    sfxGain.connect(masterGain);
  }
  return ctx;
}

export function setVolume(v: number) {
  volume = Math.max(0, Math.min(1, v));
  if (masterGain) masterGain.gain.value = volume;
}
export function setSfxEnabled(on: boolean) {
  sfxEnabled = on;
  if (sfxGain) sfxGain.gain.value = on ? 1 : 0;
}
export function setMusicEnabled(on: boolean) {
  musicEnabled = on;
  if (musicGain) musicGain.gain.value = on ? 1 : 0;
}

function beep(freq: number, duration: number, type: OscillatorType = "sine", gain = 0.08) {
  const c = getCtx();
  if (!c || !sfxGain) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
  osc.connect(g).connect(sfxGain);
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
  if (!c || !musicGain || musicTimer) return;
  const notes = [261.63, 329.63, 392, 523.25, 392, 329.63];
  let i = 0;
  musicTimer = setInterval(() => {
    if (!ctx || !musicGain) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = notes[i % notes.length];
    g.gain.setValueAtTime(0.03, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    osc.connect(g).connect(musicGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
    i++;
  }, 380);
}
export function stopMusic() {
  if (musicTimer) {
    clearInterval(musicTimer);
    musicTimer = null;
  }
}
