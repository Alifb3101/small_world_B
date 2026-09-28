import React, { useLayoutEffect, useRef } from 'react';
import { ScrollTrigger } from '../lib/gsap';
import { useStore, story } from '../lib/store';

/** A thin thread of light on the edge — how far into the story we are. */
export default function StoryThread() {
  const ref = useRef(null);
  const { entered } = useStore(story);

  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (s) => ref.current?.style.setProperty('--p', s.progress.toFixed(4)),
    });
    return () => st.kill();
  }, []);

  return (
    <div className={`thread ${entered ? 'is-in' : ''}`} ref={ref} aria-hidden="true">
      <span className="thread__fill" />
      <i className="thread__head" />
    </div>
  );
}
