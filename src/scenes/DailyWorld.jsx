import React, { useMemo, useState } from 'react';
import Scene from '../components/Scene';
import Character from '../components/Character';
import MagneticButton from '../components/MagneticButton';
import { TODAY } from '../data/content';
import { goTo } from '../lib/director';
import { sfx } from '../lib/audio';
import './DailyWorld.css';

const DAYS = TODAY.days;
const DAY_ORDER = ['study', 'music', 'rainy', 'sleepy', 'chaotic', 'lazy'];
const DAY_BY_WEEKDAY = [5, 0, 1, 2, 3, 4, 5]; // Sun lazy … Sat lazy
const todayKey = () => DAY_ORDER[DAY_BY_WEEKDAY[new Date().getDay()]];

export default function DailyWorld() {
  const initial = useMemo(todayKey, []);
  const [day, setDay] = useState(initial);
  const info = DAYS[day];

  const cycle = (dir) => {
    const i = DAY_ORDER.indexOf(day);
    const next = DAY_ORDER[(i + dir + DAY_ORDER.length) % DAY_ORDER.length];
    sfx.soft();
    setDay(next);
  };

  return (
    <Scene id="daily" theme="daily" camera="rise" className="dw" label="A little world, today">
      <div className="dw-wrap">
        <header className="dw-head">
          <span className="eyebrow">{TODAY.corner}</span>
          <h2 className="h-serif dw-title">
            {TODAY.title} <em>{info.name}.</em>
          </h2>
        </header>

        <div className={`dw-globe dw--${day}`} data-nofx>
          <div className="dw-sky" />
          {day === 'rainy' && <div className="dw-rain" />}
          {day === 'sleepy' && <span className="dw-moon" />}
          {day === 'music' && (
            <div className="dw-notes" aria-hidden="true">
              {['♪', '♫', '♩', '♬'].map((n, i) => (
                <span key={i} style={{ '--i': i }}>
                  {n}
                </span>
              ))}
            </div>
          )}
          {day === 'study' && <div className="dw-books" aria-hidden="true" />}
          {day === 'study' && <span className="dw-pencil" aria-hidden="true" />}

          {day === 'study' && <Character name="together-lazy-2" className="dw-main" idle="breathe" shadow={false} />}
          {day === 'study' && <Character name="jerry-sneaky" className="dw-side" idle="bob" shadow={false} />}

          {day === 'music' && <Character name="jerry-laugh" className="dw-main dw-dance" idle="sway" shadow={false} />}
          {day === 'music' && <Character name="tom-holds-jerry" className="dw-side" idle="bob" shadow={false} />}

          {day === 'rainy' && <Character name="tom-holds-jerry" className="dw-main" idle="breathe" shadow={false} />}

          {day === 'sleepy' && <Character name="together-lazy-2" className="dw-main" idle="breathe" shadow={false} />}
          {day === 'sleepy' && (
            <div className="dw-zzz" aria-hidden="true">
              <span>z</span>
              <span>z</span>
              <span>Z</span>
            </div>
          )}

          {day === 'chaotic' && <Character name="chaos" className="dw-main dw-run" idle="none" shadow={false} />}
          {day === 'chaotic' && <Character name="chase-run" className="dw-side dw-run2" idle="none" shadow={false} />}
          {day === 'chaotic' && <Character name="jerry-dash" className="dw-tiny" idle="none" shadow={false} />}

          {day === 'lazy' && <Character name="together-hug" className="dw-main dw-still" idle="none" shadow={false} />}

          <div className="dw-ground" />
          <span className="dw-glass" />
        </div>

        <p className="dw-line" key={day}>
          {info.line}
        </p>

        <div className="dw-dots" role="tablist" aria-label="Pick a kind of day">
          {DAY_ORDER.map((id) => (
            <button
              key={id}
              type="button"
              className={`dw-dot ${id === day ? 'is-on' : ''}`}
              onClick={() => {
                sfx.tap();
                setDay(id);
              }}
              aria-label={DAYS[id].name}
            />
          ))}
        </div>

        <div className="dw-nav">
          <button type="button" className="dw-arrow" onClick={() => cycle(-1)} aria-label="Previous day">
            ‹
          </button>
          <MagneticButton variant="link" onClick={() => goTo('message', 'night')} sound="soft">
            {TODAY.next}
          </MagneticButton>
          <button type="button" className="dw-arrow" onClick={() => cycle(1)} aria-label="Next day">
            ›
          </button>
        </div>
      </div>
    </Scene>
  );
}
