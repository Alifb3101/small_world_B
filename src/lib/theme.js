import { gsap } from './gsap';

/** Sky colours per scene: [top, bottom, horizon haze]. */
export const THEMES = {
  arrival: ['#020207', '#06061a', '#0d0a24'],
  overthink: ['#0a0920', '#170f2e', '#2a1640'],
  notes: ['#080a20', '#10122e', '#231c44'],
  music: ['#05071a', '#0b0f2a', '#1b1838'],
  reel: ['#0a0b1e', '#15142c', '#2c2238'],
  cartoon: ['#090c22', '#171a36', '#2e2748'],
  tomjerry: ['#090c22', '#171a36', '#2e2748'],
  paper: ['#0c0a1c', '#1b1428', '#33243a'],
  openwhen: ['#0d0a1d', '#1d1529', '#3a2838'],
  loud: ['#110a1c', '#1f0f28', '#3a1a38'],
  game: ['#0e0818', '#1c0d24', '#361536'],
  daily: ['#060a1c', '#0c1730', '#1c2a48'],
  late: ['#04050f', '#070a1c', '#101530'],
  message: ['#020206', '#05050f', '#0c0a1c'],
  final: ['#010104', '#03041a', '#0f1436'],
};

let current = null;
let front = 0;

const paint = (el, [a, b, c]) => {
  el.style.background = `radial-gradient(130% 70% at 50% 115%, ${c} 0%, transparent 65%), linear-gradient(180deg, ${a} 0%, ${b} 100%)`;
};

/**
 * Two stacked sky layers; the new colours are painted once on the hidden one
 * and it fades in. Only opacity animates, so nothing repaints per frame.
 */
export function setTheme(name) {
  if (name === current || !THEMES[name]) return;
  const layers = document.querySelectorAll('.sky-bg > i');
  if (layers.length < 2) return;
  const first = current === null;
  current = name;
  const next = layers[1 - front];
  const prev = layers[front];
  paint(next, THEMES[name]);
  gsap.killTweensOf(layers);
  if (first) {
    gsap.set(next, { opacity: 1 });
    gsap.set(prev, { opacity: 0 });
  } else {
    gsap.set(next, { zIndex: 1 });
    gsap.set(prev, { zIndex: 0 });
    gsap.fromTo(next, { opacity: 0 }, { opacity: 1, duration: 1.8, ease: 'sine.inOut' });
  }
  front = 1 - front;
}
