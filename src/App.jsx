import React, { useEffect } from 'react';
import StarField from './components/StarField';
import ParticleField from './components/ParticleField';
import FilmGrain from './components/FilmGrain';
import SceneTransition from './components/SceneTransition';
import AudioController from './components/AudioController';
import StoryThread from './components/StoryThread';
import Interlude from './components/Interlude';
import Arrival from './scenes/Arrival';
import Overthinking from './scenes/Overthinking';
// import MusicEscape from './scenes/MusicEscape';
import OctoberTheory from './scenes/OctoberTheory';
import OpenWhen from './scenes/OpenWhen';
import KillOverthinking from './scenes/KillOverthinking';
import DailyWorld from './scenes/DailyWorld';
import PersonalMessage from './scenes/PersonalMessage';
import FinalCalm from './scenes/FinalCalm';
import { fx } from './lib/fx';
import { lockScroll } from './lib/director';
import { story } from './lib/store';
import { ScrollTrigger } from './lib/gsap';
import { warmAssets } from './lib/preload';
import { CARTOON, OPEN_WHEN, GAME, TODAY, MESSAGE } from './data/content';

export default function App() {
  useEffect(() => {
    // slides only change through buttons (goTo), never by user scrolling
    lockScroll(true, 'slides');
    if (!story.get().entered) lockScroll(true, 'intro');
    const onDown = (e) => {
      if (e.target.closest?.('[data-nofx]')) return;
      fx.burst(e.clientX, e.clientY, {
        count: 7,
        speed: [30, 110],
        size: [1, 2.4],
        life: [0.35, 0.7],
        gravity: -20,
        colors: ['cream', 'gold'],
        sparks: 0,
      });
    };
    window.addEventListener('pointerdown', onDown, { passive: true });
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);

    let warm = setTimeout(warmAssets, 5000);
    const unsub = story.subscribe((s) => {
      if (!s.entered) return;
      unsub();
      clearTimeout(warm);
      warm = setTimeout(warmAssets, 3000);
    });
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('load', refresh);
      clearTimeout(warm);
      unsub();
    };
  }, []);

  return (
    <>
      <div className="sky-bg" aria-hidden="true">
        <i />
        <i />
      </div>
      <StarField />
      <main className="story">
        <Arrival />
        <Overthinking />
        {/* Songs tab hidden
        <Interlude id="i-notes" theme="notes" variant="notes" text={MUSIC.leadIn} />
        <MusicEscape />
        */}
        <Interlude id="i-reel" theme="reel" variant="reel" text={CARTOON.leadIn} />
        <OctoberTheory />
        <Interlude id="i-paper" theme="paper" variant="plane" text={OPEN_WHEN.leadIn} />
        <OpenWhen />
        <Interlude id="i-loud" theme="loud" variant="loud" text={GAME.leadIn} />
        <KillOverthinking />
        <Interlude id="i-small" theme="daily" variant="jerry" text={TODAY.leadIn} />
        <DailyWorld />
        <Interlude id="i-late" theme="late" variant="late" text={MESSAGE.leadIn} />
        <PersonalMessage />
        <FinalCalm />
      </main>
      <ParticleField />
      <FilmGrain />
      <SceneTransition />
      <StoryThread />
      <AudioController />
    </>
  );
}
