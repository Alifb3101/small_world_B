import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { fx } from '../lib/fx';
import { sfx } from '../lib/audio';
import { REDUCED, buzz, rand } from '../lib/motion';
import { useScene } from './Scene';
import ThoughtBubble from './ThoughtBubble';

/**
 * Thoughts floating around inside a head. Each has its own depth and wander;
 * they bump into each other, drift toward/away from the camera, and can be
 * flung with a swipe. Transforms are written straight to the DOM each frame.
 */
export default function ThoughtCloud({ thoughts, onPop, nervous = 0 }) {
  const area = useRef(null);
  const els = useRef([]);
  const bodies = useRef([]);
  const size = useRef({ w: 0, h: 0 });
  const nervousRef = useRef(nervous);
  nervousRef.current = nervous;
  const pointer = useRef({ x: 0, y: 0, t: 0, vx: 0, vy: 0 });
  const { inView } = useScene();

  useLayoutEffect(() => {
    const measure = () => {
      const r = area.current.getBoundingClientRect();
      size.current = { w: r.width, h: r.height };
    };
    measure();
    const { w, h } = size.current;
    const n = thoughts.length;
    bodies.current = thoughts.map((t, i) => {
      const el = els.current[i];
      const bw = el.offsetWidth;
      const bh = el.offsetHeight;
      el.style.zIndex = String(Math.round(t.z * 10));
      return {
        x: i % 2 ? rand(w * 0.35, Math.max(w * 0.35, w - bw)) : rand(0, Math.max(0, w * 0.5 - bw * 0.3)),
        y: (h / n) * i + rand(0, Math.max(0, h / n - bh)),
        vx: rand(-25, 25),
        vy: rand(-18, 18),
        w: bw,
        h: bh,
        z: t.z,
        seed: Math.random() * 100,
        frozen: false,
        alive: true,
        appear: REDUCED ? 1 : 0,
      };
    });
    const ro = new ResizeObserver(measure);
    ro.observe(area.current);
    return () => ro.disconnect();
  }, [thoughts]);

  useEffect(() => {
    if (!inView) return;
    bodies.current.forEach((b, i) => {
      if (!b || b.appear >= 0.95) return;
      gsap.to(b, {
        appear: 1,
        duration: 1.4,
        delay: 0.25 + i * 0.4,
        ease: 'elastic.out(1, 0.6)',
        onStart: () => sfx.thump(),
      });
    });
  }, [inView]);

  useEffect(() => {
    if (!inView) return;
    let raf;
    let last = performance.now();
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.04, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      const { w, h } = size.current;
      const bs = bodies.current;
      const nerv = 1 + nervousRef.current * 0.35;
      const motion = REDUCED ? 0.15 : 1;

      for (let i = 0; i < bs.length; i++) {
        const b = bs[i];
        if (!b.alive || b.frozen) continue;
        let ax = (Math.sin(t * 0.6 + b.seed) + Math.sin(t * 0.23 + b.seed * 1.7) * 0.7) * 16 * nerv;
        let ay = (Math.cos(t * 0.5 + b.seed * 1.3) + Math.sin(t * 0.31 + b.seed) * 0.6) * 13 * nerv;

        for (let j = 0; j < bs.length; j++) {
          if (i === j) continue;
          const o = bs[j];
          if (!o.alive) continue;
          const dx = b.x + b.w / 2 - (o.x + o.w / 2);
          const dy = b.y + b.h / 2 - (o.y + o.h / 2);
          const px = (b.w + o.w) / 2 - Math.abs(dx);
          const py = (b.h + o.h) / 2 - Math.abs(dy);
          if (px > 0 && py > 0) {
            if (px < py) ax += Math.sign(dx || 1) * px * 6;
            else ay += Math.sign(dy || 1) * py * 6;
          }
        }
        const pad = 6;
        if (b.x < pad) ax += (pad - b.x) * 10;
        if (b.x + b.w > w - pad) ax -= (b.x + b.w - (w - pad)) * 10;
        if (b.y < pad) ay += (pad - b.y) * 10;
        if (b.y + b.h > h - pad) ay -= (b.y + b.h - (h - pad)) * 10;

        b.vx += ax * dt;
        b.vy += ay * dt;
        b.vx *= 1 - 0.7 * dt;
        b.vy *= 1 - 0.7 * dt;
        const max = 260;
        const sp = Math.hypot(b.vx, b.vy);
        if (sp > max) {
          b.vx *= max / sp;
          b.vy *= max / sp;
        }
        b.x += b.vx * dt * motion;
        b.y += b.vy * dt * motion;

        const zz = b.z + Math.sin(t * 0.25 + b.seed) * 0.12;
        const s = (0.8 + zz * 0.32) * b.appear;
        const el = els.current[i];
        el.style.transform = `translate3d(${b.x.toFixed(1)}px,${b.y.toFixed(1)}px,0) scale(${s.toFixed(3)})`;
        el.style.opacity = Math.min(1, b.appear * (0.55 + zz * 0.5)).toFixed(3);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  const onMove = (e) => {
    const p = pointer.current;
    const now = performance.now();
    const dt = Math.max(1, now - p.t);
    const r = area.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    if (p.t && dt < 80) {
      const vx = ((x - p.x) / dt) * 1000;
      const vy = ((y - p.y) / dt) * 1000;
      if (Math.hypot(vx, vy) > 500) {
        bodies.current.forEach((b) => {
          if (!b.alive || b.frozen) return;
          const d = Math.hypot(b.x + b.w / 2 - x, b.y + b.h / 2 - y);
          if (d < 130) {
            b.vx += vx * 0.25;
            b.vy += vy * 0.25;
          }
        });
      }
    }
    p.x = x;
    p.y = y;
    p.t = now;
  };

  const pop = (i) => {
    const b = bodies.current[i];
    if (!b || !b.alive || b.frozen || b.appear < 0.5) return;
    b.frozen = true;
    const el = els.current[i];
    const body = el.querySelector('.thought__body');
    const cracks = el.querySelectorAll('.thought__crack');
    buzz(12);
    sfx.crack();
    const tl = gsap.timeline();
    tl.to(body, { x: 4, duration: 0.04, repeat: 7, yoyo: true, ease: 'none' })
      .to(cracks, { strokeDashoffset: 0, duration: 0.2, stagger: 0.05, ease: 'power2.out' }, 0.04)
      .to(body, { scale: 1.1, duration: 0.12, ease: 'power2.in' }, 0.34)
      .call(() => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        fx.burst(cx, cy, {
          count: 54,
          colors: ['cream', 'lav', 'gold', 'peach'],
          speed: [120, 440],
          size: [1.4, 4],
          toStars: 8,
        });
        fx.ring(cx, cy, { radius: Math.max(r.width * 0.8, 120), color: 'lav' });
        sfx.pop(rand(0.85, 1.2));
        setTimeout(() => sfx.chime(), 110);
        buzz([10, 30, 18]);
        b.alive = false;
        onPop?.(i);
      })
      .to(body, { scale: 0.2, opacity: 0, duration: 0.16, ease: 'power2.in' }, '<')
      .set(el, { visibility: 'hidden' });
  };

  return (
    <div className="tcloud" ref={area} onPointerMove={onMove}>
      {thoughts.map((t, i) => (
        <ThoughtBubble
          key={i}
          ref={(el) => (els.current[i] = el)}
          text={t.text}
          size={t.size}
          onPop={() => pop(i)}
          style={{ opacity: 0 }}
        />
      ))}
    </div>
  );
}
