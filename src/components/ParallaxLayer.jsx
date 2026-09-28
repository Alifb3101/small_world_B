import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { REDUCED, isDesktop } from '../lib/motion';

/**
 * Moves at a different speed than the scroll.
 * depth > 0: foreground (faster), depth < 0: background (slower).
 */
export default function ParallaxLayer({ depth = 0.2, drift = 0, className = '', style, children, as: Tag = 'div' }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (REDUCED) return;
    const el = ref.current;
    const trigger = el.closest('[data-scene]') || el;
    const amp = () => depth * window.innerHeight * (isDesktop() ? 0.7 : 0.45);
    const t = gsap.fromTo(
      el,
      { y: () => amp(), x: () => -drift * amp() },
      {
        y: () => -amp(),
        x: () => drift * amp(),
        ease: 'none',
        scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
      },
    );
    return () => {
      t.scrollTrigger?.kill();
      t.kill();
    };
  }, [depth, drift]);

  return (
    <Tag ref={ref} className={`plx ${className}`} style={style}>
      {children}
    </Tag>
  );
}
