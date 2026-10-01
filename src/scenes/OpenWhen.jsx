import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Scene from '../components/Scene';
import { Envelope, OpenWhenCard } from '../components/Envelope';
import MagneticButton from '../components/MagneticButton';
import { OPEN_WHEN } from '../data/content';
import { goTo } from '../lib/director';
import { sfx } from '../lib/audio';
import { fx } from '../lib/fx';
import './OpenWhen.css';

export default function OpenWhen() {
  const [open, setOpen] = useState(null);

  const pick = (letter, e) => {
    const r = e.currentTarget.getBoundingClientRect();
    fx.burst(r.left + r.width / 2, r.top + r.height / 2, {
      count: 16,
      colors: ['gold', 'cream'],
      speed: [40, 140],
      gravity: 20,
    });
    sfx.paper();
    setOpen(letter);
  };

  return (
    <Scene id="openwhen" theme="openwhen" camera="rise" className="ow" label="Open when">
      <div className="ow-wrap">
        <header className="ow-head">
          <span className="eyebrow">{OPEN_WHEN.corner}</span>
          <h2 className="h-serif ow-title">
            {OPEN_WHEN.title}
            <br />
            <em>{OPEN_WHEN.titleFancy}</em>
          </h2>
        </header>

        <div className="ow-pile">
          {OPEN_WHEN.letters.map((letter, i) => (
            <Envelope key={letter.id} letter={letter} index={i} onOpen={pick} />
          ))}
        </div>

        <div className="ow-foot">
          <MagneticButton variant="link" onClick={() => goTo('game', 'dream')}>
            {OPEN_WHEN.next}
          </MagneticButton>
        </div>
      </div>
      {open && createPortal(<OpenWhenCard letter={open} onClose={() => setOpen(null)} />, document.body)}
    </Scene>
  );
}
