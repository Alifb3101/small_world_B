import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Scene from '../components/Scene';
import MusicWorld from '../components/MusicWorld';
import AnimatedText from '../components/AnimatedText';
import MagneticButton from '../components/MagneticButton';
import { MOODS, PLAYLIST, MUSIC } from '../data/content';
import { gsap } from '../lib/gsap';
import { useStore, story } from '../lib/store';
import { audioState, playSong, stopSong, getLevel, sfx } from '../lib/audio';
import { goTo, lockScroll } from '../lib/director';
import { sky } from '../lib/sky';
import { REDUCED, buzz } from '../lib/motion';
import './MusicEscape.css';

const MIN = 0.02;
const pickOne = (list) => list[Math.floor(Math.random() * list.length)];

const WORLDS = ['train', 'city', 'sky', 'room'];

/** Songs from the surprise list may not have a world — lend them a random one. */
function withWorld(t) {
  if (t.world) return t;
  return { ...t, world: pickOne(WORLDS) };
}

/** Prev / next walk the same row of circles. */
const queueOf = () => MOODS;

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
  const [track, setTrack] = useState(null);
  const [leaving, setLeaving] = useState(null);
  const [uiIn, setUiIn] = useState(false);
  const [scrollEnds, setScrollEnds] = useState({ start: true, end: false });
  const scroller = useRef(null);
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
  const trackRef = useRef(track);
  trackRef.current = track;
  const { song, playing, loading } = useStore(audioState);
  const isPlaying = !!track && song === track.id && playing;
  const isLoading = isPlaying && loading;

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

  // the iris grows out of `rect` (the tapped portal window or button)
  const open = (t, rect) => {
    if (busy.current || world) return;
    geo.current = irisGeometry(rect.left + rect.width / 2, rect.top + rect.height / 2);
    busy.current = true;
    sfx.whoosh(1.3);
    buzz(10);
    setUiIn(false);
    setWorld(t.world);
    setTrack(t);
    playSong(t);
  };

  // play another track from inside a world; the camera only pans if its world differs
  const go = (t, dir = 1) => {
    const from = worldRef.current;
    if (busy.current || closing.current || !from) return;
    buzz(6);
    setTrack(t);
    playSong(t);
    if (t.world === from) return;
    busy.current = true;
    swapping.current = true;
    dirRef.current = dir;
    sfx.whoosh(0.9);
    setLeaving(from);
    setWorld(t.world);
  };

  const shift = (dir) => {
    const q = queueOf(trackRef.current);
    const i = q.findIndex((s) => s.id === trackRef.current?.id);
    go(q[(i + dir + q.length) % q.length], dir);
  };

  const pickSurprise = () => withWorld(pickOne(PLAYLIST.filter((s) => s.id !== trackRef.current?.id)));

  const surprise = () => {
    sfx.sparkle();
    go(pickSurprise(), 1);
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
        setTrack(null);
      },
    });
  };

  const togglePlay = () => {
    if (isPlaying) stopSong();
    else playSong(trackRef.current);
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

  const scrollStep = () => {
    const el = scroller.current;
    const card = el?.querySelector('.portal');
    if (!el || !card) return 220;
    const gap = parseFloat(getComputedStyle(el.querySelector('.me-portals')).columnGap) || 22;
    return card.getBoundingClientRect().width + gap;
  };

  const nudgeRow = (dir, smooth) => {
    const el = scroller.current;
    if (!el) return;
    const left = el.scrollLeft + dir * scrollStep();
    if (smooth) el.scrollTo({ left, behavior: 'smooth' });
    else el.scrollLeft = left;
  };

  // Hold an arrow and the row keeps stepping until you let go.
  const holdArrow = (dir) => (e) => {
    if (e.button != null && e.button !== 0) return;
    e.preventDefault();
    nudgeRow(dir, true);
    let pulse = 0;
    const wait = setTimeout(() => {
      pulse = setInterval(() => nudgeRow(dir, false), 160);
    }, 340);
    const stop = () => {
      clearTimeout(wait);
      clearInterval(pulse);
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
    };
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
  };

  // Wheel, trackpad, and a held drag all move the row by the same distance as the gesture.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    let drag = null;

    const syncEnds = () => {
      const max = el.scrollWidth - el.clientWidth;
      setScrollEnds({ start: el.scrollLeft <= 2, end: max <= 2 || el.scrollLeft >= max - 2 });
    };

    const onWheel = (e) => {
      if (el.scrollWidth <= el.clientWidth + 2) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    };

    const onDown = (e) => {
      if (e.button !== 0 || e.pointerType === 'touch') return;
      if (e.target.closest('.me-arrow')) return;
      drag = { x: e.clientX, left: el.scrollLeft, moved: false, pid: e.pointerId };
    };
    const onMove = (e) => {
      if (!drag || e.pointerId !== drag.pid) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) < 8) return;
      if (!drag.moved) {
        drag.moved = true;
        el.classList.add('is-dragging');
      }
      el.scrollLeft = drag.left - dx;
    };
    const onUp = (e) => {
      if (!drag || e.pointerId !== drag.pid) return;
      const moved = drag.moved;
      drag = null;
      el.classList.remove('is-dragging');
      if (!moved) return;
      const killClick = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        el.removeEventListener('click', killClick, true);
      };
      el.addEventListener('click', killClick, true);
    };

    syncEnds();
    el.addEventListener('scroll', syncEnds, { passive: true });
    window.addEventListener('resize', syncEnds);
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      el.removeEventListener('scroll', syncEnds);
      window.removeEventListener('resize', syncEnds);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, []);

  const current = track;

  return (
    <Scene id="music" theme="music" camera="rise" className="music" label="Pick your little escape">
      <div className="me">
        <header className="me-head">
          <span className="eyebrow">{MUSIC.corner}</span>
          <h2 className="h-serif me-title">
            {MUSIC.title} <em>{MUSIC.titleFancy}</em> <span className="me-hp">🎧</span>
          </h2>
          <p className="hint">{MUSIC.hint}</p>
        </header>

        <div className="me-row">
          <button
            type="button"
            className="me-arrow me-arrow--prev"
            aria-label="Scroll songs back"
            disabled={scrollEnds.start}
            onPointerDown={holdArrow(-1)}
            data-nofx
          />
          <div className="me-scroll" ref={scroller}>
            <div className="me-portals">
              {MOODS.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  className={`portal portal--${s.world} ${song === s.id ? 'is-playing' : ''}`}
                  style={{ '--i': i }}
                  onClick={(e) => open(s, e.currentTarget.querySelector('.portal__win').getBoundingClientRect())}
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
            </div>
          </div>
          <button
            type="button"
            className="me-arrow me-arrow--next"
            aria-label="Scroll songs forward"
            disabled={scrollEnds.end}
            onPointerDown={holdArrow(1)}
            data-nofx
          />
        </div>

        <div className="me-foot">
          <MagneticButton
            variant="ghost"
            sound="sparkle"
            onClick={(e) => open(pickSurprise(), e.currentTarget.getBoundingClientRect())}
          >
            {MUSIC.surpriseButton}
          </MagneticButton>
          <MagneticButton variant="link" onClick={() => goTo('tomjerry', 'cartoon')}>
            {MUSIC.next}
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
              <div className="me-now" key={track.id}>
                <span className="eyebrow">
                  {isLoading ? MUSIC.loading : isPlaying ? MUSIC.nowPlaying : MUSIC.paused}
                </span>
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
                  {queueOf(track).map((s) => (
                    <i key={s.id} className={s.id === track.id ? 'is-on' : ''} />
                  ))}
                </div>
                <div className="me-controls">
                  <button type="button" className="me-ctl" onClick={() => shift(-1)} aria-label="Previous song">
                    ‹
                  </button>
                  <button
                    type="button"
                    className={`me-ctl me-ctl--play ${isPlaying ? 'is-on' : ''} ${isLoading ? 'is-loading' : ''}`}
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    <span className="me-ctl__halo" ref={halo} />
                    <span className="me-play-icon" />
                  </button>
                  <button type="button" className="me-ctl" onClick={() => shift(1)} aria-label="Next song">
                    ›
                  </button>
                </div>
                <button type="button" className="me-surprise" onClick={surprise}>
                  {MUSIC.surpriseButton}
                </button>
                <button type="button" className="me-close" onClick={close}>
                  {MUSIC.leave}
                </button>
                <p className="me-swipe hint">{MUSIC.swipeHint}</p>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </Scene>
  );
}
