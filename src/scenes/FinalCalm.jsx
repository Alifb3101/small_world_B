import React, { useState } from 'react';
import Scene, { useScene } from '../components/Scene';
import Character from '../components/Character';
import MagneticButton from '../components/MagneticButton';
import TextSequence from '../components/TextSequence';
import { FINAL_LINES } from '../data/content';
import { sky } from '../lib/sky';
import { story } from '../lib/store';
import { sfx, setAmbience } from '../lib/audio';
import { gsap } from '../lib/gsap';
import { fx } from '../lib/fx';
import './FinalCalm.css';

const BREATHE = [{ text: 'Breathe.', hold: 1200, big: true, className: 'fc-breathe' }];

export default function FinalCalm() {
  return (
    <Scene id="final" theme="final" camera="fade" exit={false} className="fc" label="For now">
      <FinalContent />
    </Scene>
  );
}

function FinalContent() {
  const { inView } = useScene();
  const [phase, setPhase] = useState(0);
  const [still, setStill] = useState(false);

  const ok = (e) => {
    sfx.swell();
    sky.stillTo(1);
    sky.calmTo(1);
    setAmbience(0.03, 420);
    story.set({ still: true });
    document.documentElement.classList.add('is-still');
    const r = e.currentTarget.getBoundingClientRect();
    fx.embers(40);
    fx.ring(r.left + r.width / 2, r.top + r.height / 2, { radius: 200, color: 'moon', life: 1.6 });
    gsap.to('.fc-wrap', { filter: 'saturate(0.7) brightness(0.85)', duration: 2.4, ease: 'sine.inOut' });
    setStill(true);
  };

  return (
    <div className={`fc-wrap ${still ? 'is-still' : ''}`}>
      <span className="fc-moon" aria-hidden="true" />
      <span className="fc-haze" aria-hidden="true" />
      <Character name="together-lazy" className="fc-art" idle={still ? 'none' : 'breathe'} shadow={false} />

      <div className="fc-copy">
        <TextSequence lines={FINAL_LINES} play={inView} dimPast className="fc-lines" onDone={() => setPhase(1)} />
        {phase >= 1 && <TextSequence lines={BREATHE} play className="fc-lines" onDone={() => setPhase(2)} />}
        {phase >= 2 && !still && (
          <div className="fc-cta">
            <MagneticButton onClick={ok} sound="chime">
              I’m okay now 🌙
            </MagneticButton>
          </div>
        )}
        {still && <p className="fc-night">Goodnight, overthinker. 🫶</p>}
      </div>
    </div>
  );
}
