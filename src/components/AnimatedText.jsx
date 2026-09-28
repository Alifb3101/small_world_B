import React, { useEffect, useMemo, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { REDUCED } from '../lib/motion';
import { useScene } from './Scene';

const VARIANTS = {
  rise: { from: { opacity: 0, yPercent: 70, rotate: 5 }, ease: 'expo.out', duration: 1.1, stagger: 0.035 },
  blur: { from: { opacity: 0, filter: 'blur(10px)', scale: 1.06 }, ease: 'power2.out', duration: 1.3, stagger: 0.07 },
  soft: { from: { opacity: 0, y: 14 }, ease: 'power3.out', duration: 1, stagger: 0.05 },
  pop: { from: { opacity: 0, scale: 0.4, yPercent: 30 }, ease: 'back.out(2.2)', duration: 0.7, stagger: 0.04 },
  hand: { from: { opacity: 0, clipPath: 'inset(0 100% 0 0)' }, ease: 'power1.inOut', duration: 0.9, stagger: 0.0 },
};

/**
 * Kinetic text: splits into words (and chars), then reveals when `play` flips true.
 * Words never break mid-word on small screens.
 */
export default function AnimatedText({
  text,
  as: Tag = 'span',
  className = '',
  split = 'chars',
  variant = 'rise',
  play = true,
  delay = 0,
  stagger,
  duration,
  onDone,
}) {
  const ref = useRef(null);
  const played = useRef(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  const words = useMemo(() => text.split(' '), [text]);
  const scene = useScene();
  const visible = !scene.id || scene.inView;

  useEffect(() => {
    if (!play || !visible || played.current) return;
    played.current = true;
    const sel = split === 'chars' ? '.at-c' : '.at-w';
    const targets = ref.current.querySelectorAll(sel);
    const v = VARIANTS[variant] || VARIANTS.rise;
    if (REDUCED) {
      gsap.to(targets, { opacity: 1, duration: 0.4, delay, onComplete: () => doneRef.current?.() });
      return;
    }
    const to = { opacity: 1, yPercent: 0, y: 0, rotate: 0, scale: 1 };
    if (v.from.filter) to.filter = 'blur(0px)';
    if (v.from.clipPath) to.clipPath = 'inset(0 0% 0 0)';
    gsap.fromTo(targets, v.from, {
      ...to,
      ease: v.ease,
      duration: duration ?? v.duration,
      stagger: stagger ?? v.stagger,
      delay,
      clearProps: v.from.filter ? 'filter' : undefined,
      onComplete: () => doneRef.current?.(),
    });
  }, [play, visible, split, variant, delay, stagger, duration]);

  return (
    <Tag ref={ref} className={`at ${className}`} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true">
          <span className="at-w">
            {split === 'chars'
              ? [...w].map((c, j) => (
                  <span className="at-c" key={j}>
                    {c}
                  </span>
                ))
              : w}
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
