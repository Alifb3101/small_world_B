import { createStore } from './store';
import { PLAYLIST } from '../data/content';

/**
 * Tiny Web Audio engine.
 * - sfx: synthesised interaction sounds (no files needed)
 * - ambience: a very quiet looping track (bgmusic.mp3)
 * - music: plays /audio/<file> if present, otherwise a generative fallback
 * Nothing makes sound until unlock() is called from a user gesture.
 */

const saved = (() => {
  try {
    return localStorage.getItem('zw-sound');
  } catch {
    return null;
  }
})();

export const audioState = createStore({
  enabled: saved !== 'off',
  unlocked: false,
  song: null,
  playing: false,
  loading: false,
  source: null,
  cue: false, // a letter is playing its own song, so everything else waits
});

const PENTA = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66];
/** Cross-origin file — no CORS, so loudness is the element volume, not a Web Audio gain. */
const BG_URL = 'https://pub-e1b8b115c4514a519c625b47dfe3ae13.r2.dev/bgmusic.mp3';
const BG_LEVEL = 0.04;

let ctx = null;
let master;
let sfxBus;
let musicBus;
let analyser;
let freq;
let noiseBuf;
let current = null;
let bgEl = null;
let bgTarget = BG_LEVEL;
let letterEl = null;
let bgHeld = false;
let holdGen = 0;
let bgGen = 0;
let mediaHold = 0;

function ensure() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try {
    if (navigator.audioSession) navigator.audioSession.type = 'playback';
  } catch {
    /* not supported */
  }
  ctx = new AC();
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -12;
  comp.ratio.value = 3;
  comp.connect(ctx.destination);
  master = ctx.createGain();
  master.gain.value = audioState.get().enabled ? 1 : 0;
  master.connect(comp);
  sfxBus = ctx.createGain();
  sfxBus.gain.value = 0.6;
  sfxBus.connect(master);
  musicBus = ctx.createGain();
  musicBus.gain.value = 0.9;
  analyser = ctx.createAnalyser();
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0.82;
  freq = new Uint8Array(analyser.frequencyBinCount);
  musicBus.connect(analyser);
  analyser.connect(master);

  noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) {
      ctx.suspend();
      current?.el?.pause();
      bgEl?.pause();
      letterEl?.pause();
    } else {
      ctx.resume();
      if (current?.el && audioState.get().playing && !current.suspended) current.el.play().catch(() => {});
      applyBg(0.4);
      if (letterEl && audioState.get().enabled && letterEl.paused) letterEl.play().catch(() => {});
    }
  });
  return ctx;
}

export function unlock() {
  const c = ensure();
  if (!c) return;
  if (c.state !== 'running') c.resume();
  if (!audioState.get().unlocked) {
    audioState.set({ unlocked: true });
    probeSongs();
  }
}

/* ---------- which song files actually exist ---------- */

/* Cross-origin songs (no CORS headers) can't go through Web Audio, so they are
 * faded with element.volume — which iOS treats as read-only. */
const canFade = (() => {
  try {
    const a = new Audio();
    a.volume = 0.5;
    return a.volume === 0.5;
  } catch {
    return false;
  }
})();
const fades = new WeakMap();

function fadeVolume(el, to, secs) {
  cancelAnimationFrame(fades.get(el));
  if (!canFade) return;
  if (secs <= 0) {
    el.volume = to;
    return;
  }
  const from = el.volume;
  const t0 = performance.now();
  const step = () => {
    const k = Math.min(1, (performance.now() - t0) / (secs * 1000));
    el.volume = from + (to - from) * k;
    if (k < 1) fades.set(el, requestAnimationFrame(step));
  };
  fades.set(el, requestAnimationFrame(step));
}

function release(el) {
  cancelAnimationFrame(fades.get(el));
  el.pause();
  el.removeAttribute('src');
  el.load();
}

const isExternal = (file) => /^(https?:)?\/\//.test(file);
const srcOf = (file) => (isExternal(file) || file.startsWith('/') ? file : `/audio/${file}`);
const available = {};

