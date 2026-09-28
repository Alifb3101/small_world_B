import { ScrollTrigger } from './gsap';
import { REDUCED } from './motion';

/**
 * Moves the camera between scenes. A transition runner (SceneTransition)
 * registers itself; goTo() plays the named transition and jumps the scroll
 * position at its midpoint, when the screen is fully covered.
 */

let runner = null;
let busy = false;

export function registerTransition(fn) {
  runner = fn;
  return () => {
    if (runner === fn) runner = null;
  };
}

export function jumpTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo(0, y);
  ScrollTrigger.update();
}

export async function goTo(id, type = 'dream') {
  if (busy) return;
  busy = true;
  try {
    if (runner) await runner(REDUCED ? 'fade' : type, id, () => jumpTo(id));
    else jumpTo(id);
  } finally {
    busy = false;
  }
}

export function currentSceneEl() {
  const mid = window.innerHeight / 2;
  return [...document.querySelectorAll('[data-scene]')].find((s) => {
    const r = s.getBoundingClientRect();
    return r.top <= mid && r.bottom >= mid;
  });
}

const locks = new Set();
let lockedAt = 0;

/** Scroll stays locked while any owner (intro, music, letter, game) holds it. */
export function lockScroll(on, owner = 'default') {
  const was = locks.size > 0;
  if (on) locks.add(owner);
  else locks.delete(owner);
  const is = locks.size > 0;
  if (is === was) return;
  if (is) lockedAt = window.scrollY;
  document.documentElement.classList.toggle('is-locked', is);
  if (!is && Math.abs(window.scrollY - lockedAt) > 2) window.scrollTo(0, lockedAt);
}
