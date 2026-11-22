import React, { useEffect, useRef, useState } from 'react';
import Scene from '../components/Scene';
import ThoughtCloud from '../components/ThoughtCloud';
import TextSequence from '../components/TextSequence';
import MagneticButton from '../components/MagneticButton';
import Character from '../components/Character';
import ParallaxLayer from '../components/ParallaxLayer';
import { OVERTHINKING } from '../data/content';
import { gsap } from '../lib/gsap';
import { setPose } from '../lib/pose';
import { goTo } from '../lib/director';
import { sfx } from '../lib/audio';
import './Overthinking.css';

const { thoughts: THOUGHTS, echoes: ECHOES, quips: QUIPS, after: AFTER } = OVERTHINKING;

export default function Overthinking() {
  const [left, setLeft] = useState(THOUGHTS.length);
  const [quip, setQuip] = useState('');
  const [cta, setCta] = useState(false);
  const root = useRef(null);
  const tom = useRef(null);
  const countRef = useRef(null);
  const done = left === 0;

  const popped = useRef(0);

  const onPop = () => {
    setLeft((l) => l - 1);
    setQuip(QUIPS[popped.current++ % QUIPS.length]);
    gsap.fromTo(countRef.current, { yPercent: -60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'back.out(2)' });
  };

  useEffect(() => {
    if (tom.current) tom.current.style.setProperty('--shake', String(0.4 + left * 0.5));
    if (!done) return;
    const q = gsap.utils.selector(root);
    const tl = gsap.timeline({ delay: 0.5 });
    tl.to(q('.ot-echo'), { opacity: 0, duration: 1.6, stagger: 0.05, ease: 'sine.out' })
      .to(q('.ot-hud'), { opacity: 0, y: -10, duration: 1 }, 0.8)
      .to(q('.ot-hint'), { opacity: 0, duration: 0.6 }, 0)
      .call(() => {
        setPose(tom.current, 'jerry-hips');
        tom.current?.classList.remove('char--tremble');
        sfx.squeak();
      }, null, 0.9)
      .fromTo(tom.current, { yPercent: 0 }, { yPercent: 12, duration: 0.3, ease: 'power2.in' }, 0.6)
      .to(tom.current, { yPercent: 0, duration: 0.8, ease: 'back.out(2)' }, 0.95);
    return () => tl.kill();
  }, [done, left]);

  return (
    <Scene id="overthinking" theme="overthink" camera="zoom" className="overthink" label="Overthinking">
      <div className={`ot ${done ? 'is-done' : ''}`} ref={root}>
        <ParallaxLayer depth={-0.25} className="ot-echoes">
          {ECHOES.map((e, i) => (
            <span key={i} className="ot-echo" style={{ '--i': i }}>
              {e}
            </span>
          ))}
        </ParallaxLayer>

        <header className="ot-hud" aria-live="polite">
          <span className="eyebrow">{OVERTHINKING.corner}</span>
          <p className="ot-count">
            <b ref={countRef}>{left}</b> {left === 1 ? OVERTHINKING.counterOne : OVERTHINKING.counterMany}
          </p>
          <span className="ot-quip" key={quip}>
            {quip}
          </span>
        </header>

        {!done && (
          <MagneticButton variant="link" className="ot-skip" onClick={() => goTo('october', 'collapse')} sound="soft" burst={false}>
            {OVERTHINKING.skip}
          </MagneticButton>
        )}

        <ThoughtCloud thoughts={THOUGHTS} onPop={onPop} nervous={THOUGHTS.length - left} />

        <p className="ot-hint hint">{OVERTHINKING.hint}</p>

        <Character
          ref={tom}
          name="tom-shocked"
          poses={['tom-shocked', 'jerry-hips']}
          className="ot-tom"
          idle="tremble"
          alt="Tom, overwhelmed"
        />

        {done && (
          <div className="ot-after">
            <TextSequence lines={AFTER} play onDone={() => setCta(true)} className="ot-lines" />
            <div className={`ot-cta ${cta ? 'is-in' : ''}`}>
              <MagneticButton onClick={() => goTo('october', 'collapse')} sound="soft">
                {OVERTHINKING.button}
              </MagneticButton>
            </div>
          </div>
        )}
      </div>
    </Scene>
  );
}
