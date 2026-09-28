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
import MusicEscape from './scenes/MusicEscape';
import TomJerryMoment from './scenes/TomJerryMoment';
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

export default function App() {
  useEffect(() => {
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
        <Interlude id="i-notes" theme="notes" variant="notes" text="Quieter in there now. Let’s make some noise. The good kind." />
        <MusicEscape />
        <Interlude id="i-reel" theme="reel" variant="reel" text="Meanwhile, somewhere in a very old cartoon…" />
        <TomJerryMoment />
        <Interlude id="i-paper" theme="paper" variant="plane" text="Some things are better said on paper." />
        <OpenWhen />
        <Interlude id="i-loud" theme="loud" variant="loud" text="Okay. This next one is a little loud." />
        <KillOverthinking />
        <Interlude id="i-small" theme="daily" variant="jerry" text="Meanwhile, in a very small world…" />
        <DailyWorld />
        <Interlude id="i-late" theme="late" variant="late" text="Shh. It’s getting late." />
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
