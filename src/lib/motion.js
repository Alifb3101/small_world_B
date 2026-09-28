export const REDUCED =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isDesktop = () => window.matchMedia('(min-width: 900px)').matches;

export const rand = (a, b) => a + Math.random() * (b - a);
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export function buzz(pattern = 10) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* unsupported */
  }
}