function probeSongs() {
  PLAYLIST.forEach(({ file }) => {
    if (!file || isExternal(file) || file in available) return;
    available[file] = undefined;
    fetch(srcOf(file), { method: 'HEAD', cache: 'no-store' })
      .then((r) => {
        const type = r.headers.get('content-type') || '';
        available[file] = r.ok && !type.includes('text/html');
      })
      .catch(() => {
        available[file] = false;
      });
  });
}

const now = () => ctx.currentTime;
const ready = () => ctx && ctx.state === 'running' && audioState.get().enabled;

function env(g, t, a, peak, d) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
}

function tone(type, f, t, dur, peak, { dest = sfxBus, a = 0.005, f2 } = {}) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + a + dur);
  env(g, t, a, peak, dur);
  o.connect(g).connect(dest);
  o.start(t);
  o.stop(t + a + dur + 0.05);
  return o;
}

function noise(t, dur, peak, { type = 'bandpass', f = 1200, q = 1, f2, dest = sfxBus, a = 0.005 } = {}) {
  const s = ctx.createBufferSource();
  s.buffer = noiseBuf;
  s.loop = true;
  const fl = ctx.createBiquadFilter();
  fl.type = type;
  fl.frequency.setValueAtTime(f, t);
  if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + a + dur);
  fl.Q.value = q;
  const g = ctx.createGain();
  env(g, t, a, peak, dur);
  s.connect(fl).connect(g).connect(dest);
  s.start(t, Math.random() * 0.5);
  s.stop(t + a + dur + 0.05);
}

const guard =
  (fn) =>
  (...args) => {
    if (!ready()) return;
    try {
      fn(now(), ...args);
    } catch {
      /* never let sound break the experience */
    }
  };

export const sfx = {
  tap: guard((t) => tone('sine', 880, t, 0.09, 0.07, { f2: 660 })),
  soft: guard((t) => tone('sine', 660, t, 0.25, 0.05, { a: 0.02 })),
  pop: guard((t, p = 1) => {
    tone('sine', 540 * p, t, 0.16, 0.32, { a: 0.002, f2: 90 });
    noise(t, 0.08, 0.22, { f: 1900 * p, q: 0.8 });
  }),
  crack: guard((t) => {
    noise(t, 0.035, 0.28, { type: 'highpass', f: 2800 });
    noise(t + 0.08, 0.05, 0.22, { type: 'highpass', f: 3800 });
    noise(t + 0.16, 0.03, 0.18, { type: 'highpass', f: 3200 });
  }),
  chime: guard((t, i) => {
    const f = PENTA[i ?? Math.floor(Math.random() * PENTA.length)];
    tone('sine', f, t, 1.5, 0.11, { a: 0.004 });
    tone('sine', f * 2.01, t, 0.7, 0.025, { a: 0.004 });
  }),
  sparkle: guard((t) => {
    [3, 4, 6].forEach((k, i) => tone('sine', PENTA[k], t + i * 0.07, 0.9, 0.06, { a: 0.004 }));
  }),
  whoosh: guard((t, d = 1) => noise(t, d * 0.6, 0.2, { f: 300, f2: 2600, q: 0.7, a: d * 0.4 })),
  suck: guard((t) => {
    noise(t, 0.5, 0.2, { f: 2600, f2: 180, q: 0.8, a: 0.6 });
    tone('sine', 420, t, 0.9, 0.08, { a: 0.3, f2: 50 });
  }),
  bloom: guard((t) => {
    [196, 293.66, 392, 587.33].forEach((f, i) => tone('sine', f, t + i * 0.05, 2.2, 0.05, { a: 0.08 }));
    noise(t, 0.8, 0.08, { f: 800, f2: 5000, q: 0.5, a: 0.02 });
  }),
  warp: guard((t) => {
    noise(t, 1.2, 0.2, { f: 200, f2: 3400, q: 0.6, a: 1.2 });
    tone('sine', 55, t, 1.4, 0.12, { a: 1.1, f2: 440 });
  }),
  bonk: guard((t) => tone('triangle', 260, t, 0.18, 0.26, { a: 0.002, f2: 80 })),
  squeak: guard((t) => {
    const o = tone('sine', 1300, t, 0.16, 0.08, { a: 0.005 });
    o.frequency.linearRampToValueAtTime(1950, t + 0.06);
    o.frequency.linearRampToValueAtTime(1500, t + 0.16);
  }),
  thud: guard((t) => {
    tone('sine', 120, t, 0.28, 0.35, { a: 0.003, f2: 45 });
    noise(t, 0.12, 0.14, { type: 'lowpass', f: 420 });
  }),
  paper: guard((t) => {
    noise(t, 0.12, 0.1, { f: 2600, q: 0.6 });
    noise(t + 0.13, 0.2, 0.08, { f: 1700, q: 0.5 });
  }),
  thump: guard((t) => tone('sine', 72, t, 0.32, 0.2, { a: 0.004, f2: 40 })),
  deflate: guard((t) => tone('triangle', 340, t, 0.4, 0.07, { a: 0.01, f2: 70 })),
  swell: guard((t) => {
    [392, 493.88, 587.33, 739.99, 987.77].forEach((f, i) => tone('sine', f, t + i * 0.09, 2.8, 0.045, { a: 0.35 }));
  }),
};

