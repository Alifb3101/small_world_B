import React, { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { fx } from '../lib/fx';
import { sfx } from '../lib/audio';
import { REDUCED, buzz } from '../lib/motion';

/**
 * A button that leans toward the finger / cursor and answers every tap
 * with a little burst of light.
 */
export default function MagneticButton({
  children,
  onClick,
  className = '',
  variant = 'glow',
  strength = 0.3,
  sound = 'tap',
  burst = true,
  ...rest
}) {
  const ref = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (REDUCED) return;
    const el = ref.current;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    const lx = gsap.quickTo(labelRef.current, 'x', { duration: 0.6, ease: 'power3.out' });
    const ly = gsap.quickTo(labelRef.current, 'y', { duration: 0.6, ease: 'power3.out' });
    const move = (e) => {
      if (e.pointerType === 'touch') return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      xTo(dx * strength);
      yTo(dy * strength);
      lx(dx * strength * 0.4);
      ly(dy * strength * 0.4);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
      lx(0);
      ly(0);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [strength]);

  const down = () => gsap.to(ref.current, { scale: 0.93, duration: 0.15, ease: 'power2.out' });
  const up = () => gsap.to(ref.current, { scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.4)' });

  const click = (e) => {
    const r = ref.current.getBoundingClientRect();
    if (burst) {
      fx.burst(r.left + r.width / 2, r.top + r.height / 2, {
        count: 30,
        speed: [80, 260],
        colors: ['cream', 'gold', 'lav'],
        gravity: 30,
      });
      fx.ring(r.left + r.width / 2, r.top + r.height / 2, { radius: r.width * 0.7, color: 'gold' });
    }
    buzz(8);
    sfx[sound]?.();
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      type="button"
      data-nofx
      className={`mbtn mbtn--${variant} ${className}`}
      onPointerDown={down}
      onPointerUp={up}
      onPointerCancel={up}
      onClick={click}
      {...rest}
    >
      <span className="mbtn__glow" aria-hidden="true" />
      <span className="mbtn__label" ref={labelRef}>
        {children}
      </span>
    </button>
  );
}
