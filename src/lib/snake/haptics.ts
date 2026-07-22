// Subtle haptic feedback helpers (no-op on unsupported devices)
function vibrate(pattern: number | number[]) {
  if (typeof navigator === "undefined") return;
  const nav = navigator as Navigator & { vibrate?: (p: number | number[]) => boolean };
  try {
    nav.vibrate?.(pattern);
  } catch {
    // ignore
  }
}

export const haptics = {
  eat: () => vibrate(15),
  gameOver: () => vibrate([40, 60, 120]),
  pause: () => vibrate(25),
};
