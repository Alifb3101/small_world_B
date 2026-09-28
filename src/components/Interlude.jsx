import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { REDUCED } from '../lib/motion';
import Scene from './Scene';
import ParallaxLayer from './ParallaxLayer';
import { charSrc } from './Character';
import './Interlude.css';

const REEL = ['jerry-laugh', 'tom-sneak', 'chase-run', 'jerry-cheese', 'tom-shocked', 'together-hug', 'jerry-sneaky'];

/**
 * The connective tissue between scenes: a line of text that lights up word by
 * word as you scroll, plus a small moving thing that carries you onward.
 */
export default function Interlude({ id, theme, text, variant }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const ctx = gsap.context(() => {
      if (REDUCED) return;
      const st = (extra) => ({ trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6, ...extra });
      gsap.fromTo(
        '.il-w',
        { opacity: 0.07, y: 16 },
        { opacity: 1, y: 0, stagger: 0.12, ease: 'none', scrollTrigger: st({ start: 'top 85%', end: 'center 45%' }) },
      );
      if (variant === 'reel') {
        gsap.fromTo('.il-reel', { xPercent: 8 }, { xPercent: -62, ease: 'none', scrollTrigger: st({ scrub: true }) });
      }
      if (variant === 'plane') {
        gsap
          .timeline({ scrollTrigger: st() })
          .fromTo('.il-plane', { x: '-25vw', y: '26vh', rotate: -14 }, { x: '45vw', y: '4vh', rotate: 6, ease: 'sine.inOut' })
          .to('.il-plane', { x: '125vw', y: '-28vh', rotate: -22, ease: 'sine.in' });
      }
      if (variant === 'jerry') {
        gsap
          .timeline({ scrollTrigger: st({ start: 'top 70%', end: 'bottom 30%' }) })
          .fromTo('.il-jerry', { xPercent: 110, rotate: 12 }, { xPercent: 18, rotate: -6, ease: 'back.out(1.6)' })
          .to('.il-jerry', { xPercent: 22, duration: 1.2 })
          .to('.il-jerry', { xPercent: 115, rotate: 10, ease: 'power2.in' });
      }
      if (variant === 'loud') {
        gsap.fromTo(
          '.il-bang',
          { scale: 0, rotate: -20 },
          { scale: 1, rotate: 0, stagger: 0.15, ease: 'back.out(2)', scrollTrigger: st({ start: 'top 75%', end: 'center 50%' }) },
        );
      }
      if (variant === 'late') {
        gsap.fromTo('.il-moonlet', { y: '-30vh', opacity: 0 }, { y: '0vh', opacity: 1, ease: 'none', scrollTrigger: st() });
      }
    }, el);
    return () => ctx.revert();
  }, [variant]);

  return (
    <Scene id={id} theme={theme} className={`interlude interlude--${variant}`} camera="none">
      <div className="il" ref={ref}>
        {variant === 'notes' && (
          <ParallaxLayer depth={0.35} className="il-notes" aria-hidden="true">
            {['♪', '♫', '♩', '♪', '♬', '♪'].map((n, i) => (
              <span key={i} className="il-note" style={{ '--i': i, top: `${[22, 64, 34, 72, 26, 54][i]}%` }}>
                {n}
              </span>
            ))}
          </ParallaxLayer>
        )}
        {variant === 'reel' && (
          <div className="il-reel-wrap" aria-hidden="true">
            <div className="il-reel">
              {[...REEL, ...REEL].map((n, i) => (
                <span className="il-frame" key={i}>
                  <img src={charSrc(n)} alt="" loading="lazy" decoding="async" />
                </span>
              ))}
            </div>
          </div>
        )}
        {variant === 'plane' && (
          <svg className="il-plane" viewBox="0 0 64 40" aria-hidden="true">
            <path d="M2 20 L62 2 L40 38 L30 24 Z" fill="#f6ecd9" />
            <path d="M30 24 L62 2 L24 28 Z" fill="#d9ccb4" />
          </svg>
        )}
        {variant === 'jerry' && <img className="il-jerry" src={charSrc('jerry-sneaky')} alt="" loading="lazy" />}
        {variant === 'loud' && (
          <div className="il-bangs" aria-hidden="true">
            <span className="il-bang">!!</span>
            <span className="il-bang">?!</span>
            <span className="il-bang">!</span>
          </div>
        )}
        {variant === 'late' && <span className="il-moonlet" aria-hidden="true" />}

        <p className="il-text">
          {text.split(' ').map((w, i) => (
            <span className="il-w" key={i}>
              {w}{' '}
            </span>
          ))}
        </p>
      </div>
    </Scene>
  );
}
