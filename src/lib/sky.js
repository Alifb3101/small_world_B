import { REDUCED, rand } from './motion';

/**
 * The shared night sky. One fixed canvas behind every scene.
 * Stars live in "sky space" and are offset by scroll * depth, so scrolling
 * feels like the camera travelling through them.
 */

const PARALLAX = 0.22;
const MAX_STARS = 560;

function makeSprite(rgb) {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.1, `rgba(${rgb},0.95)`);
  grd.addColorStop(0.3, `rgba(${rgb},0.25)`);
  grd.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  return c;
}

const st = {
  canvas: null,
  ctx: null,
  w: 0,
  h: 0,
  dpr: 1,
  stars: [],
  raf: 0,
  last: 0,
  t: 0,
  alpha: 0,
  alphaT: 0,
  alphaK: 0.02,
  warp: 0,
  warpT: 0,
  calm: 0,
  calmT: 0,
  still: 0,
  stillT: 0,
  pull: 0,
  pullT: 0,
  pullK: 0.08,
  scroll: 0,
  shoot: null,
  nextShoot: 7,
  cool: null,
  warm: null,
};

function makeStar(opts = {}) {
  const z = opts.z ?? Math.pow(Math.random(), 1.7) * 0.85 + 0.15;
  return {
    x: opts.x ?? Math.random() * st.w,
    y: opts.y ?? Math.random() * st.h,
    z,
    r: (opts.r ?? rand(0.45, 1.25)) * (0.55 + z * 0.9),
    ph: Math.random() * Math.PI * 2,
    sp: rand(0.35, 1.5),
    vx: rand(-3, 3) * z,
    vy: opts.vy ?? 0,
    warm: !!opts.warm,
    born: opts.born ?? 0,
  };
}

function resize() {
  const { canvas } = st;
  if (!canvas) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const ow = st.w || w;
  const small = w < 700;
  st.dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
  canvas.width = Math.round(w * st.dpr);
  canvas.height = Math.round(h * st.dpr);
  st.w = w;
  st.h = h;
  if (!st.stars.length) {
    const n = Math.round(Math.min(small ? 230 : 420, Math.max(150, (w * h) / (small ? 1500 : 2100))));
    for (let i = 0; i < n; i++) st.stars.push(makeStar());
  } else if (ow !== w) {
    const k = w / ow;
    st.stars.forEach((s) => (s.x *= k));
  }
}

const onScroll = () => {
  st.scroll = window.scrollY;
};

let holds = 0;

const onVis = () => {
  if (document.hidden) stop();
  else if (!holds) start();
};

function ease(cur, target, base, dt) {
  return cur + (target - cur) * (1 - Math.pow(1 - base, dt * 60));
}

