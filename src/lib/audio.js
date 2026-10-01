import { createStore } from './store';
import { PLAYLIST } from '../data/content';

/**
 * Tiny Web Audio engine.
 * - sfx: synthesised interaction sounds (no files needed)
 * - ambience: a soft drone + occasional chimes
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
  source: null,
});

const AMB_LEVEL = 0.075;
const AMB_DUCK = 0.02;
const PENTA = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66];

let ctx = null;
let master;
let sfxBus;
let ambBus;
let musicBus;
let analyser;
let freq;
let noiseBuf;
let amb = null;
let current = null;
let ambTarget = AMB_LEVEL;

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
  ambBus = ctx.createGain();
  ambBus.gain.value = 0;
  ambBus.connect(master);
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
    } else {
      ctx.resume();
      if (current?.el && audioState.get().playing) current.el.play().catch(() => {});
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

export function startAmbience() {
  ensure();
  if (!ctx || amb) return;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 720;
  lp.Q.value = 0.4;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.06;
  const lfoG = ctx.createGain();
  lfoG.gain.value = 280;
  lfo.connect(lfoG).connect(lp.frequency);
  lfo.start();
  const notes = [110, 164.81, 220.5, 277.18, 329.63];
  const levels = [0.5, 0.3, 0.2, 0.09, 0.05];
  const oscs = notes.map((f, i) => {
    const o = ctx.createOscillator();
    o.type = i % 2 ? 'triangle' : 'sine';
    o.frequency.value = f;
    o.detune.value = (i - 2) * 5;
    const g = ctx.createGain();
    g.gain.value = levels[i];
    o.connect(g).connect(lp);
    o.start();
    return o;
  });
  lp.connect(ambBus);
  ambBus.gain.setTargetAtTime(ambTarget, now(), 2.5);
  const timer = setInterval(() => {
    if (!ready() || document.hidden || Math.random() > 0.55) return;
    const f = PENTA[Math.floor(Math.random() * PENTA.length)] * (Math.random() < 0.5 ? 0.5 : 1);
    const lvl = (ambBus.gain.value / AMB_LEVEL) * 0.022;
    if (lvl > 0.002) tone('sine', f, now(), 3, lvl, { a: 0.02 });
  }, 3800);
  amb = { lp, oscs, lfo, timer };
}

export function setAmbience(level, cutoff) {
  ambTarget = level;
  if (!ctx) return;
  ambBus.gain.setTargetAtTime(current ? Math.min(level, AMB_DUCK) : level, now(), 1.8);
  if (amb && cutoff) amb.lp.frequency.setTargetAtTime(cutoff, now(), 2);
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
      entry.el.pause();
      entry.el.removeAttribute('src');
      entry.el = null;
    }
    entry.synth = startSynth(song.synth, g);
    audioState.set({ source: 'synth' });
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
    } else {
      try {
        ctx.createMediaElementSource(el).connect(g);
        entry.routed = true;
      } catch {
        el.muted = !audioState.get().enabled;
      }
    }
    el.addEventListener('error', fallback, { once: true });
    const p = el.play();
    if (p)
      p.then(() => current === entry && audioState.set({ source: 'file' })).catch(fallback);
  } else fallback();

  ambBus.gain.setTargetAtTime(Math.min(ambTarget, AMB_DUCK), now(), 1);
  audioState.set({ song: song.id, playing: true });
}

export function stopSong(fade = 0.9, swapping = false) {
  if (!current || !ctx) return;
  const e = current;
  current = null;
  e.gain.gain.cancelScheduledValues(now());
  e.gain.gain.setTargetAtTime(0.0001, now(), fade / 3);
  if (e.el && !e.routed) {
    const el = e.el;
    const v0 = el.volume;
    const t0 = performance.now();
    const step = () => {
      const k = Math.min(1, (performance.now() - t0) / (fade * 1000));
      el.volume = Math.max(0, v0 * (1 - k));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  setTimeout(() => {
    e.el?.pause();
    e.synth?.stop();
    try {
      e.gain.disconnect();
    } catch {
      /* already gone */
    }
  }, fade * 1000 + 200);
  if (!swapping) {
    ambBus.gain.setTargetAtTime(ambTarget, now(), 1.5);
    audioState.set({ song: null, playing: false, source: null });
  }
}

/** 0..1 loudness of the current music — drives visual pulses. */
export function getLevel() {
  if (!analyser || !current) return 0;
  analyser.getByteFrequencyData(freq);
  let sum = 0;
  for (let i = 1; i < 28; i++) sum += freq[i];
  return Math.min(1, sum / (27 * 180));
}
