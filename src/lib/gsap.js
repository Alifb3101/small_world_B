import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

if (import.meta.env.DEV) window.__gsap = { gsap, ScrollTrigger };

export { gsap, ScrollTrigger };
