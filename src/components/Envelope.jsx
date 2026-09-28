import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { sfx } from '../lib/audio';
import { REDUCED } from '../lib/motion';
import { lockScroll } from '../lib/director';

/** A slightly battered envelope with a wax seal. */
export function Envelope({ letter, index, onOpen }) {
  const rot = ((index * 17) % 11) - 5;
  return (
    <button
      type="button"
      className={`env env--${letter.tint}`}
      style={{ '--rot': `${rot}deg`, '--i': index }}
      onClick={(e) => onOpen(letter, e)}
      data-nofx
      aria-label={letter.label}
    >
      <span className="env__back" />
      <span className="env__body">
        <span className="env__lines" />
        <span className="env__label">{letter.label}</span>
      </span>
      <span className="env__flap" />
      <span className="env__seal" aria-hidden="true">
        {letter.seal}
      </span>
    </button>
  );
}

/** Unfolded paper, handwritten, filling the night. */
export function OpenWhenCard({ letter, onClose }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const env = el.querySelector('.owc-env');
    const flap = el.querySelector('.owc-flap');
    const paper = el.querySelector('.owc-paper');
    sfx.paper();
    const tl = gsap.timeline();
    tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.25 })
      .fromTo(env, { scale: 0.55, y: 40 }, { scale: 1, y: 0, duration: REDUCED ? 0.2 : 0.7, ease: 'expo.out' }, 0)
      .fromTo(flap, { rotateX: 0 }, { rotateX: -168, duration: REDUCED ? 0.2 : 0.7, ease: 'power2.inOut' }, 0.35)
      .fromTo(
        paper,
        { yPercent: 42, scaleY: 0.15, opacity: 0 },
        { yPercent: -8, scaleY: 1, opacity: 1, duration: REDUCED ? 0.25 : 0.85, ease: 'power3.out' },
        0.7,
      )
      .call(() => sfx.soft());
    return () => tl.kill();
  }, [letter]);

  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    lockScroll(true, 'letter');
    const onKey = (e) => e.key === 'Escape' && closeRef.current();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      lockScroll(false, 'letter');
    };
  }, []);

  return (
    <div className="owc" ref={ref} role="dialog" aria-label={letter.label}>
      <button type="button" className="owc-scrim" onClick={onClose} aria-label="Close the letter" data-nofx />
      <div className="owc-env">
        <div className="owc-pocket">
          <div className={`owc-paper owc-paper--${letter.tint}`}>
            <span className="owc-kicker">{letter.label}</span>
            {letter.body.map((line, i) =>
              line ? (
                <p key={i} className="owc-line">
                  {line}
                </p>
              ) : (
                <br key={i} />
              ),
            )}
          </div>
        </div>
        <div className="owc-flap" />
      </div>
      <button type="button" className="owc-close" onClick={onClose} data-nofx>
        fold it back
      </button>
    </div>
  );
}
