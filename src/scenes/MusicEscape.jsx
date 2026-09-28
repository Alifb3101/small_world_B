import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Scene from '../components/Scene';
import MusicWorld from '../components/MusicWorld';
import AnimatedText from '../components/AnimatedText';
import MagneticButton from '../components/MagneticButton';
import ParallaxLayer from '../components/ParallaxLayer';
import { SONGS } from '../data/content';
import { gsap } from '../lib/gsap';
import { useStore, story } from '../lib/store';
import { audioState, playSong, stopSong, getLevel, sfx } from '../lib/audio';
import { goTo, lockScroll } from '../lib/director';
import { sky } from '../lib/sky';
import { REDUCED, buzz } from '../lib/motion';
import './MusicEscape.css';

const byId = (id) => SONGS.find((s) => s.id === id);
const MIN = 0.02;

/**
 * Circle geometry for the iris: a round window centred on the tapped portal,
 * big enough to cover the whole screen when scale = 1.
 */
function irisGeometry(x, y) {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const R = Math.ceil(Math.hypot(Math.max(x, W - x), Math.max(y, H - y))) + 4;
  return { W, H, R, x, y };
}

export default function MusicEscape() {
  const [world, setWorld] = useState(null);
  const [leaving, setLeaving] = useState(null);
  const [uiIn, setUiIn] = useState(false);
  const stage = useRef(null);
  const iris = useRef(null);
  const inner = useRef(null);
  const geo = useRef(null);
  const dirRef = useRef(1);
  const busy = useRef(false);
  const swipe = useRef(null);
  const pulseEls = useRef([]);
  const halo = useRef(null);
  const openTl = useRef(null);
  const irisS = useRef(1);
  const closing = useRef(false);
  const swapping = useRef(false);
  const pendingClose = useRef(false);
  const worldRef = useRef(world);
  worldRef.current = world;
  const { song, playing } = useStore(audioState);
  const isPlaying = !!world && song === world && playing;

  const applyIris = (s, zoom = 1) => {
    const g = geo.current;
    irisS.current = s;
    iris.current.style.transform = `translate3d(0,0,0) scale(${s})`;
    inner.current.style.transform = `translate3d(0,0,0) scale(${zoom / s})`;
    inner.current.style.transformOrigin = `${g.x}px ${g.y}px`;
  };

  const placeIris = () => {
    const g = geo.current;
    Object.assign(iris.current.style, {
      left: `${g.x - g.R}px`,
      top: `${g.y - g.R}px`,
      width: `${g.R * 2}px`,
      height: `${g.R * 2}px`,
    });
    Object.assign(inner.current.style, {
      left: `${g.R - g.x}px`,
      top: `${g.R - g.y}px`,
      width: `${g.W}px`,
      height: `${g.H}px`,
    });
  };

  // portal -> world: a round window grows out of the tapped portal.
  // Only transforms animate (outer scale s, inner scale 1/s), so the
  // world underneath never repaints during the reveal.
  useLayoutEffect(() => {
    if (!world || !geo.current || !busy.current || leaving) return;
    placeIris();
    const st = stage.current;
    st.classList.add('is-iris');
    const p = { s: MIN, z: 1.3 };
    applyIris(p.s, p.z);
    const tl = gsap.timeline({
      onComplete: () => {
        openTl.current = null;
        if (!iris.current) return;
        st.classList.remove('is-iris');
        iris.current.style.transform = '';
        inner.current.style.transform = '';
        irisS.current = 1;
        document.documentElement.classList.add('is-overlay');
      },
    });
    openTl.current = tl;
    tl.to(p, {
      s: 1,
      duration: REDUCED ? 0.3 : 1.25,
      ease: 'expo.inOut',
      onUpdate: () => applyIris(p.s, p.z),
    })
      .to(
        p,
        { z: 1, duration: REDUCED ? 0.3 : 1.7, ease: 'expo.out', onUpdate: () => applyIris(p.s, p.z) },
        0.15,
      )
      .call(() => (busy.current = false), null, REDUCED ? 0.3 : 1.25);
    const t = setTimeout(() => !closing.current && setUiIn(true), REDUCED ? 100 : 700);
    return () => {
      clearTimeout(t);
      if (openTl.current === tl) tl.progress(1);
      else tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [world]);

  // world -> world: the camera pans to the next world, a warm light leak sweeps across
  useLayoutEffect(() => {
    if (!leaving) return;
    const root = inner.current;
    const out = root.querySelector(`[data-world="${leaving}"]`);
    const inn = root.querySelector(`[data-world="${world}"]`);
    const leak = stage.current.querySelector('.me-leak');
    const d = dirRef.current;
    const dur = REDUCED ? 0.25 : 1.15;
    const tl = gsap.timeline({
      onComplete: () => {
        swapping.current = false;
        busy.current = false;
        setLeaving(null);
        if (pendingClose.current) close();
      },
    });
    tl.to(out, { xPercent: -38 * d, scale: 1.08, opacity: 0, duration: dur, ease: 'power3.inOut' }, 0)
      .fromTo(
        inn,
        { xPercent: 62 * d, scale: 1.16, opacity: 0 },
        { xPercent: 0, scale: 1, opacity: 1, duration: dur, ease: 'expo.inOut' },
        0,
      )
      .fromTo(
        leak,
        { xPercent: d > 0 ? 120 : -120, opacity: 0 },
        { xPercent: d > 0 ? -120 : 120, opacity: 1, duration: dur, ease: 'sine.inOut' },
        0,
      )
      .set(leak, { opacity: 0 });
    return () => tl.kill();
  }, [leaving, world]);

  // music makes the world breathe: only the sun/lamp/glow elements are touched
  useEffect(() => {
    if (!world) return;
    pulseEls.current = [...stage.current.querySelectorAll('[data-pulse]')];
  }, [world, leaving]);

  useEffect(() => {
    if (!isPlaying) {
      pulseEls.current.forEach((el) => (el.style.scale = ''));
      if (halo.current) halo.current.style.cssText = '';
      return;
    }
    let raf;
    let lvl = 0;
    let lastW = -1;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      lvl += (getLevel() - lvl) * 0.25;
      if (Math.abs(lvl - lastW) < 0.004) return;
      lastW = lvl;
      const s = (1 + lvl * 0.14).toFixed(3);
      for (const el of pulseEls.current) el.style.scale = s;
      if (halo.current) {
        halo.current.style.transform = `scale(${(1 + lvl * 0.9).toFixed(3)})`;
        halo.current.style.opacity = (0.35 + lvl * 0.65).toFixed(3);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isPlaying, world]);

  // the page underneath shouldn't move or render while a world is open
  useEffect(() => {
    if (!world) return;
    lockScroll(true, 'music');
    story.set({ overlay: true });
    sky.hold(true);
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') shift(1);
      else if (e.key === 'ArrowLeft') shift(-1);
    };
    const onResize = () => {
      if (busy.current || !geo.current) return;
      geo.current = irisGeometry(window.innerWidth / 2, window.innerHeight / 2);
      placeIris();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      document.documentElement.classList.remove('is-overlay');
      sky.hold(false);
      story.set({ overlay: false });
      lockScroll(false, 'music');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!world]);

  const open = (id, e) => {
    if (busy.current || world) return;
    const r = e.currentTarget.querySelector('.portal__win').getBoundingClientRect();
    geo.current = irisGeometry(r.left + r.width / 2, r.top + r.height / 2);
    busy.current = true;
    sfx.whoosh(1.3);
    buzz(10);
    setUiIn(false);
    setWorld(id);
    playSong(byId(id));
  };

  const shift = (dir) => {
    const from = worldRef.current;
    if (busy.current || closing.current || !from) return;
    busy.current = true;
    swapping.current = true;
    dirRef.current = dir;
    const i = SONGS.findIndex((s) => s.id === from);
    const next = SONGS[(i + dir + SONGS.length) % SONGS.length].id;
    sfx.whoosh(0.9);
    buzz(6);
    setLeaving(from);
    setWorld(next);
    playSong(byId(next));
  };

  // leaving works at any moment: mid-reveal it reverses from where the iris is,
  // mid-swap it waits for the camera to land
  const close = () => {
    if (!worldRef.current || closing.current) return;
    if (swapping.current) {
      pendingClose.current = true;
      return;
    }
    if (openTl.current) {
      openTl.current.kill();
      openTl.current = null;
    }
    pendingClose.current = false;
    closing.current = true;
    busy.current = true;
    sfx.suck();
    setUiIn(false);
    document.documentElement.classList.remove('is-overlay');
    sky.hold(false);
    const st = stage.current;
    st.classList.add('is-iris');
    const p = { s: irisS.current };
    applyIris(p.s, 1);
    gsap.to(p, {
      s: MIN,
      duration: (REDUCED ? 0.25 : 0.95) * Math.max(0.4, p.s),
      ease: 'expo.inOut',
      onUpdate: () => applyIris(p.s, 1 + (1 - p.s) * 0.15),
      onComplete: () => {
        closing.current = false;
        busy.current = false;
        setLeaving(null);
        setWorld(null);
      },
    });
  };

  const togglePlay = () => {
    if (isPlaying) stopSong();
    else playSong(byId(worldRef.current));
  };

  const onDown = (e) => {
    swipe.current = { x: e.clientX, y: e.clientY, t: performance.now() };
  };
  const onUp = (e) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3 && performance.now() - s.t < 800) shift(dx < 0 ? 1 : -1);
  };

  const current = byId(world);

  return (
    <Scene id="music" theme="music" camera="rise" className="music" label="Pick your little escape">
      <div className="me">
        <header className="me-head">
          <span className="eyebrow">escape · four little worlds</span>
          <h2 className="h-serif me-title">
            Pick your <em>little escape</em> <span className="me-hp">🎧</span>
          </h2>
          <p className="hint">each one is a whole world. headphones help.</p>
        </header>

        <ParallaxLayer depth={0.12} className="me-portals">
          {SONGS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={`portal portal--${s.id} ${song === s.id ? 'is-playing' : ''}`}
              style={{ '--i': i }}
              onClick={(e) => open(s.id, e)}
              data-nofx
            >
              <span className="portal__win">
                <span className="portal__scene" />
                <span className="portal__glint" />
              </span>
              <span className="portal__title">{s.title}</span>
              <span className="portal__mood">{s.mood}</span>
            </button>
          ))}
        </ParallaxLayer>

        <div className="me-foot">
          <MagneticButton variant="link" onClick={() => goTo('tomjerry', 'cartoon')}>
            okay, now something silly →
          </MagneticButton>
        </div>
      </div>

      {world &&
        createPortal(
          <div
            className="me-stage"
            ref={stage}
            onPointerDown={onDown}
            onPointerUp={onUp}
            onPointerCancel={() => (swipe.current = null)}
            role="dialog"
            aria-label={`${current.title}, a little world`}
          >
            <div className="me-iris" ref={iris}>
              <div className="me-inner" ref={inner}>
                {[leaving, world].filter(Boolean).map((id) => (
                  <div key={id} className="mw-layer" data-world={id}>
                    <MusicWorld id={id} />
                  </div>
                ))}
                <span className="me-leak" aria-hidden="true" />
              </div>
            </div>

            <div className={`me-ui ${uiIn ? 'is-in' : ''}`}>
              <div className="me-now" key={world}>
                <span className="eyebrow">{isPlaying ? 'now playing' : 'paused'}</span>
                <AnimatedText as="h3" text={current.title} className="me-song h-serif" stagger={0.03} play={uiIn} />
                <AnimatedText
                  as="p"
                  text={current.line}
                  split="words"
                  variant="soft"
                  delay={0.35}
                  className="me-line"
                  play={uiIn}
                />
              </div>
              <div className="me-bottom" data-nofx>
                <div className="me-dots" aria-hidden="true">
                  {SONGS.map((s) => (
                    <i key={s.id} className={s.id === world ? 'is-on' : ''} />
                  ))}
                </div>
                <div className="me-controls">
                  <button type="button" className="me-ctl" onClick={() => shift(-1)} aria-label="Previous world">
                    ‹
                  </button>
                  <button
                    type="button"
                    className={`me-ctl me-ctl--play ${isPlaying ? 'is-on' : ''}`}
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    <span className="me-ctl__halo" ref={halo} />
                    <span className="me-play-icon" />
                  </button>
                  <button type="button" className="me-ctl" onClick={() => shift(1)} aria-label="Next world">
                    ›
                  </button>
                </div>
                <button type="button" className="me-close" onClick={close}>
                  leave this world
                </button>
                <p className="me-swipe hint">swipe for another world</p>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </Scene>
  );
}
