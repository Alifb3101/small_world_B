import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Scene from '../components/Scene';
import { Envelope, FoldedCard, OpenWhenCard, SecretGate } from '../components/Envelope';
import MagneticButton from '../components/MagneticButton';
import { OPEN_WHEN } from '../data/content';
import { goTo } from '../lib/director';
import { sfx, playLetterSong, stopLetterSong } from '../lib/audio';
import { fx } from '../lib/fx';
import './OpenWhen.css';

export default function OpenWhen() {
  const [open, setOpen] = useState(null);
  const [sealed, setSealed] = useState(false);
  const secret = OPEN_WHEN.secret;

  const pick = (letter, e) => {
    const r = e.currentTarget.getBoundingClientRect();
    fx.burst(r.left + r.width / 2, r.top + r.height / 2, {
      count: 16,
      colors: ['gold', 'cream'],
      speed: [40, 140],
      gravity: 20,
    });
    sfx.paper();
    if (letter.song) playLetterSong(letter.song);
    setOpen(letter);
  };

  const closeLetter = () => {
    stopLetterSong();
    setOpen(null);
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

        <FoldedCard secret={secret} onOpen={() => setSealed(true)} />

        <div className="ow-foot">
          <MagneticButton variant="link" onClick={() => goTo('game', 'dream')}>
            {OPEN_WHEN.next}
          </MagneticButton>
        </div>
      </div>
      {sealed &&
        createPortal(
          <SecretGate
            secret={secret}
            onClose={() => setSealed(false)}
            onUnlock={() => {
              setSealed(false);
              setOpen(secret);
            }}
          />,
          document.body,
        )}
      {open && createPortal(<OpenWhenCard letter={open} onClose={closeLetter} />, document.body)}
    </Scene>
  );
}
