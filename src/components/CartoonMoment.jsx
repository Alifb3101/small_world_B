import React, { useEffect, useRef, useState } from 'react';
import Character from './Character';
import { gsap } from '../lib/gsap';
import { setPose, setFlip } from '../lib/pose';
import { fx } from '../lib/fx';
import { sfx } from '../lib/audio';
import { useScene } from './Scene';
import { buzz, pick, REDUCED } from '../lib/motion';
import { CARTOON } from '../data/content';

const CAP = CARTOON.captions;

/* Positions are percentages of the stage, applied as transforms. */
const PEEKS = [
  { left: 6, top: 54, flip: false },
  { left: 68, top: 18, flip: true },
  { left: 42, top: 62, flip: false },
  { left: 10, top: 22, flip: true },
  { left: 58, top: 48, flip: false },
  { left: 28, top: 38, flip: true },
];

/**
 * A tiny interactive cartoon: Jerry peeks, you tap, he bolts, Tom follows.
 */
export default function CartoonMoment({ onTruce }) {
  const { inView } = useScene();
  const stage = useRef(null);
  const tom = useRef(null);
  const jerry = useRef(null);
  const started = useRef(false);
  const busy = useRef(false);
  const taps = useRef(0);
  const peek = useRef(PEEKS[0]);
  const [live, setLive] = useState(false);
  const [caption, setCaption] = useState(CAP.waiting);
  const [done, setDone] = useState(false);

  const at = (left, top) => {
    const el = stage.current;
    return { x: (el.clientWidth * left) / 100, y: (el.clientHeight * top) / 100 };
  };

  useEffect(() => {
    if (!inView || started.current || !tom.current) return;
    started.current = true;
    const t = tom.current;
    const j = jerry.current;
    gsap.set(t, { ...at(-55, 42), opacity: 1 });
    gsap.set(j, { ...at(110, 58), opacity: 1 });
    setPose(t, 'tom-sneak');
    setFlip(t, true);
    setPose(j, 'jerry-dash');
    setFlip(j, false);

    const tl = gsap.timeline({ delay: REDUCED ? 0 : 0.4 });
    tl.to(t, { x: () => at(8, 0).x, duration: REDUCED ? 0.2 : 1.5, ease: 'power2.out' })
      .call(() => {
        sfx.squeak();
        setCaption(CAP.jerryRuns);
      })
      .to(j, { x: () => at(-40, 0).x, duration: REDUCED ? 0.2 : 0.8, ease: 'power3.in' }, '+=0.15')
      .call(() => {
        setPose(t, 'tom-frustrated');
        setFlip(t, false);
        sfx.thud();
        setCaption(CAP.tomFails);
      })
      .to(t, { xPercent: 4, duration: 0.08, yoyo: true, repeat: 5, ease: 'none' })
      .call(() => {
        const p = PEEKS[1];
        peek.current = p;
        setFlip(j, p.flip);
        setPose(j, 'jerry-sneaky');
        gsap.set(j, { ...at(p.left, p.top), scale: 0.2, opacity: 0 });
      })
      .to(j, { scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(2.2)' })
      .call(() => {
        sfx.chime();
        setCaption(CAP.yourTurn);
        setLive(true);
      });
    return () => tl.kill();
  }, [inView]);

  useEffect(() => {
    const onResize = () => {
      if (!started.current || busy.current || !stage.current) return;
      if (done) gsap.set(tom.current, at(18, 38));
      else if (live) gsap.set(jerry.current, at(peek.current.left, peek.current.top));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [live, done]);

  const run = (e) => {
    if (!live || busy.current || done) return;
    e.stopPropagation();
    busy.current = true;
    taps.current += 1;
    const t = tom.current;
    const j = jerry.current;
    const r = j.getBoundingClientRect();
    fx.burst(r.left + r.width * 0.5, r.top + r.height * 0.4, {
      count: 22,
      colors: ['gold', 'peach', 'cream'],
      speed: [80, 280],
    });
    sfx.squeak();
    buzz(8);

    if (taps.current >= 3) {
      setLive(false);
      setCaption(CAP.truce);
      const tl = gsap.timeline({
        onComplete: () => {
          busy.current = false;
          setDone(true);
          onTruce?.();
        },
      });
      tl.to([j, t], { opacity: 0, yPercent: 10, duration: 0.35, ease: 'power2.in', stagger: 0.05 })
        .call(() => {
          setPose(t, 'together-hug');
          gsap.set(t, { ...at(18, 38), xPercent: 0 });
          gsap.set(j, { opacity: 0 });
        })
        .to(t, { opacity: 1, yPercent: 0, duration: 0.7, ease: 'back.out(1.6)' })
        .call(() => sfx.bloom());
      return;
    }

    const next = pick(PEEKS.filter((p) => p !== peek.current));
    peek.current = next;
    setCaption(pick(CAP.missed));
    setPose(j, 'jerry-dash');
    const tl = gsap.timeline({
      onComplete: () => {
        busy.current = false;
      },
    });
    tl.to(j, { x: at(next.left > 50 ? -45 : 120, 0).x, duration: 0.42, ease: 'power3.in' })
      .call(() => {
        setPose(t, 'tom-sneak');
        setFlip(t, next.left > 40);
        sfx.whoosh(0.4);
      })
      .to(t, { ...at(next.left, next.top - 8), duration: 0.55, ease: 'power2.inOut' }, '<0.08')
      .call(() => {
        setFlip(j, next.flip);
        setPose(j, 'jerry-laugh');
        gsap.set(j, { ...at(next.left, next.top), scale: 0.4, opacity: 0 });
      })
      .to(j, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' })
      .call(() => {
        setPose(t, 'tom-frustrated');
        sfx.bonk();
        setCaption(CAP.tryAgain);
      });
  };

  return (
    <div className={`cm ${done ? 'is-done' : ''}`} ref={stage}>
      <div className="cm-room" aria-hidden="true">
        <span className="cm-wall" />
        <span className="cm-window">
          <video src="/clips/chase-room.mp4" autoPlay muted loop playsInline preload="metadata" />
        </span>
        <span className="cm-sill" />
        <span className="cm-lamp">
          <i />
        </span>
        <span className="cm-plant" />
        <span className="cm-floor" />
        <span className="cm-skirting" />
      </div>

      <Character
        ref={tom}
        name="tom-sneak"
        poses={['tom-sneak', 'tom-frustrated', 'tom-shocked', 'together-hug']}
        className="cm-tom"
        idle={done ? 'breathe' : 'none'}
        alt="Tom"
      />
      <Character
        ref={jerry}
        name="jerry-dash"
        poses={['jerry-dash', 'jerry-sneaky', 'jerry-laugh', 'jerry-hips']}
        className={`cm-jerry ${live ? 'is-live' : ''}`}
        idle={live ? 'bob' : 'none'}
        onClick={run}
        alt="Tap Jerry"
      />

      <p className="cm-caption" key={caption}>
        {caption}
      </p>
    </div>
  );
}
