import React, { memo, useMemo } from 'react';
import Character from './Character';
import './MusicWorld.css';

/* deterministic "random" so skylines don't reshuffle on every render */
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function Skyline({ seed, height, windows, className }) {
  const buildings = useMemo(() => {
    const r = seeded(seed);
    const out = [];
    let x = -10;
    while (x < 410) {
      const w = 26 + r() * 44;
      const h = height * (0.35 + r() * 0.65);
      const wins = [];
      if (windows) {
        for (let wy = 300 - h + 10; wy < 290; wy += 14) {
          for (let wx = x + 6; wx < x + w - 8; wx += 11) {
            const v = r();
            if (v > 0.62) wins.push({ x: wx, y: wy, on: v > 0.8, blink: v > 0.975 });
          }
        }
      }
      out.push({ x, w, h, wins });
      x += w + 2 + r() * 6;
    }
    return out;
  }, [seed, height, windows]);

  return (
    <svg className={className} viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      {buildings.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={300 - b.h} width={b.w} height={b.h} className="sk-b" />
          {b.wins.map((w, j) => (
            <rect
              key={j}
              x={w.x}
              y={w.y}
              width="5"
              height="7"
              className={`sk-w ${w.on ? 'is-on' : ''} ${w.blink ? 'is-blink' : ''}`}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

const Strip = ({ className, children }) => (
  <div className={`strip ${className}`} aria-hidden="true">
    {children}
    {children}
  </div>
);

function Train() {
  return (
    <div className="mw mw--train">
      <div className="tr-sky" />
      <div className="tr-sun" data-pulse />
      <Strip className="tr-far">
        <svg viewBox="0 0 800 200" preserveAspectRatio="none">
          <path d="M0 200 L0 120 L60 84 L120 112 L200 52 L280 100 L340 72 L420 118 L500 62 L580 106 L660 76 L740 112 L800 120 L800 200Z" />
        </svg>
      </Strip>
      <Strip className="tr-mid">
        <svg viewBox="0 0 800 200" preserveAspectRatio="none">
          <path d="M0 200 L0 150 Q100 108 200 140 T400 132 T600 146 T800 150 L800 200Z" />
        </svg>
      </Strip>
      <Strip className="tr-near">
        <svg viewBox="0 0 800 200" preserveAspectRatio="none">
          <path d="M0 200 L0 170 Q60 150 120 172 Q170 140 240 168 Q320 150 400 172 Q470 146 540 170 Q620 152 700 172 Q760 150 800 170 L800 200Z" />
          {[80, 280, 480, 680].map((x) => (
            <rect key={x} x={x} y="40" width="5" height="150" />
          ))}
          <path d="M0 58 Q100 72 200 58 T400 58 T600 58 T800 58" fill="none" strokeWidth="1.2" className="tr-wire" />
        </svg>
      </Strip>
      <div className="tr-dust">
        {Array.from({ length: 12 }, (_, i) => (
          <i key={i} style={{ '--i': i, '--t': `${20 + ((i * 13) % 50)}%` }} />
        ))}
      </div>
      <div className="tr-cabin">
        <div className="tr-window" />
        <div className="tr-sheen" />
        <div className="tr-sill" />
        <Character name="together-hug" className="tr-chars" idle="breathe" shadow={false} eager />
      </div>
    </div>
  );
}

function City() {
  return (
    <div className="mw mw--city">
      <div className="ct-sky" />
      <div className="ct-moon" />
      <Skyline seed={7} height={210} windows={false} className="ct-far" />
      <video
        className="ct-clip"
        src="/clips/rain-city.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <Skyline seed={21} height={170} windows className="ct-near" />
      <span className="ct-neon ct-neon--1">open late</span>
      <span className="ct-neon ct-neon--2">☾ café</span>
      <div className="ct-street">
        <span className="ct-refl ct-refl--1" />
        <span className="ct-refl ct-refl--2" />
        <span className="ct-refl ct-refl--3" />
        {Array.from({ length: 6 }, (_, i) => (
          <i key={i} className="ct-ripple" style={{ '--i': i, '--t': `${30 + ((i * 17) % 50)}%` }} />
        ))}
      </div>
      <div className="ct-cars">
        <span className="ct-car" style={{ '--d': '9s', '--y': '78%', '--c': '243,207,138' }} />
        <span className="ct-car ct-car--back" style={{ '--d': '13s', '--y': '82%', '--c': '232,120,120' }} />
        <span className="ct-car" style={{ '--d': '17s', '--y': '86%', '--c': '233,228,255' }} />
      </div>
      <div className="ct-rain ct-rain--far" />
      <div className="ct-rain ct-rain--near" />
    </div>
  );
}

function Sky() {
  return (
    <div className="mw mw--sky">
      <div className="sk-sky" />
      <div className="sk-rays" />
      <div className="sk-sun" data-pulse />
      <div className="sk-clouds sk-clouds--far">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className="cloud" style={{ '--i': i }} />
        ))}
      </div>
      <div className="sk-birds">
        {Array.from({ length: 4 }, (_, i) => (
          <span key={i} className="bird" style={{ '--i': i }}>
            <svg viewBox="0 0 40 16">
              <path d="M0 10 Q10 0 20 10 Q30 0 40 10" />
            </svg>
          </span>
        ))}
      </div>
      <Character name="jerry-dash" className="sk-jerry" idle="bob" shadow={false} eager />
      <div className="sk-clouds sk-clouds--near">
        {Array.from({ length: 3 }, (_, i) => (
          <span key={i} className="cloud" style={{ '--i': i }} />
        ))}
      </div>
    </div>
  );
}

function Room() {
  return (
    <div className="mw mw--room">
      <div className="rm-wall" />
      <div className="rm-window">
        <span className="rm-moon" />
        {Array.from({ length: 7 }, (_, i) => (
          <i key={i} className="rm-star" style={{ '--i': i, '--t': `${12 + ((i * 23) % 60)}%` }} />
        ))}
        <span className="rm-curtain rm-curtain--l" />
        <span className="rm-curtain rm-curtain--r" />
      </div>
      <div className="rm-beam" />
      <div className="rm-clock">
        <i />
      </div>
      <div className="rm-lamp">
        <span className="rm-glow" data-pulse />
        <span className="rm-shade" />
        <span className="rm-stand" />
        <span className="rm-moth" />
      </div>
      <div className="rm-floor" />
      <div className="rm-bed">
        <span className="rm-pillow" />
        <span className="rm-blanket" />
      </div>
      <Character name="together-lazy" className="rm-chars" idle="breathe" shadow={false} eager />
      <div className="rm-zzz" aria-hidden="true">
        <span>z</span>
        <span>z</span>
        <span>Z</span>
      </div>
      <div className="rm-mug">
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}

const WORLDS = { train: Train, city: City, sky: Sky, room: Room };

function MusicWorld({ id }) {
  const W = WORLDS[id];
  return W ? <W /> : null;
}

export default memo(MusicWorld);
