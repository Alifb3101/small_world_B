import { REDUCED, rand, pick } from './motion';
import { sky } from './sky';

/**
 * Foreground particle system on a single fixed canvas.
 * Only animates while particles are alive.
 */

export const COLORS = {
  cream: '246,236,217',
  lav: '185,168,232',
  peach: '240,184,154',
  gold: '243,207,138',
  moon: '233,228,255',
  rose: '232,150,160',
};

const st = { canvas: null, ctx: null, w: 0, h: 0, dpr: 1, ps: [], raf: 0, last: 0, sprites: {} };
const MAX = 700;

function sprite(rgb) {
  const c = document.createElement('canvas');
  c.width = c.height = 32;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.25, `rgba(${rgb},0.9)`);
  grd.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grd;
  g.fillRect(0, 0, 32, 32);
  return c;
}

function resize() {
  if (!st.canvas) return;
  st.dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.5 : 2);
  st.w = window.innerWidth;
  st.h = window.innerHeight;
  st.canvas.width = Math.round(st.w * st.dpr);
  st.canvas.height = Math.round(st.h * st.dpr);
}

function frame(now) {
  const dt = Math.min(0.05, (now - st.last) / 1000 || 0.016);
  st.last = now;
  const { ctx } = st;
  ctx.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
  ctx.clearRect(0, 0, st.w, st.h);

  const ps = st.ps;
  for (let i = ps.length - 1; i >= 0; i--) {
    const p = ps[i];
    p.life -= dt;
    if (p.life <= 0) {
      if (p.star) sky.addStars(p.x, p.y, 1, 2);
      ps.splice(i, 1);
      continue;
    }
    const k = p.life / p.max;
    p.vx *= 1 - p.drag * dt;
    p.vy *= 1 - p.drag * dt;
    p.vy += p.g * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;

    if (p.kind === 'ring') {
      const e = 1 - k;
      const r = p.r0 + (p.size - p.r0) * (1 - Math.pow(1 - e, 3));
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = k * 0.8;
      ctx.strokeStyle = `rgb(${p.c})`;
      ctx.lineWidth = p.lw * k + 0.3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.stroke();
    } else if (p.kind === 'spark') {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = k;
      ctx.strokeStyle = `rgb(${p.c})`;
      ctx.lineWidth = p.size * 0.6;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx * 0.035, p.y - p.vy * 0.035);
      ctx.stroke();
    } else if (p.kind === 'text') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = Math.min(1, k * 1.6);
      ctx.fillStyle = `rgb(${p.c})`;
      ctx.font = `600 ${p.size}px "DM Sans", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(p.text, p.x, p.y);
    } else {
      ctx.globalCompositeOperation = 'lighter';
      const s = p.size * (p.grow ? 1 + (1 - k) * p.grow : 0.4 + k * 0.6) * 3;
      ctx.globalAlpha = p.fadeIn ? Math.min(1, (1 - k) * 4) * k * 1.4 : k;
      ctx.drawImage(st.sprites[p.cn], p.x - s / 2, p.y - s / 2, s, s);
    }
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';

  if (ps.length) st.raf = requestAnimationFrame(frame);
  else {
    ctx.clearRect(0, 0, st.w, st.h);
    st.raf = 0;
  }
}

function kick() {
  if (!st.raf && st.canvas) {
    st.last = performance.now();
    st.raf = requestAnimationFrame(frame);
  }
}

function push(p) {
  if (st.ps.length >= MAX) st.ps.shift();
  st.ps.push(p);
}

export const fx = {
  attach(canvas) {
    st.canvas = canvas;
    st.ctx = canvas.getContext('2d');
    Object.entries(COLORS).forEach(([k, v]) => (st.sprites[k] = sprite(v)));
    resize();
    window.addEventListener('resize', resize);
  },
  detach() {
    window.removeEventListener('resize', resize);
    cancelAnimationFrame(st.raf);
    st.raf = 0;
    st.canvas = null;
  },
  burst(x, y, o = {}) {
    if (!st.canvas) return;
    const {
      count = 26,
      colors = ['cream', 'lav', 'gold'],
      speed = [90, 320],
      size = [1.4, 3.6],
      life = [0.5, 1.1],
      gravity = 70,
      drag = 2.4,
      sparks = 0.35,
      toStars = 0,
    } = o;
    const n = REDUCED ? Math.ceil(count / 3) : count;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = rand(speed[0], speed[1]) * (REDUCED ? 0.4 : 1);
      const cn = pick(colors);
      const l = rand(life[0], life[1]);
      push({
        kind: Math.random() < sparks ? 'spark' : 'dot',
        x,
        y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        life: l,
        max: l,
        size: rand(size[0], size[1]),
        c: COLORS[cn],
        cn,
        g: gravity,
        drag,
        star: i < toStars,
      });
    }
    kick();
  },
  ring(x, y, { color = 'cream', radius = 90, life = 0.6, width = 2.2 } = {}) {
    if (!st.canvas) return;
    push({ kind: 'ring', x, y, vx: 0, vy: 0, g: 0, drag: 0, life, max: life, size: radius, r0: 6, lw: width, c: COLORS[color] });
    kick();
  },
  text(x, y, text, { color = 'cream', size = 18, life = 0.9 } = {}) {
    if (!st.canvas) return;
    push({ kind: 'text', text, x, y, vx: rand(-20, 20), vy: -90, g: 60, drag: 1.2, life, max: life, size, c: COLORS[color] });
    kick();
  },
  /** Slow rising embers that become stars — the night-sky transition. */
  embers(n = 80, { toStarsEvery = 3 } = {}) {
    if (!st.canvas) return;
    for (let i = 0; i < n; i++) {
      const l = rand(1.4, 2.8);
      const cn = pick(['gold', 'moon', 'cream', 'lav']);
      push({
        kind: 'dot',
        x: rand(0, st.w),
        y: rand(st.h * 0.15, st.h * 1.05),
        vx: rand(-12, 12),
        vy: -rand(20, 70),
        life: l,
        max: l,
        size: rand(1.2, 3.2),
        c: COLORS[cn],
        cn,
        g: 0,
        drag: 0.2,
        fadeIn: true,
        star: i % toStarsEvery === 0,
      });
    }
    kick();
  },
};
