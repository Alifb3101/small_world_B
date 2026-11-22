import React from 'react';
import Scene from '../components/Scene';
import MiniGame from '../components/MiniGame';
import Character from '../components/Character';
import { goTo } from '../lib/director';
import { GAME } from '../data/content';
import './KillOverthinking.css';

export default function KillOverthinking() {
  return (
    <Scene id="game" theme="game" camera="zoom" className="ko" label="Kill the overthinking">
      <div className="ko-wrap">
        <header className="ko-head">
          <span className="eyebrow">{GAME.corner}</span>
          <h2 className="h-serif ko-title">
            {GAME.title}
            <br />
            <em>{GAME.titleFancy}</em>
          </h2>
        </header>
        <Character name="tom-shocked" className="ko-tom" idle="tremble" alt="" shadow={false} />
        <MiniGame onSong={null} onNext={() => goTo('daily', 'dream')} />
      </div>
    </Scene>
  );
}