/** Background ambience plays only when nothing else is. */
function bgShouldRun() {
  if (!audioState.get().enabled || bgHeld || mediaHold > 0) return false;
  if (current && !current.suspended) return false;
  return true;
}

function applyBg(secs = 1.2) {
  if (!bgEl) return;
  const gen = ++bgGen;
  bgEl.muted = !audioState.get().enabled;
  if (!bgShouldRun()) {
    if (bgEl.paused) return;
    if (!canFade || secs <= 0) {
      bgEl.pause();
      return;
    }
    const out = Math.min(secs, 0.4);
    fadeVolume(bgEl, 0, out);
    setTimeout(() => {
      if (bgGen !== gen || bgShouldRun() || !bgEl) return;
      bgEl.pause();
    }, out * 1000 + 40);
    return;
  }
  const rise = () => {
    if (!bgEl || bgGen !== gen || !bgShouldRun()) {
      if (bgEl && !bgShouldRun()) bgEl.pause();
      return;
    }
    fadeVolume(bgEl, bgTarget, secs);
  };
  if (!bgEl.paused) {
    rise();
    return;
  }
  if (canFade) bgEl.volume = 0;
  bgEl.play()?.then(rise).catch(() => {});
}

/** Pause background music while some other clip (a letter video) is playing. */
export function holdAmbience() {
  mediaHold += 1;
  applyBg(0.3);
}

export function releaseAmbience() {
  mediaHold = Math.max(0, mediaHold - 1);
  applyBg(1);
}

export function startAmbience() {
  ensure();
  if (bgEl) {
    applyBg(2);
    return;
  }
  const el = new Audio();
  el.loop = true;
  el.preload = 'auto';
  el.playsInline = true;
  el.src = BG_URL;
  fadeVolume(el, 0, 0);
  el.muted = !audioState.get().enabled;
  bgEl = el;
  el.play()
    ?.then(() => applyBg(3))
    .catch(() => {});
}

export function setAmbience(level) {
  bgTarget = BG_LEVEL * Math.min(1, level / 0.075);
  applyBg(1.8);
}

export function setEnabled(v) {
  try {
    localStorage.setItem('zw-sound', v ? 'on' : 'off');
  } catch {
    /* private mode */
  }
  audioState.set({ enabled: v });
  if (!ctx) return;
  if (v && ctx.state !== 'running') ctx.resume();
  master.gain.setTargetAtTime(v ? 1 : 0, now(), 0.12);
  if (current?.el) current.el.muted = !v && !current.routed;
  if (letterEl) {
    letterEl.muted = !v;
    if (v) {
      fadeVolume(letterEl, 1, 0.35);
      if (letterEl.paused) letterEl.play().catch(() => {});
    }
  }
  if (bgEl) applyBg(0.35);
}

/* ---------------- music ---------------- */

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

