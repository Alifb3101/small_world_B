import React, { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { REDUCED } from '../lib/motion';
import { setTheme } from '../lib/theme';

const SceneCtx = createContext({ inView: false, id: '' });
export const useScene = () => useContext(SceneCtx);

/** Scroll-scrubbed "camera" moves as a scene enters and leaves the viewport. */
const CAMERAS = {
  rise: { from: { yPercent: 7, scale: 0.94, opacity: 0.2 }, exit: { scale: 1.05, opacity: 0.15 } },
  zoom: { from: { scale: 0.8, opacity: 0 }, exit: { scale: 1.12, opacity: 0 } },
  drift: { from: { xPercent: -5, scale: 0.97, opacity: 0.15 }, exit: { xPercent: 4, opacity: 0.2 } },
  fade: { from: { opacity: 0 }, exit: { opacity: 0 } },
};

export default function Scene({ id, theme, className = '', camera = 'rise', exit = true, label, children }) {
  const ref = useRef(null);
  const camRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        el.toggleAttribute('data-live', e.isIntersecting);
      },
      { rootMargin: '15% 0px 15% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useLayoutEffect(() => {
    const el = ref.current;
    const ctx = gsap.context(() => {
      if (theme) {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 45%',
          onToggle: (s) => s.isActive && setTheme(theme),
        });
      }
      const cam = CAMERAS[camera];
      if (REDUCED || !cam) return;
      gsap.fromTo(camRef.current, cam.from, {
        yPercent: 0,
        xPercent: 0,
        scale: 1,
        opacity: 1,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 20%', scrub: 0.6 },
      });
      if (exit) {
        gsap.fromTo(
          camRef.current,
          { yPercent: 0, xPercent: 0, scale: 1, opacity: 1 },
          {
            ...cam.exit,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: { trigger: el, start: 'bottom 65%', end: 'bottom top', scrub: 0.6 },
          },
        );
      }
    }, el);
    return () => ctx.revert();
  }, [theme, camera, exit]);

  return (
    <SceneCtx.Provider value={{ inView, id }}>
      <section id={id} ref={ref} data-scene={id} className={`scene ${className}`} aria-label={label}>
        <div className="scene__inner">
          <div className="scene__cam" ref={camRef}>
            {children}
          </div>
        </div>
      </section>
    </SceneCtx.Provider>
  );
}
