import React, { useLayoutEffect, useRef, useState } from 'react';
import Scene from '../components/Scene';
import AnimatedText from '../components/AnimatedText';
import MagneticButton from '../components/MagneticButton';
import Character from '../components/Character';
import { gsap } from '../lib/gsap';
import { sky } from '../lib/sky';
import { fx } from '../lib/fx';
import { REDUCED } from '../lib/motion';
import { story } from '../lib/store';
import { unlock, startAmbience, sfx } from '../lib/audio';
import { goTo, lockScroll } from '../lib/director';
import { ARRIVAL } from '../data/content';
import './Arrival.css';

const clock = () =>
  new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase();

export default function Arrival() {
  const root = useRef(null);
  const tlRef = useRef(null);
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      sky.fade(0, { instant: true });
      gsap.set('.arr-art', { '--r': '0%', opacity: 0, scale: 1.1 });
      gsap.set('.arr-light', { scale: 0, opacity: 0 });
      gsap.set('.arr-halo', { scale: 0.55, opacity: 0 });
      gsap.set(['.arr-cta', '.arr-slate'], { opacity: 0, y: 18 });

      const tl = gsap.timeline({ delay: 0.4 });
      tl.call(() => sky.fade(0.4, { k: 0.006 }), null, 0.1)
        .to('.arr-light', { scale: 1, opacity: 1, duration: 2.4, ease: 'sine.out' }, 1.5)
        .call(() => setStep(1), null, 2.7)
        .call(() => setStep(2), null, 4.5)
        .to('.arr-intro', { opacity: 0, y: -24, filter: 'blur(8px)', duration: 1.2, ease: 'power2.in' }, 6.9)
        .call(() => sky.fade(1, { k: 0.01 }), null, 7.1)
        .to('.arr-light', { scale: 10, opacity: 0, duration: 2.6, ease: 'power2.inOut' }, 7.3)
        .to('.arr-halo', { opacity: 1, scale: 1, duration: 3.2, ease: 'sine.out' }, 7.4)
        .to('.arr-art', { '--r': '100%', opacity: 1, scale: 1, duration: 3.2, ease: 'sine.inOut' }, 7.5)
        .call(() => setStep(3), null, 8.9)
        .to('.arr-slate', { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out' }, 9.2)
        .call(() => setStep(4), null, 10.7)
        .to('.arr-art .char__flip', { rotate: -2.5, y: -8, duration: 0.45, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 12.1)
        .to('.arr-cta', { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out' }, 12.6)
        .call(() => setReady(true), null, 12.6);
      tlRef.current = tl;
      if (REDUCED) tl.progress(1);
    }, root);
    return () => ctx.revert();
  }, []);

  const hurry = () => {
    if (!ready && tlRef.current) tlRef.current.timeScale(3.2);
  };

  const poke = (e) => {
    unlock();
    sfx.squeak();
    fx.burst(e.clientX, e.clientY, { count: 18, colors: ['gold', 'cream'], speed: [60, 200] });
    gsap.fromTo(
      root.current.querySelector('.arr-art .char__flip'),
      { rotate: 0, y: 0 },
      { keyframes: [{ rotate: -4, y: -14, duration: 0.18 }, { rotate: 3, y: 0, duration: 0.2 }, { rotate: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' }] },
    );
  };

  const enter = () => {
    unlock();
    startAmbience();
    lockScroll(false, 'intro');
    story.set({ entered: true });
    goTo('overthinking', 'tunnel');
  };

  return (
    <Scene id="arrival" theme="arrival" camera="none" className="arrival" label="Arrival">
      <div className="arr" ref={root} onPointerDown={hurry}>
        <div className="arr-slate" aria-hidden="true">
          <span className="eyebrow">{ARRIVAL.corner}</span>
          <span className="eyebrow">{clock()}</span>
        </div>

        <div className="arr-stage">
          <div className="arr-halo" />
          <div className="arr-light" />
          <Character
            name="doraemon-v2"
            className="arr-art"
            idle="breathe"
            eager
            shadow={false}
            onClick={poke}
            alt="Doraemon, waiting for you"
          />
          <div className="arr-intro">
            <AnimatedText as="p" text={ARRIVAL.intro[0]} play={step >= 1} className="arr-line" stagger={0.06} />
            <AnimatedText as="p" text={ARRIVAL.intro[1]} play={step >= 2} className="arr-line arr-line--2" stagger={0.06} />
          </div>
        </div>

        <div className="arr-copy">
          <AnimatedText as="h1" text={ARRIVAL.title} play={step >= 3} className="arr-title h-serif" stagger={0.055} />
          <AnimatedText
            as="p"
            text={ARRIVAL.subtitle}
            split="words"
            variant="blur"
            play={step >= 4}
            className="arr-sub"
          />
          <div className={`arr-cta ${ready ? 'is-ready' : ''}`}>
            <MagneticButton onClick={enter} sound="sparkle">
              {ARRIVAL.button}
            </MagneticButton>
          </div>
        </div>
      </div>
    </Scene>
  );
}