function startSynth(p, dest) {
  const spb = 60 / p.bpm;
  const step = spb / 2;
  let nextT = now() + 0.08;
  let i = 0;
  let alive = true;
  const bus = ctx.createGain();
  bus.gain.value = 0.9;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = p.cutoff ?? 2400;
  bus.connect(lp).connect(dest);
  const dl = ctx.createDelay(1.5);
  dl.delayTime.value = spb * 0.75;
  const fb = ctx.createGain();
  fb.gain.value = 0.3;
  const wet = ctx.createGain();
  wet.gain.value = 0.28;
  lp.connect(dl);
  dl.connect(fb).connect(dl);
  dl.connect(wet).connect(dest);

  const pad = (f, t, d) => {
    [0, 6].forEach((det, k) => {
      const o = ctx.createOscillator();
      o.type = k ? 'sine' : 'triangle';
      o.frequency.value = f;
      o.detune.value = det;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.035, t + d * 0.3);
      g.gain.linearRampToValueAtTime(0.0001, t + d * 1.02);
      o.connect(g).connect(bus);
      o.start(t);
      o.stop(t + d * 1.05);
    });
  };
  const pluck = (f, t) => {
    const o = ctx.createOscillator();
    o.type = p.lead || 'sine';
    o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.085, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (p.decay ?? 0.9));
    o.connect(g).connect(bus);
    o.start(t);
    o.stop(t + (p.decay ?? 0.9) + 0.05);
  };
  const bass = (f, t, d) => {
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.07, t + 0.15);
    g.gain.linearRampToValueAtTime(0.0001, t + d);
    o.connect(g).connect(bus);
    o.start(t);
    o.stop(t + d + 0.05);
  };

  const tick = () => {
    if (!alive) return;
    while (nextT < now() + 0.3) {
      const bar = Math.floor(i / 8) % p.chords.length;
      const chord = p.chords[bar];
      const pos = i % 8;
      if (pos === 0) {
        chord.forEach((m) => pad(mtof(m - 12), nextT, spb * 4));
        bass(mtof(chord[0] - 24), nextT, spb * 4);
      }
      const idx = p.pattern[pos];
      if (idx != null) {
        const m = chord[idx % chord.length] + 12 * Math.floor(idx / chord.length) + (p.octave || 0);
        pluck(mtof(m), nextT);
      }
      if (p.tick && pos % 2 === 1) noise(nextT, 0.025, 0.025, { type: 'highpass', f: 7500, dest: bus });
      nextT += step;
      i++;
    }
  };
  const iv = setInterval(tick, 90);
  tick();
  return {
    stop() {
      alive = false;
      clearInterval(iv);
      setTimeout(() => {
        bus.disconnect();
        wet.disconnect();
        dl.disconnect();
      }, 3500);
    },
  };
}

export function playSong(song) {
  unlock();
  if (!ctx) return;
  if (current?.id === song.id) return;
  stopSong(0.7, true);
  const g = ctx.createGain();
  g.gain.value = 0.0001;
  g.connect(musicBus);
  g.gain.setTargetAtTime(1, now() + 0.1, 0.5);
  const entry = { id: song.id, gain: g, el: null, synth: null, routed: false };
  current = entry;

  const fallback = () => {
    if (current !== entry || entry.synth) return;
    if (entry.el) {
      release(entry.el);
      entry.el = null;
    }
    entry.synth = startSynth(song.synth, g);
    audioState.set({ source: 'synth', loading: false });
  };

  if (song.file && available[song.file] !== false) {
    const el = new Audio();
    el.loop = true;
    el.preload = 'auto';
    el.playsInline = true;
    el.src = srcOf(song.file);
    entry.el = el;
    if (isExternal(song.file)) {
      el.muted = !audioState.get().enabled;
      fadeVolume(el, 0, 0);
    } else {
      try {
        ctx.createMediaElementSource(el).connect(g);
        entry.routed = true;
      } catch {
        el.muted = !audioState.get().enabled;
      }
    }
    el.addEventListener('playing', () => {
      if (current !== entry) return;
      if (!entry.routed) fadeVolume(el, 1, 0.8);
      audioState.set({ source: 'file', loading: false });
    });
    el.addEventListener('waiting', () => current === entry && audioState.set({ loading: true }));
    el.addEventListener('error', fallback, { once: true });
    el.play()?.catch((err) => err?.name !== 'AbortError' && fallback());
  } else fallback();

  applyBg(1);
  audioState.set({ song: song.id, playing: true, loading: !!entry.el });
}

