import React, { useEffect, useRef, useState } from 'react';
import { useStore, story } from '../lib/store';
import { audioState, setEnabled, getLevel, unlock, stopSong } from '../lib/audio';
import { SONGS } from '../data/content';
import { fx } from '../lib/fx';

/**
 * A small moon that lives in the corner of the world.
 * Tap: sound on/off. Its rings breathe with whatever is playing.
 */
export default function AudioController() {
  const { enabled, song } = useStore(audioState);
  const { entered, overlay } = useStore(story);
  const bars = useRef([]);
  const moon = useRef(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!song) return;
    const s = SONGS.find((x) => x.id === song);
    setToast(s?.title);
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [song]);

  useEffect(() => {
    if (!song) {
      if (moon.current) moon.current.style.transform = '';
      return;
    }
    let raf;
    let lvl = 0;
    let last = -1;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      lvl += (getLevel() - lvl) * 0.3;
      if (Math.abs(lvl - last) < 0.005) return;
      last = lvl;
      if (!overlay) {
        bars.current.forEach((b, i) => {
          if (b) b.style.transform = `scaleY(${(0.25 + lvl * (0.9 + ((i * 37) % 10) / 12) * 1.4).toFixed(3)})`;
        });
      }
      if (moon.current) moon.current.style.transform = `scale(${(1 + lvl * 0.35).toFixed(3)})`;
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [song, overlay]);

  const toggle = (e) => {
    unlock();
    setEnabled(!enabled);
    fx.burst(e.clientX, e.clientY, { count: 14, colors: ['moon', 'gold'], speed: [40, 140] });
  };

  const current = SONGS.find((x) => x.id === song);

  return (
    <div className={`audio ${entered ? 'is-in' : ''} ${overlay ? 'is-overlay' : ''}`} data-nofx>
      {current && (
        <button type="button" className={`audio__now ${toast ? 'is-open' : ''}`} onClick={() => stopSong()} aria-label={`Stop ${current.title}`}>
          <span className="audio__bars" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <i key={i} ref={(el) => (bars.current[i] = el)} />
            ))}
          </span>
          <span className="audio__title">{current.title}</span>
        </button>
      )}
      <button
        type="button"
        className={`audio__orb ${enabled ? 'is-on' : 'is-off'} ${song ? 'is-playing' : ''}`}
        onClick={toggle}
        aria-label={enabled ? 'Mute the little world' : 'Turn sound on'}
        aria-pressed={enabled}
      >
        <span className="audio__ring" />
        <span className="audio__ring audio__ring--2" />
        <span className="audio__moon" ref={moon} />
        {!enabled && <span className="audio__zz">z</span>}
      </button>
    </div>
  );
}