function frame(now) {
  st.raf = requestAnimationFrame(frame);
  const dt = Math.min(0.05, (now - st.last) / 1000 || 0.016);
  st.last = now;

  st.alpha = ease(st.alpha, st.alphaT, st.alphaK, dt);
  st.warp = ease(st.warp, st.warpT, 0.05, dt);
  st.calm = ease(st.calm, st.calmT, 0.015, dt);
  st.still = ease(st.still, st.stillT, 0.012, dt);
  st.pull = ease(st.pull, st.pullT, st.pullK, dt);

  const speed = REDUCED ? 0.15 : (1 - st.calm * 0.55) * (1 - st.still * 0.9);
  st.t += dt * speed;

  const { ctx, w, h } = st;
  ctx.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  if (st.alpha < 0.004) return;

  const cx = w / 2;
  const cy = h / 2;
  const warp = st.warp;
  const pull = st.pull;
  const bright = 1 + st.calm * 0.5 + st.still * 0.3;
  ctx.globalCompositeOperation = 'lighter';

  for (let i = 0; i < st.stars.length; i++) {
    const s = st.stars[i];
    const par = s.z * PARALLAX;
    const sx = s.x;
    const sy = (((s.y - st.scroll * par) % h) + h) % h;

    s.x += s.vx * dt * speed;
    if (s.x < -12) s.x += w + 24;
    else if (s.x > w + 12) s.x -= w + 24;
    if (s.vy) {
      s.y += s.vy * dt;
      s.vy *= 1 - dt * 0.9;
      if (Math.abs(s.vy) < 0.5) s.vy = 0;
    }
    if (s.born > 0) s.born = Math.max(0, s.born - dt * 0.28);

    if (warp > 0.02) {
      const dx = sx - cx;
      const dy = sy - cy;
      const f = warp * (0.8 + s.z * 2.4) * dt * 2.4;
      let nx = sx + dx * f;
      let ny = sy + dy * f;
      ctx.globalAlpha = Math.min(1, warp * 1.3) * st.alpha * (0.35 + s.z * 0.65);
      ctx.strokeStyle = s.warm ? '#ffd79a' : '#ece8ff';
      ctx.lineWidth = s.r * (0.7 + warp * 1.1);
      ctx.beginPath();
      ctx.moveTo(sx - dx * f * 5, sy - dy * f * 5);
      ctx.lineTo(nx, ny);
      ctx.stroke();
      if (nx < -30 || nx > w + 30 || ny < -30 || ny > h + 30) {
        const a = Math.random() * Math.PI * 2;
        const rr = rand(4, 80);
        nx = cx + Math.cos(a) * rr;
        ny = cy + Math.sin(a) * rr;
      }
      s.x = nx;
      s.y = ny + st.scroll * par;
      continue;
    }

    const tw = 0.55 + 0.45 * Math.sin(st.t * s.sp * 2 + s.ph);
    let a = (0.22 + s.z * 0.78) * tw * bright * st.alpha;
    let r = s.r;
    if (s.born > 0) {
      a += s.born * 1.1;
      r += s.born * 2.4;
    }
    let px = sx;
    let py = sy;
    if (pull > 0.001) {
      const p = pull * (0.75 + s.z * 0.25);
      px = cx + (sx - cx) * (1 - p);
      py = cy + (sy - cy) * (1 - p);
    }
    const size = r * 7;
    ctx.globalAlpha = a > 1 ? 1 : a;
    ctx.drawImage(s.warm ? st.warm : st.cool, px - size / 2, py - size / 2, size, size);
  }

  if (pull > 0.05) {
    const size = 40 + pull * 160;
    ctx.globalAlpha = pull;
    ctx.drawImage(st.cool, cx - size / 2, cy - size / 2, size, size);
  }

  if (!REDUCED && warp < 0.05 && st.still < 0.6) {
    st.nextShoot -= dt;
    if (st.nextShoot <= 0 && !st.shoot) {
      const dir = Math.random() < 0.5 ? -1 : 1;
      st.shoot = {
        x: rand(w * 0.2, w * 0.8),
        y: rand(h * 0.04, h * 0.35),
        vx: dir * rand(320, 520),
        vy: rand(110, 200),
        life: 1,
      };
      st.nextShoot = rand(10, 22);
    }
  }
  if (st.shoot) {
    const s = st.shoot;
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    s.life -= dt * 1.15;
    const grd = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 0.22, s.y - s.vy * 0.22);
    grd.addColorStop(0, 'rgba(255,244,220,0.9)');
    grd.addColorStop(1, 'rgba(255,244,220,0)');
    ctx.globalAlpha = Math.max(0, s.life) * st.alpha;
    ctx.strokeStyle = grd;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - s.vx * 0.22, s.y - s.vy * 0.22);
    ctx.stroke();
    if (s.life <= 0) st.shoot = null;
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
}

function start() {
  if (st.raf || !st.canvas) return;
  st.last = performance.now();
  st.raf = requestAnimationFrame(frame);
}

function stop() {
  cancelAnimationFrame(st.raf);
  st.raf = 0;
}

export const sky = {
  attach(canvas) {
    st.canvas = canvas;
    st.ctx = canvas.getContext('2d');
    st.cool = makeSprite('233,228,255');
    st.warm = makeSprite('255,212,150');
    resize();
    onScroll();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    start();
  },
  detach() {
    stop();
    window.removeEventListener('resize', resize);
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('visibilitychange', onVis);
    st.canvas = null;
  },
  fade(target, { instant = false, k = 0.02 } = {}) {
    st.alphaT = target;
    st.alphaK = k;
    if (instant) st.alpha = target;
  },
  /** Pause drawing while something opaque covers the whole screen. */
  hold(on) {
    holds = Math.max(0, holds + (on ? 1 : -1));
    if (holds) stop();
    else if (!document.hidden) start();
  },
  warpTo(v) {
    st.warpT = REDUCED ? 0 : v;
  },
  calmTo(v) {
    st.calmT = v;
  },
  stillTo(v) {
    st.stillT = v;
  },
  pullTo(v, k = 0.08) {
    st.pullT = REDUCED ? 0 : v;
    st.pullK = k;
  },
  /** Birth warm stars at a viewport point — used when thoughts dissolve. */
  addStars(x, y, n = 4, spread = 22) {
    for (let i = 0; i < n; i++) {
      const z = rand(0.55, 1);
      st.stars.push(
        makeStar({
          x: x + rand(-spread, spread),
          y: y + rand(-spread, spread) + st.scroll * z * PARALLAX,
          z,
          r: rand(0.9, 1.5),
          warm: true,
          born: 1,
          vy: -rand(8, 30),
        }),
      );
    }
    const max = st.w < 700 ? 360 : MAX_STARS;
    if (st.stars.length > max) st.stars.splice(0, st.stars.length - max);
  },
};