export function stopSong(fade = 0.9, swapping = false) {
  if (!current || !ctx) return;
  const e = current;
  current = null;
  e.gain.gain.cancelScheduledValues(now());
  e.gain.gain.setTargetAtTime(0.0001, now(), fade / 3);
  if (e.el && !e.routed) {
    if (canFade) fadeVolume(e.el, 0, fade);
    else e.el.pause();
  }
  setTimeout(() => {
    if (e.el) release(e.el);
    e.synth?.stop();
    try {
      e.gain.disconnect();
    } catch {
      /* already gone */
    }
  }, fade * 1000 + 200);
  if (!swapping) {
    applyBg(1.5);
    audioState.set({ song: null, playing: false, loading: false, source: null });
  }
}

/**
 * A letter's own song. Background ambience and whatever else is playing
 * pause for it, and both come back when the letter is folded shut.
 * Call this from the click that opens the letter — play() needs that gesture.
 */
export function playLetterSong(url) {
  if (!url) return;
  unlock();
  if (letterEl) {
    release(letterEl);
    letterEl = null;
  }

  const gen = ++holdGen;
  if (!bgHeld) {
    bgHeld = true;
    applyBg(0.32);
    if (current && !current.suspended) {
      current.suspended = true;
      if (current.gain && ctx) {
        current.gain.gain.cancelScheduledValues(now());
        current.gain.gain.setTargetAtTime(0.0001, now(), 0.1);
      }
      if (current.el && !current.routed) fadeVolume(current.el, 0, 0.32);
      if (current.el) {
        const el = current.el;
        setTimeout(() => {
          if (holdGen !== gen || !current?.suspended) return;
          el.pause();
        }, canFade ? 360 : 0);
      }
    }
  }

  const el = new Audio();
  el.loop = true;
  el.preload = 'auto';
  el.playsInline = true;
  el.src = srcOf(url);
  letterEl = el;
  el.muted = !audioState.get().enabled;
  fadeVolume(el, 0, 0);
  el.addEventListener('playing', () => {
    if (letterEl !== el || el.muted) return;
    fadeVolume(el, 1, 0.55);
  });
  el.addEventListener('ended', () => {
    if (letterEl !== el) return;
    el.currentTime = 0;
    el.play()?.catch(() => {});
  });
  audioState.set({ cue: true });
  el.play()?.catch((err) => {
    if (letterEl !== el || err?.name === 'AbortError') return;
    stopLetterSong(0);
  });
}

export function stopLetterSong(fade = 0.45) {
  const el = letterEl;
  if (!el && !bgHeld) return;
  letterEl = null;
  holdGen++;
  bgHeld = false;

  if (el) {
    if (canFade && fade > 0) fadeVolume(el, 0, fade);
    else el.pause();
    setTimeout(() => release(el), fade * 1000 + 80);
  }
  audioState.set({ cue: false });

  const resumeSong = current?.suspended ? current : null;
  if (resumeSong) resumeSong.suspended = false;

  applyBg(fade > 0 ? 1.1 : 0.2);

  if (!resumeSong) return;
  if (resumeSong.gain && ctx) {
    resumeSong.gain.gain.cancelScheduledValues(now());
    resumeSong.gain.gain.setTargetAtTime(1, now(), 0.22);
  }
  if (resumeSong.el && audioState.get().playing) {
    if (!resumeSong.routed) fadeVolume(resumeSong.el, 1, resumeSong.el.muted ? 0 : 0.45);
    resumeSong.el.play()?.catch(() => {});
  }
}

/** 0..1 loudness of the current music — drives visual pulses. */
export function getLevel() {
  const cue = letterEl;
  if (cue && !cue.paused && !cue.muted && cue.readyState >= 2) {
    const t = cue.currentTime;
    return 0.4 + 0.16 * Math.sin(t * 5.3) + 0.1 * Math.sin(t * 8.9 + 1.3);
  }
  if (!analyser || !current) return 0;
  const el = current.el;
  if (el && !current.routed) {
    // cross-origin audio is invisible to the analyser, so let the visuals breathe with the song's clock
    if (el.paused || el.readyState < 3) return 0;
    const t = el.currentTime;
    return 0.4 + 0.16 * Math.sin(t * 5.3) + 0.1 * Math.sin(t * 8.9 + 1.3);
  }
  analyser.getByteFrequencyData(freq);
  let sum = 0;
  for (let i = 1; i < 28; i++) sum += freq[i];
  return Math.min(1, sum / (27 * 180));
}
