import React, { useState } from 'react';
import Scene from '../components/Scene';
import CartoonMoment from '../components/CartoonMoment';
import MagneticButton from '../components/MagneticButton';
import AnimatedText from '../components/AnimatedText';
import { goTo } from '../lib/director';
import './TomJerryMoment.css';

export default function TomJerryMoment() {
  const [truce, setTruce] = useState(false);

  return (
    <Scene id="tomjerry" theme="cartoon" camera="drift" className="tj" label="A tiny cartoon">
      <div className="tj-wrap">
        <header className="tj-head">
          <span className="eyebrow">a very old argument</span>
          <AnimatedText
            as="h2"
            className="h-serif tj-title"
            text="He’s been chasing him since 1940."
            split="words"
            variant="blur"
            play
          />
        </header>
        <CartoonMoment onTruce={() => setTruce(true)} />
        <div className={`tj-cta ${truce ? 'is-in' : 'is-soft'}`}>
          <MagneticButton variant="ghost" onClick={() => goTo('openwhen', 'paper')} sound="paper">
            okay. something quieter →
          </MagneticButton>
        </div>
      </div>
    </Scene>
  );
}
