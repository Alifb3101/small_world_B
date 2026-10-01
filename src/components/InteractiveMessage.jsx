import React, { useState } from 'react';
import { fx } from '../lib/fx';
import { sfx } from '../lib/audio';
import { sky } from '../lib/sky';
import { MESSAGE } from '../data/content';
import { buzz } from '../lib/motion';
import { goTo } from '../lib/director';
import TextSequence from './TextSequence';
import MagneticButton from './MagneticButton';

/**
 * A tiny glowing thing in the dark. Tap it. It opens. Then it tells the truth.
 */
export default function InteractiveMessage() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  const reveal = (e) => {
    if (open) return;
    const r = e.currentTarget.getBoundingClientRect();
    fx.burst(r.left + r.width / 2, r.top + r.height / 2, {
      count: 40,
      colors: ['gold', 'moon', 'cream'],
      speed: [40, 220],
      gravity: -30,
      toStars: 10,
    });
    fx.ring(r.left + r.width / 2, r.top + r.height / 2, { radius: 160, color: 'gold', life: 1.2 });
    sfx.bloom();
    buzz(12);
    sky.calmTo(0.7);
    setOpen(true);
  };

  return (
    <div className={`im ${open ? 'is-open' : ''} ${done ? 'is-done' : ''}`}>
      {!open && (
        <button type="button" className="im-glow" onClick={reveal} data-nofx aria-label="A small glowing thing. Tap it.">
          <span className="im-core" />
          <span className="im-halo" />
          <span className="im-hint">{MESSAGE.glowHint}</span>
        </button>
      )}
      {open && (
        <TextSequence lines={MESSAGE.lines} play dimPast className="im-lines" onDone={() => setDone(true)} />
      )}
      {open && (
        <div className={`im-cta ${done ? 'is-in' : ''}`}>
          <MagneticButton variant="link" onClick={() => goTo('final', 'night')} sound="soft">
            {MESSAGE.next}
          </MagneticButton>
        </div>
      )}
    </div>
  );
}
