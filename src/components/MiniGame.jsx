import React, { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';
import { fx } from '../lib/fx';
import { sfx } from '../lib/audio';
import { GAME } from '../data/content';
import { buzz, pick, rand, REDUCED } from '../lib/motion';
import { useScene } from './Scene';
import { lockScroll } from '../lib/director';
import MagneticButton from './MagneticButton';
import TextSequence from './TextSequence';

const { words: GAME_WORDS, quips: GAME_QUIPS, end: END } = GAME;

let uid = 1;

/**
 * Sixty seconds of tapping attacking thoughts.
 * Not a productivity tool. A tiny tantrum, on purpose.
 */
export default function MiniGame({ onSong, onNext }) {
  const { inView } = useScene();
  const area = useRef(null);
  const items = useRef([]);
  const raf = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [zainab, setZainab] = useState(0);
  const [brain, setBrain] = useState(0);
  const [left, setLeft] = useState(60);
  const [ended, setEnded] = useState(false);
  const [cta, setCta] = useState(false);
  const [quip, setQuip] = useState('');
  const playingRef = useRef(false);
  const scores = useRef({ z: 0, b: 0 });

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current);
      items.current.forEach((b) => b.el?.remove());
      lockScroll(false, 'game');
    },
    [],
  );

  useEffect(() => {
    if (!playing) return;
    const t0 = performance.now();
    const iv = setInterval(() => {
      const s = Math.max(0, 60 - Math.floor((performance.now() - t0) / 1000));
      setLeft(s);
      if (s <= 0) finish();
    }, 250);
    return () => clearInterval(iv);
  }, [playing]);

  useEffect(() => {
    if (!playing || !inView) {
      cancelAnimationFrame(raf.current);
      return;
    }
    let last = performance.now();
    let spawnAt = 0;
    const loop = (now) => {
      raf.current = requestAnimationFrame(loop);
      const dt = Math.min(0.04, (now - last) / 1000);
      last = now;
      const box = area.current;
      if (!box) return;
      const W = box.clientWidth;
      const H = box.clientHeight;
      if (now > spawnAt && items.current.length < 7) {
        spawn(W, H);
        spawnAt = now + rand(420, 900);
      }
      items.current.forEach((b) => {
        b.life -= dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.vx += Math.sin(now / 400 + b.seed) * 8 * dt;
        b.vy += Math.cos(now / 520 + b.seed) * 6 * dt;
        if (b.el) {
          const s = 0.75 + Math.min(1, (b.max - b.life) / 0.4) * 0.45;
          b.el.style.transform = `translate3d(${b.x}px,${b.y}px,0) scale(${s}) rotate(${b.rot}deg)`;
          b.el.style.opacity = b.life < 0.2 ? String(b.life / 0.2) : '1';
        }
        if (b.life <= 0 && !b.hit) miss(b);
      });
      items.current = items.current.filter((b) => b.life > 0 && !b.dead);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [playing, inView]);

  const spawn = (W, H) => {
    const edge = pick(['l', 'r', 't']);
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'mg-bub';
    el.dataset.nofx = '';
    el.textContent = pick(GAME_WORDS);
    let x, y, vx, vy;
    if (edge === 'l') {
      x = -40;
      y = rand(40, H - 80);
      vx = rand(70, 140);
      vy = rand(-40, 40);
    } else if (edge === 'r') {
      x = W + 10;
      y = rand(40, H - 80);
      vx = -rand(70, 140);
      vy = rand(-40, 40);
    } else {
      x = rand(20, W - 140);
      y = -30;
      vx = rand(-50, 50);
      vy = rand(80, 150);
    }
    el.style.transform = `translate3d(${x}px,${y}px,0) scale(0.4)`;
    area.current.appendChild(el);
    const b = { id: uid++, el, x, y, vx, vy, life: rand(2.4, 3.8), max: 3.2, seed: Math.random() * 10, rot: rand(-8, 8), hit: false, dead: false };
    el.addEventListener('click', (e) => pop(b, e), { once: true });
    items.current.push(b);
  };

  const pop = (b, e) => {
    if (b.hit || !playingRef.current) return;
    b.hit = true;
    b.dead = true;
    b.life = 0;
    scores.current.z += 1;
    setZainab(scores.current.z);
    setQuip(pick(GAME_QUIPS));
    const x = e.clientX;
    const y = e.clientY;
    fx.burst(x, y, { count: 36, colors: ['peach', 'gold', 'cream'], speed: [140, 420], gravity: 90, toStars: 2 });
    fx.ring(x, y, { radius: 70, color: 'peach' });
    sfx.pop(rand(0.9, 1.3));
    buzz(10);
    gsap.fromTo(area.current, { x: 0 }, { x: 6, duration: 0.03, yoyo: true, repeat: 5, clearProps: 'x' });
    gsap.to(b.el, { scale: 1.4, opacity: 0, duration: 0.18, ease: 'power2.in', onComplete: () => b.el.remove() });
  };

  const miss = (b) => {
    b.dead = true;
    scores.current.b += 1;
    setBrain(scores.current.b);
    sfx.deflate();
    b.el?.remove();
  };

  const start = () => {
    if (REDUCED) {
      /* still playable, just fewer */
    }
    scores.current = { z: 0, b: 0 };
    setZainab(0);
    setBrain(0);
    setLeft(60);
    setEnded(false);
    setCta(false);
    items.current.forEach((b) => b.el?.remove());
    items.current = [];
    lockScroll(true, 'game');
    sfx.bloom();
    playingRef.current = true;
    setPlaying(true);
  };

  const finish = () => {
    if (!playingRef.current) return;
    playingRef.current = false;
    setPlaying(false);
    lockScroll(false, 'game');
    items.current.forEach((b) => b.el?.remove());
    items.current = [];
    setEnded(true);
    sfx.swell();
  };

  return (
    <div className={`mg ${playing ? 'is-on' : ''} ${ended ? 'is-ended' : ''}`}>
      <div className="mg-hud">
        <p className="mg-score">
          {GAME.scoreBrain} <b>{brain}</b>
          <span aria-hidden="true"> · </span>
          {GAME.scoreYou} <b className="is-gold">{zainab}</b>
        </p>
        {playing && (
          <p className="mg-time">
            {left}
            <small>s</small>
          </p>
        )}
        <span className="mg-quip" key={quip}>
          {quip}
        </span>
      </div>

      <div className="mg-area" ref={area} data-nofx />

      {!playing && !ended && (
        <div className="mg-start">
          <MagneticButton onClick={start} sound="thump">
            {GAME.startButton}
          </MagneticButton>
          <p className="hint">{GAME.hint}</p>
          {onNext && (
            <MagneticButton variant="link" onClick={onNext} sound="soft">
              {GAME.skip}
            </MagneticButton>
          )}
        </div>
      )}

      {ended && (
        <div className="mg-end">
          <TextSequence lines={END} play onDone={() => setCta(true)} className="mg-lines" dimPast />
          <div className={`mg-cta ${cta ? 'is-in' : ''}`}>
            <MagneticButton onClick={onSong} sound="sparkle">
              {GAME.button}
            </MagneticButton>
            {onNext && (
              <MagneticButton variant="link" onClick={onNext} sound="soft">
                {GAME.next}
              </MagneticButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
