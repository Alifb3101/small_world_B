import React, { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { registerTransition, currentSceneEl } from '../lib/director';
import { sky } from '../lib/sky';
import { fx } from '../lib/fx';
import { sfx } from '../lib/audio';
import { charSrc } from './Character';
import './SceneTransition.css';

const CLEAR = { clearProps: 'transform,opacity,filter' };
const innerOf = (el) => el?.querySelector(':scope > .scene__inner');

export default function SceneTransition() {
  const root = useRef(null);

  useEffect(() => {
    ['jerry-dash', 'tom-sneak', 'tom-shocked'].forEach((n) => {
      const i = new Image();
      i.src = charSrc(n);
    });

    const run = (type, id, jump) => {
      const r = root.current;
      const q = (s) => r.querySelector(s);
      const fromEl = innerOf(currentSceneEl());
      const fromInner = fromEl || r;
      const toInner = () => innerOf(document.getElementById(id));
      const tl = gsap.timeline({ paused: true });
      const W = window.innerWidth;
      r.classList.add('is-on');
      r.dataset.type = type;

      const swap = (setTo) =>
        tl.call(() => {
          jump();
          if (fromInner instanceof Element) gsap.set(fromInner, CLEAR);
          const t = toInner();
          if (t && setTo) gsap.set(t, setTo);
        });

      const settle = (vars, pos) => {
        tl.add(() => {
          const t = toInner();
          if (t) gsap.to(t, { ...vars, ...CLEAR });
        }, pos);
      };

      if (type === 'tunnel') {
        sfx.warp();
        sky.warpTo(1);
        tl.to(fromInner, { scale: 2.6, opacity: 0, duration: 1.35, ease: 'power2.in' })
          .to(q('.tx-flash'), { opacity: 1, duration: 0.45, ease: 'power1.in' }, 0.95);
        swap({ scale: 0.5, opacity: 0 });
        tl.call(() => sky.warpTo(0))
          .to(q('.tx-flash'), { opacity: 0, duration: 1.3, ease: 'power2.out' });
        settle({ scale: 1, opacity: 1, duration: 1.8, ease: 'expo.out' }, '-=1.2');
        tl.to(r, { duration: 0.35 });
      } else if (type === 'collapse') {
        sfx.suck();
        sky.pullTo(1, 0.05);
        tl.to(fromInner, { scale: 0.15, opacity: 0, rotate: 8, duration: 1.1, ease: 'power3.in' })
          .to(q('.tx-dark'), { opacity: 1, duration: 0.6 }, 0.55)
          .fromTo(q('.tx-core'), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35 }, 0.85);
        swap({ scale: 1.3, opacity: 0 });
        tl.call(() => {
          sky.pullTo(0, 0.1);
          sfx.bloom();
        })
          .to(q('.tx-core'), { scale: 40, opacity: 0, duration: 1, ease: 'expo.out' })
          .to(q('.tx-dark'), { opacity: 0, duration: 1.1, ease: 'sine.out' }, '<');
        settle({ scale: 1, opacity: 1, rotate: 0, duration: 1.5, ease: 'expo.out' }, '<');
      } else if (type === 'cartoon') {
        const wipe = q('.tx-wipe');
        const jerry = q('.tx-jerry');
        const tom = q('.tx-tom');
        const tomImg = tom.querySelector('img');
        const tw = Math.min(190, W * 0.42);
        gsap.set([jerry, tom], { opacity: 1, width: tw });
        gsap.set(jerry, { width: tw * 0.62 });
        tomImg.src = charSrc('tom-sneak');
        gsap.set(tom.querySelector('.tx-flip'), { scaleX: -1 });
        gsap.set(jerry.querySelector('.tx-flip'), { scaleX: 1 });
        sfx.squeak();
        tl.fromTo(wipe, { x: -W * 1.45 }, { x: 0, duration: 1.05, ease: 'power1.in' }, 0)
          .fromTo(tom, { x: -tw * 1.1 }, { x: W + tw * 0.2, duration: 1.05, ease: 'power1.in' }, 0)
          .fromTo(jerry, { x: -tw * 0.4 }, { x: W * 1.35, duration: 1.05, ease: 'power1.in' }, 0)
          .call(() => sfx.whoosh(0.8), null, 0.2)
          .call(() => sfx.thud(), null, 1.0);
        swap(null);
        tl.call(() => {
          tomImg.src = charSrc('tom-shocked');
          gsap.set(tom.querySelector('.tx-flip'), { scaleX: 1 });
          gsap.set(jerry.querySelector('.tx-flip'), { scaleX: -1 });
          sfx.squeak();
        })
          .to(r, { duration: 0.15 })
          .fromTo(wipe, { x: 0 }, { x: -W * 1.5, duration: 1.1, ease: 'power2.inOut' })
          .fromTo(tom, { x: W * 0.95 - tw }, { x: -tw * 1.6, duration: 1.1, ease: 'power2.inOut' }, '<')
          .fromTo(jerry, { x: W * 1.15 }, { x: -tw * 0.5, duration: 1.25, ease: 'power2.inOut' }, '<0.05')
          .call(() => sfx.whoosh(0.7), null, '<');
      } else if (type === 'paper') {
        const paper = q('.tx-paper');
        sfx.paper();
        gsap.set(paper, { rotationX: -100, rotationY: 0, transformOrigin: '50% 0%', opacity: 1 });
        tl.to(fromInner, { scale: 0.95, opacity: 0.5, duration: 0.9, ease: 'power2.in' }, 0)
          .to(paper, { rotationX: 0, duration: 0.95, ease: 'power3.in' }, 0)
          .fromTo(q('.tx-paper__shade'), { opacity: 0.6 }, { opacity: 0, duration: 0.95, ease: 'power3.in' }, 0)
          .call(() => sfx.thud(), null, 0.9)
          .to(r, { duration: 0.35 });
        swap(null);
        tl.call(() => {
          gsap.set(paper, { transformOrigin: '0% 50%' });
          sfx.paper();
        })
          .to(paper, { rotationY: -105, duration: 1.15, ease: 'power2.inOut' })
          .fromTo(q('.tx-paper__curl'), { opacity: 0 }, { opacity: 0.7, duration: 1.15, ease: 'power2.in' }, '<')
          .set(paper, { opacity: 0 });
      } else if (type === 'dream') {
        sfx.swell();
        tl.to(q('.tx-haze'), { opacity: 0.75, duration: 0.8, ease: 'sine.in' }, 0).to(
          fromInner,
          { scale: 1.07, opacity: 0.1, filter: 'blur(12px)', duration: 0.8, ease: 'sine.in' },
          0,
        );
        swap({ scale: 1.1, opacity: 0.3, filter: 'blur(12px)' });
        tl.to(r, { duration: 0.1 });
        settle({ scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.4, ease: 'power2.out' });
        tl.to(q('.tx-haze'), { opacity: 0, duration: 1.4, ease: 'sine.out' });
      } else if (type === 'night') {
        sfx.swell();
        fx.embers(window.innerWidth > 700 ? 130 : 80);
        sky.calmTo(0.6);
        tl.to(fromInner, { opacity: 0, duration: 1.5, ease: 'sine.inOut' }, 0)
          .to(q('.tx-dark'), { opacity: 0.9, duration: 1.3, ease: 'sine.in' }, 0.3)
          .to(r, { duration: 0.4 });
        swap({ opacity: 0 });
        tl.to(q('.tx-dark'), { opacity: 0, duration: 2, ease: 'sine.out' }, '+=0.3');
        settle({ opacity: 1, duration: 2.4, ease: 'sine.out' }, '<');
      } else {
        tl.to(q('.tx-dark'), { opacity: 1, duration: 0.35 });
        swap(null);
        tl.to(q('.tx-dark'), { opacity: 0, duration: 0.5 });
      }

      return new Promise((resolve) => {
        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          clearTimeout(safety);
          r.classList.remove('is-on');
          gsap.set(r.querySelectorAll('.tx-layer'), { clearProps: 'all' });
          resolve();
        };
        const safety = setTimeout(() => {
          jump();
          finish();
        }, 4200);
        tl.eventCallback('onComplete', finish);
        tl.play();
      });
    };

    return registerTransition(run);
  }, []);

  return (
    <div className="tx" ref={root} aria-hidden="true">
      <div className="tx-layer tx-dark" />
      <div className="tx-layer tx-flash" />
      <div className="tx-layer tx-core" />
      <div className="tx-layer tx-haze" />
      <div className="tx-layer tx-wipe">
        <svg className="tx-wipe__edge" viewBox="0 0 40 100" preserveAspectRatio="none">
          <path d="M0 0 H18 Q36 8 22 16 T26 32 Q40 42 24 50 T28 68 Q38 78 22 86 T20 100 H0 Z" />
        </svg>
      </div>
      <div className="tx-layer tx-runner tx-tom">
        <div className="tx-flip">
          <img src={charSrc('tom-sneak')} alt="" draggable="false" />
        </div>
        <span className="tx-dust" />
      </div>
      <div className="tx-layer tx-runner tx-jerry">
        <div className="tx-flip">
          <img src={charSrc('jerry-dash')} alt="" draggable="false" />
        </div>
      </div>
      <div className="tx-persp">
        <div className="tx-layer tx-paper">
          <span className="tx-paper__note">some things are better on paper.</span>
          <span className="tx-paper__shade" />
          <span className="tx-paper__curl" />
        </div>
      </div>
    </div>
  );
}
