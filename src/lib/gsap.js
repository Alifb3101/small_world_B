import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });
// ScrollTrigger re-applies the scrollRestoration it saw at load on every refresh,
// so it has to be told "manual" itself or a reload lands back on the old slide.
ScrollTrigger.clearScrollMemory('manual');

if (import.meta.env.DEV) window.__gsap = { gsap, ScrollTrigger };

export { gsap, ScrollTrigger };
