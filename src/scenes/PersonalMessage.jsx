import React from 'react';
import Scene from '../components/Scene';
import InteractiveMessage from '../components/InteractiveMessage';
import './PersonalMessage.css';

export default function PersonalMessage() {
  return (
    <Scene id="message" theme="message" camera="zoom" className="pm" label="One serious thing">
      <div className="pm-wrap">
        <InteractiveMessage />
      </div>
    </Scene>
  );
}
