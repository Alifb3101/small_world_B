import React from 'react';
import Scene from '../components/Scene';
import MiniGame from '../components/MiniGame';
import Character from '../components/Character';
import { goTo } from '../lib/director';
import './KillOverthinking.css';

export default function KillOverthinking() {
  return (
    <Scene id="game" theme="game" camera="zoom" className="ko" label="Kill the overthinking">
      <div className="ko-wrap">
        <header className="ko-head">
          <span className="eyebrow">sixty seconds</span>
          <h2 className="h-serif ko-title">
            Kill the
            <br />
            <em>overthinking.</em>
          </h2>
        </header>
        <Character name="tom-shocked" className="ko-tom" idle="tremble" alt="" shadow={false} />
        <MiniGame onSong={() => goTo('music', 'tunnel')} />
      </div>
    </Scene>
  );
}
