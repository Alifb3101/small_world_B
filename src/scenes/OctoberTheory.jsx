import React, { useEffect, useRef, useState } from 'react';
import Scene from '../components/Scene';
import MagneticButton from '../components/MagneticButton';
import AnimatedText from '../components/AnimatedText';
import TextSequence from '../components/TextSequence';
import { charSrc } from '../components/Character';
import { goTo } from '../lib/director';
import { OCTOBER } from '../data/content';
import './OctoberTheory.css';

const PAGE_FADE = 700;
const LEAVES = [
  { left: '6%', delay: '0s', dur: '13s', size: 18 },
  { left: '22%', delay: '-6s', dur: '16s', size: 14 },
  { left: '41%', delay: '-2s', dur: '18s', size: 12 },
  { left: '63%', delay: '-9s', dur: '14s', size: 16 },
  { left: '81%', delay: '-4s', dur: '17s', size: 20 },
  { left: '93%', delay: '-11s', dur: '15s', size: 13 },
];

export default function OctoberTheory() {
  const pages = OCTOBER.pages;
  const [titleDone, setTitleDone] = useState(false);
  const [page, setPage] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const onPageDone = () => {
    if (page >= pages.length - 1) {
      setDone(true);
      return;
    }
    setLeaving(true);
    timers.current.push(
      setTimeout(() => {
        setPage((p) => p + 1);
        setLeaving(false);
      }, PAGE_FADE),
    );
  };

  return (
    <Scene id="october" theme="october" camera="fade" className="oc" label="The great October theory">
      <div className={`oc-wrap ${done ? 'is-done' : ''}`}>
        <div className="oc-leaves" aria-hidden="true">
          {LEAVES.map((l, i) => (
            <span
              key={i}
              className="oc-leaf"
              style={{ left: l.left, animationDelay: l.delay, animationDuration: l.dur, fontSize: l.size }}
            >
              🍂
            </span>
          ))}
        </div>

        <div className="oc-chase" aria-hidden="true">
          <span className="oc-runner oc-jerry">
            <span className="oc-face">
              <img src={charSrc('jerry-dash')} alt="" draggable="false" />
            </span>
          </span>
          <span className="oc-runner oc-tom">
            <span className="oc-face">
              <img src={charSrc('tom-sneak')} alt="" draggable="false" />
            </span>
          </span>
        </div>

        <header className="oc-head">
          <span className="eyebrow">{OCTOBER.corner}</span>
          <AnimatedText
            as="h2"
            className="h-serif oc-title"
            text={OCTOBER.title}
            split="words"
            variant="blur"
            play
            onDone={() => setTitleDone(true)}
          />
        </header>

        <div className="oc-body">
          <div className={`oc-page ${leaving ? 'is-leaving' : ''}`}>
            <TextSequence
              key={page}
              lines={pages[page]}
              play={titleDone}
              dimPast
              className="oc-lines"
              onDone={onPageDone}
            />
          </div>
          <div className="oc-dots" aria-hidden="true">
            {pages.map((_, i) => (
              <i key={i} className={i === page ? 'is-on' : i < page ? 'is-past' : ''} />
            ))}
          </div>
        </div>

        <div className={`oc-cta ${done ? 'is-in' : 'is-soft'}`}>
          <MagneticButton variant="ghost" onClick={() => goTo('openwhen', 'paper')} sound="paper">
            {OCTOBER.next}
          </MagneticButton>
        </div>
      </div>
    </Scene>
  );
}
