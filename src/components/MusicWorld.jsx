import React, { memo, useMemo } from 'react';
import Character from './Character';
import { MUSIC } from '../data/content';
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
      <span className="ct-neon ct-neon--1">{MUSIC.citySigns[0]}</span>
      <span className="ct-neon ct-neon--2">{MUSIC.citySigns[1]}</span>
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
      <Character name="together-lazy-2" className="rm-chars" idle="breathe" shadow={false} eager />
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

function NeverEnding() {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      console.log('NeverEnding useEffect: canvas mounted, starting animation');
      const ctx = canvas.getContext('2d', { alpha: false });
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    let w, h, raf, t = 0;
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const maxParticles = prefersReduced ? 20 : (isMobile ? 120 : 250);

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };

    // Stars (3 layers, parallax)
    const stars = Array.from({ length: prefersReduced ? 40 : 180 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: 0.4 + Math.random() * 1.8,
      o: 0.2 + Math.random() * 0.8,
      layer: Math.floor(Math.random() * 3),
      phase: Math.random() * Math.PI * 2,
    }));

    // Comets / shooting stars
    const comets = [];
    let cometTimer = 0;

    // Orb positions
    const leftOrb = { x: 25, y: 45 };
    const rightOrb = { x: 75, y: 45 };

    // Signal particles
    const signalParticles = [];
    let signalPhase = 0;
    let burstActive = false;
    let burstSize = 0;

    // Magic particles (pages, hearts, petals, lanterns, fireflies, dust)
    const magicParticles = [];

    // Emotion cycle (16s)
    const getEmotion = (t) => {
      const cycle = (t / 16) % 1;
      if (cycle < 0.15) return { phase: 'calm', intensity: 0.2 + cycle * 1.3 }; // lonely
      if (cycle < 0.25) return { phase: 'flicker', intensity: 0.4 + (cycle - 0.15) * 4 }; // signal flickers on
      if (cycle < 0.5) return { phase: 'build', intensity: 0.8 + (cycle - 0.25) * 0.8 }; // speed up
      if (cycle < 0.55) return { phase: 'burst', intensity: 1.5 }; // BIG BURST
      if (cycle < 0.75) return { phase: 'afterglow', intensity: 1.0 - (cycle - 0.55) * 2 }; // warm glow fading
      return { phase: 'calm', intensity: 0.2 };
    };

    const spawnMagic = (x, y, count, emotion) => {
      if (magicParticles.length >= maxParticles) return;
      
      for (let i = 0; i < count; i++) {
        const type = ['page', 'heart', 'petal', 'lantern', 'firefly', 'dust'][Math.floor(Math.random() * 6)];
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.3 + Math.random() * (emotion.phase === 'burst' ? 2.5 : 1);
        
        magicParticles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          size: type === 'page' ? 4 + Math.random() * 6 : (type === 'heart' || type === 'lantern' ? 3 + Math.random() * 4 : 1.5 + Math.random() * 2),
          life: 0,
          type,
          rot: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.08,
          phase: Math.random() * Math.PI * 2,
          spiral: Math.random() * Math.PI * 2,
        });
      }
    };

    const drawGlow = (x, y, size, color, alpha = 1) => {
      const grad = ctx.createRadialGradient(x, y, 0, x, y, size);
      grad.addColorStop(0, color.replace(')', `,${alpha})`).replace('rgb', 'rgba'));
      grad.addColorStop(0.4, color.replace(')', `,${alpha * 0.5})`).replace('rgb', 'rgba'));
      grad.addColorStop(1, color.replace(')', ',0)').replace('rgb', 'rgba'));
      ctx.fillStyle = grad;
      ctx.fillRect(x - size, y - size, size * 2, size * 2);
    };

    const loop = () => {
      if (!canvas || document.hidden) {
        raf = requestAnimationFrame(loop);
        return;
      }

      t += 0.016;
      const emotion = prefersReduced ? { phase: 'calm', intensity: 0.4 } : getEmotion(t);
      
      // Background gradient (shifting hue)
      const hueShift = Math.sin(t * 0.1) * 15;
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, `hsl(${240 + hueShift}, 60%, 15%)`); // deep indigo
      grad.addColorStop(0.5, `hsl(${290 + hueShift}, 50%, 25%)`); // magenta
      grad.addColorStop(1, `hsl(${30 + hueShift}, 70%, 35%)`); // warm orange
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Aurora ribbons
      if (!prefersReduced) {
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 3; i++) {
          const y = h * (0.2 + i * 0.15) + Math.sin(t * 0.3 + i) * h * 0.08;
          const auroraGrad = ctx.createLinearGradient(0, y - 60, 0, y + 60);
          auroraGrad.addColorStop(0, 'rgba(100,180,255,0)');
          auroraGrad.addColorStop(0.5, `rgba(150,100,255,${0.08 * emotion.intensity})`);
          auroraGrad.addColorStop(1, 'rgba(255,100,180,0)');
          ctx.fillStyle = auroraGrad;
          ctx.fillRect(0, y - 60, w, 120);
        }
        ctx.globalCompositeOperation = 'source-over';
      }

      // Stars with parallax and twinkle
      stars.forEach((s) => {
        const drift = (s.layer + 1) * 0.05;
        const x = ((s.x + t * drift) % 100) * w / 100;
        const y = s.y * h / 100;
        const twinkle = Math.sin(t * (1 + s.layer * 0.3) + s.phase) * 0.4 + 0.6;
        ctx.fillStyle = `rgba(255,255,255,${s.o * twinkle})`;
        ctx.beginPath();
        ctx.arc(x, y, s.s * 0.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Comets
      cometTimer++;
      if (!prefersReduced && cometTimer > 90 && Math.random() < 0.015) {
        comets.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.3,
          vx: 2 + Math.random() * 3,
          vy: 1.5 + Math.random() * 2,
          life: 0,
          trail: [],
        });
        cometTimer = 0;
      }

      comets.forEach((c, i) => {
        c.x += c.vx;
        c.y += c.vy;
        c.life += 0.02;
        c.trail.push({ x: c.x, y: c.y });
        if (c.trail.length > 20) c.trail.shift();
        
        if (c.life > 1 || c.x > w + 50 || c.y > h + 50) {
          comets.splice(i, 1);
          return;
        }

        const alpha = 1 - c.life;
        ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.8})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        c.trail.forEach((p, j) => {
          const a = alpha * (j / c.trail.length);
          if (j === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();

        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Hill horizon line
      ctx.fillStyle = '#0a0510';
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 20) {
        const hillY = h * 0.82 + Math.sin(x * 0.01) * 10;
        ctx.lineTo(x, hillY);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();

      // Orbs with pulsing halos and rays
      const orbPulse = 1 + Math.sin(t * 2) * 0.15 * emotion.intensity;
      const orbSize = Math.min(w, h) * 0.06 * orbPulse;

      const leftX = leftOrb.x * w / 100;
      const leftY = leftOrb.y * h / 100;
      const rightX = rightOrb.x * w / 100;
      const rightY = rightOrb.y * h / 100;

      // Left orb (warm gold)
      ctx.globalCompositeOperation = 'lighter';
      drawGlow(leftX, leftY, orbSize * 3, 'rgb(255,200,100)', emotion.intensity * 0.3);
      drawGlow(leftX, leftY, orbSize * 1.5, 'rgb(255,220,150)', emotion.intensity * 0.6);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#ffd080';
      ctx.beginPath();
      ctx.arc(leftX, leftY, orbSize * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Rays from left
      if (!prefersReduced) {
        for (let i = 0; i < 8; i++) {
          const angle = (t * 0.5 + i * Math.PI / 4);
          const rayLen = orbSize * 2.5;
          ctx.strokeStyle = `rgba(255,220,150,${0.15 * emotion.intensity})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(leftX, leftY);
          ctx.lineTo(leftX + Math.cos(angle) * rayLen, leftY + Math.sin(angle) * rayLen);
          ctx.stroke();
        }
      }

      // Right orb (cool pink-blue)
      ctx.globalCompositeOperation = 'lighter';
      drawGlow(rightX, rightY, orbSize * 3, 'rgb(180,140,255)', emotion.intensity * 0.3);
      drawGlow(rightX, rightY, orbSize * 1.5, 'rgb(220,180,255)', emotion.intensity * 0.6);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#c8b0ff';
      ctx.beginPath();
      ctx.arc(rightX, rightY, orbSize * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Rays from right
      if (!prefersReduced) {
        for (let i = 0; i < 8; i++) {
          const angle = (-t * 0.5 + i * Math.PI / 4);
          const rayLen = orbSize * 2.5;
          ctx.strokeStyle = `rgba(220,180,255,${0.15 * emotion.intensity})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(rightX, rightY);
          ctx.lineTo(rightX + Math.cos(angle) * rayLen, rightY + Math.sin(angle) * rayLen);
          ctx.stroke();
        }
      }

      // Small antenna towers at bottom
      const towerH = h * 0.08;
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(leftX, h * 0.82);
      ctx.lineTo(leftX, h * 0.82 - towerH);
      ctx.moveTo(rightX, h * 0.82);
      ctx.lineTo(rightX, h * 0.82 - towerH);
      ctx.stroke();

      // Signal ribbon (thick glowing curve)
      signalPhase += 0.015 * emotion.intensity;
      const midX = (leftX + rightX) / 2;
      const midY = (leftY + rightY) / 2 - h * 0.08;

      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = `rgba(150,220,255,${0.4 + emotion.intensity * 0.3})`;
      ctx.lineWidth = 3 + emotion.intensity * 2;
      ctx.beginPath();
      ctx.moveTo(leftX, leftY);
      ctx.quadraticCurveTo(midX, midY, rightX, rightY);
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';

      // Signal pulses (call and answer)
      if (emotion.phase !== 'calm' && Math.random() < 0.04 * emotion.intensity) {
        signalParticles.push({
          progress: 0,
          dir: Math.random() > 0.5 ? 1 : -1,
          size: 2 + Math.random() * 3,
          speed: 0.008 + Math.random() * 0.01,
        });
      }

      let meetingThisFrame = false;

      signalParticles.forEach((p, i) => {
        p.progress += p.speed * emotion.intensity;
        if (p.progress > 1) {
          signalParticles.splice(i, 1);
          return;
        }
        
        const prog = p.dir > 0 ? p.progress : 1 - p.progress;
        const qx = leftX + (midX - leftX) * 2 * prog;
        const qy = leftY + (midY - leftY) * 2 * prog;
        const sx = prog < 0.5 ? qx : (midX + (rightX - midX) * 2 * (prog - 0.5));
        const sy = prog < 0.5 ? qy : (midY + (rightY - midY) * 2 * (prog - 0.5));
        
        const alpha = 1 - Math.abs(p.progress - 0.5) * 1.5;
        if (alpha > 0) {
          ctx.globalCompositeOperation = 'lighter';
          drawGlow(sx, sy, p.size * 6, 'rgb(100,220,255)', alpha * 0.6);
          ctx.globalCompositeOperation = 'source-over';
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.beginPath();
          ctx.arc(sx, sy, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Meeting burst
        if (p.progress > 0.48 && p.progress < 0.52 && !p.met) {
          p.met = true;
          meetingThisFrame = true;
          burstActive = true;
          burstSize = 0;
          spawnMagic(midX, midY, emotion.phase === 'burst' ? 30 : 15, emotion);
        }
      });

      // Burst explosion with rings and heart flare
      if (burstActive) {
        burstSize += 2;
        const burstAlpha = Math.max(0, 1 - burstSize / 60);
        
        if (burstAlpha > 0) {
          ctx.globalCompositeOperation = 'lighter';
          
          // Expanding rings
          for (let i = 0; i < 3; i++) {
            const ringSize = burstSize * (1 + i * 0.3);
            ctx.strokeStyle = `rgba(255,200,255,${burstAlpha * 0.4})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(midX, midY, ringSize, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Heart flare
          ctx.fillStyle = `rgba(255,100,150,${burstAlpha * 0.6})`;
          ctx.beginPath();
          const hs = burstSize * 0.6;
          ctx.moveTo(midX, midY + hs * 0.3);
          ctx.bezierCurveTo(midX, midY - hs * 0.2, midX - hs * 0.5, midY - hs * 0.4, midX - hs * 0.5, midY);
          ctx.bezierCurveTo(midX - hs * 0.5, midY + hs * 0.3, midX, midY + hs * 0.7, midX, midY + hs);
          ctx.bezierCurveTo(midX, midY + hs * 0.7, midX + hs * 0.5, midY + hs * 0.3, midX + hs * 0.5, midY);
          ctx.bezierCurveTo(midX + hs * 0.5, midY - hs * 0.4, midX, midY - hs * 0.2, midX, midY + hs * 0.3);
          ctx.fill();

          ctx.globalCompositeOperation = 'source-over';
        } else {
          burstActive = false;
        }
      }

      // Magic particles
      if (emotion.phase !== 'calm' && magicParticles.length < maxParticles && Math.random() < 0.05 * emotion.intensity) {
        spawnMagic(midX + (Math.random() - 0.5) * w * 0.15, midY + (Math.random() - 0.5) * h * 0.1, 1, emotion);
      }

      // Clear zones for text (reduce particles near top-left and bottom-center)
      const inClearZone = (x, y) => {
        return (x < w * 0.3 && y < h * 0.2) || (x > w * 0.3 && x < w * 0.7 && y > h * 0.75);
      };

      magicParticles.forEach((p, i) => {
        p.spiral += 0.02;
        p.vx += Math.cos(p.spiral) * 0.03;
        p.vy += Math.sin(p.spiral) * 0.02 - 0.015; // drift up
        p.x += p.vx;
        p.y += p.vy;
        p.life += 0.008;
        p.rot += p.rotSpeed;
        p.phase += 0.05;
        
        if (p.life > 1 || p.y < -20 || p.x < -20 || p.x > w + 20) {
          magicParticles.splice(i, 1);
          return;
        }

        const inClear = inClearZone(p.x, p.y);
        const alpha = Math.min(p.life * 3, 1) * (1 - p.life) * (inClear ? 0.3 : 1);
        
        if (alpha < 0.01) return;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = alpha;

        if (p.type === 'page') {
          ctx.fillStyle = '#fff8e0';
          ctx.fillRect(-p.size * 0.6, -p.size, p.size * 1.2, p.size * 1.6);
          ctx.strokeStyle = '#ccc';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(-p.size * 0.6, -p.size, p.size * 1.2, p.size * 1.6);
        } else if (p.type === 'heart') {
          ctx.fillStyle = '#ff6b9d';
          ctx.beginPath();
          ctx.moveTo(0, p.size * 0.3);
          ctx.bezierCurveTo(0, -p.size * 0.2, -p.size * 0.5, -p.size * 0.4, -p.size * 0.5, 0);
          ctx.bezierCurveTo(-p.size * 0.5, p.size * 0.3, 0, p.size * 0.7, 0, p.size);
          ctx.bezierCurveTo(0, p.size * 0.7, p.size * 0.5, p.size * 0.3, p.size * 0.5, 0);
          ctx.bezierCurveTo(p.size * 0.5, -p.size * 0.4, 0, -p.size * 0.2, 0, p.size * 0.3);
          ctx.fill();
        } else if (p.type === 'petal') {
          ctx.fillStyle = '#ffb3d9';
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 1.5, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'lantern') {
          ctx.fillStyle = '#ffe5b0';
          ctx.fillRect(-p.size * 0.5, -p.size, p.size, p.size * 1.4);
          ctx.globalCompositeOperation = 'lighter';
          drawGlow(0, 0, p.size * 2, 'rgb(255,200,100)', 0.5);
        } else if (p.type === 'firefly') {
          const glow = (Math.sin(p.phase) + 1) / 2;
          ctx.globalCompositeOperation = 'lighter';
          drawGlow(0, 0, p.size * 4, 'rgb(255,240,150)', glow * 0.6);
          ctx.globalCompositeOperation = 'source-over';
          ctx.fillStyle = `rgba(255,255,200,${glow})`;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else { // dust
          ctx.fillStyle = '#ffd080';
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      // Christmas lights along horizon
      for (let i = 0; i < 20; i++) {
        const lx = (i / 19) * w;
        const ly = h * 0.82 + Math.sin(lx * 0.01) * 10 - 5;
        const hue = (i * 30 + t * 20) % 360;
        const twinkle = Math.sin(t * 2 + i * 0.5) * 0.3 + 0.7;
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${twinkle * 0.7})`;
        ctx.beginPath();
        ctx.arc(lx, ly, 2.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalCompositeOperation = 'lighter';
        drawGlow(lx, ly, 8, `hsl(${hue}, 80%, 60%)`, twinkle * 0.3);
        ctx.globalCompositeOperation = 'source-over';
      }

      // Lens flare sweep (occasional)
      if (!prefersReduced && Math.sin(t * 0.2) > 0.95) {
        const flareX = ((t * 10) % 1) * w;
        const flareGrad = ctx.createRadialGradient(flareX, h / 2, 0, flareX, h / 2, w * 0.3);
        flareGrad.addColorStop(0, 'rgba(255,255,255,0.15)');
        flareGrad.addColorStop(0.5, 'rgba(255,220,200,0.08)');
        flareGrad.addColorStop(1, 'rgba(255,200,150,0)');
        ctx.fillStyle = flareGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // Screen bloom during burst
      if (emotion.phase === 'burst') {
        ctx.fillStyle = `rgba(255,220,255,${0.15 * emotion.intensity})`;
        ctx.fillRect(0, 0, w, h);
      }

      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener('resize', resize);
    
    canvas.dataset.mounted = 'true';
    
    loop();

    return () => {
      delete canvas.dataset.mounted;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  } catch (error) {
    console.error('NeverEnding canvas error:', error);
    return () => {};
  }
  }, []);

  console.log('NeverEnding component rendering');
  return (
    <div className="mw mw--neverending">
      <canvas ref={canvasRef} className="ne-canvas" />
      <Character name="dustin_suzi" className="ne-char" idle="breathe" shadow={false} eager />
    </div>
  );
}

function StepBySide() {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      console.log('StepBySide useEffect: canvas mounted, starting animation');
      const ctx = canvas.getContext('2d', { alpha: false });
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      let w, h, raf, t = 0;
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);
      const maxParticles = prefersReduced ? 20 : (isMobile ? 100 : 200);

      const resize = () => {
        w = canvas.offsetWidth;
        h = canvas.offsetHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.scale(dpr, dpr);
      };

      // Sky cycle (sunset to twilight, 30s loop)
      const getSkyColors = (t) => {
        const cycle = (t / 30) % 1;
        if (cycle < 0.5) {
          // Sunset
          const p = cycle * 2;
          return {
            top: `hsl(${240 + p * 20}, ${40 + p * 10}%, ${15 + p * 10}%)`,
            mid: `hsl(${280 - p * 10}, ${50 - p * 10}%, ${35 + p * 5}%)`,
            bottom: `hsl(${30 + p * 10}, ${70 - p * 10}%, ${45 + p * 5}%)`,
          };
        } else {
          // Twilight
          const p = (cycle - 0.5) * 2;
          return {
            top: `hsl(${260 - p * 20}, ${50 - p * 10}%, ${25 - p * 10}%)`,
            mid: `hsl(${270 + p * 10}, ${40 + p * 10}%, ${40 - p * 5}%)`,
            bottom: `hsl(${40 - p * 10}, ${60 + p * 10}%, ${50 - p * 5}%)`,
          };
        }
      };

      // Waves
      const waves = Array.from({ length: 5 }, (_, i) => ({
        y: 55 + i * 3,
        speed: 0.3 + i * 0.1,
        amp: 2 + i * 0.5,
        offset: Math.random() * Math.PI * 2,
      }));

      // Sparkles on water
      const sparkles = Array.from({ length: prefersReduced ? 10 : 40 }, () => ({
        x: Math.random() * 100,
        y: 55 + Math.random() * 30,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1,
      }));

      // Lamp posts
      const lamps = [15, 30, 45, 60, 75, 90];

      // Couple silhouette animation phases
      let couplePhase = 0;

      // Petals
      const petals = [];

      // Bokeh orbs and fireflies
      const bokeh = [];
      const fireflies = [];

      // Lanterns
      const lanterns = [];

      // Emotion loop (18s)
      const getEmotion = (t) => {
        const cycle = (t / 18) % 1;
        if (cycle < 0.2) return { phase: 'calm', intensity: 0.3 };
        if (cycle < 0.4) return { phase: 'warmup', intensity: 0.5 + (cycle - 0.2) * 2 };
        if (cycle < 0.5) return { phase: 'dance', intensity: 0.9 };
        if (cycle < 0.55) return { phase: 'peak', intensity: 1.2 };
        if (cycle < 0.75) return { phase: 'afterglow', intensity: 0.8 - (cycle - 0.55) * 1.5 };
        return { phase: 'calm', intensity: 0.3 };
      };

      const spawnPetal = () => {
        if (petals.length >= maxParticles * 0.4) return;
        petals.push({
          x: -5,
          y: 20 + Math.random() * 40,
          vx: 0.5 + Math.random() * 0.3,
          vy: (Math.random() - 0.5) * 0.2,
          rot: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.08,
          size: 2 + Math.random() * 3,
          life: 0,
          spiral: Math.random() * Math.PI * 2,
        });
      };

      const spawnBokeh = (x, y) => {
        if (bokeh.length >= maxParticles * 0.3) return;
        bokeh.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -0.1 - Math.random() * 0.2,
          size: 3 + Math.random() * 8,
          life: 0,
          phase: Math.random() * Math.PI * 2,
        });
      };

      const spawnLantern = () => {
        if (lanterns.length >= 5) return;
        lanterns.push({
          x: 30 + Math.random() * 40,
          y: 110,
          vy: -0.3 - Math.random() * 0.2,
          vx: (Math.random() - 0.5) * 0.1,
          size: 3 + Math.random() * 2,
          life: 0,
          sway: Math.random() * Math.PI * 2,
        });
      };

      const drawGlow = (x, y, size, color, alpha = 1) => {
        const grad = ctx.createRadialGradient(x, y, 0, x, y, size);
        grad.addColorStop(0, color.replace(')', `,${alpha})`).replace('rgb', 'rgba'));
        grad.addColorStop(0.5, color.replace(')', `,${alpha * 0.4})`).replace('rgb', 'rgba'));
        grad.addColorStop(1, color.replace(')', ',0)').replace('rgb', 'rgba'));
        ctx.fillStyle = grad;
        ctx.fillRect(x - size, y - size, size * 2, size * 2);
      };

      const inClearZone = (x, y) => {
        return (x < w * 0.3 && y < h * 0.2) || (x > w * 0.3 && x < w * 0.7 && y > h * 0.75);
      };

      const loop = () => {
        if (!canvas || document.hidden) {
          raf = requestAnimationFrame(loop);
          return;
        }

        t += 0.016;
        const emotion = prefersReduced ? { phase: 'calm', intensity: 0.4 } : getEmotion(t);
        const skyColors = getSkyColors(t);

        // Sky gradient
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, skyColors.top);
        grad.addColorStop(0.5, skyColors.mid);
        grad.addColorStop(1, skyColors.bottom);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Sun/moon glow
        const sunX = w * 0.75;
        const sunY = h * 0.65;
        ctx.globalCompositeOperation = 'lighter';
        drawGlow(sunX, sunY, 80, 'rgb(255,220,180)', 0.4);
        drawGlow(sunX, sunY, 40, 'rgb(255,240,200)', 0.6);
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#ffe8c0';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 20, 0, Math.PI * 2);
        ctx.fill();

        // Reflection path on water
        const refY = h * 0.65;
        const refGrad = ctx.createLinearGradient(sunX, refY, sunX, h);
        refGrad.addColorStop(0, 'rgba(255,240,200,0.4)');
        refGrad.addColorStop(0.3, 'rgba(255,220,180,0.2)');
        refGrad.addColorStop(1, 'rgba(255,200,150,0)');
        ctx.fillStyle = refGrad;
        ctx.fillRect(sunX - 30, refY, 60, h - refY);

        // Waves
        waves.forEach((wave) => {
          const waveY = h * wave.y / 100;
          ctx.strokeStyle = `rgba(100,150,200,0.2)`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let x = 0; x <= w; x += 10) {
            const y = waveY + Math.sin((x / w) * Math.PI * 4 + t * wave.speed + wave.offset) * wave.amp;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        });

        // Water sparkles
        sparkles.forEach((s) => {
          s.phase += s.speed * 0.05;
          const x = s.x * w / 100;
          const y = s.y * h / 100;
          const sparkle = (Math.sin(s.phase) + 1) / 2;
          if (sparkle > 0.7) {
            ctx.globalCompositeOperation = 'lighter';
            ctx.fillStyle = `rgba(255,255,255,${(sparkle - 0.7) * 2})`;
            ctx.fillRect(x, y, 2, 2);
            ctx.globalCompositeOperation = 'source-over';
          }
        });

        // Pier silhouette
        const pierY = h * 0.72;
        ctx.fillStyle = '#1a1520';
        ctx.fillRect(0, pierY, w, h - pierY);

        // Pier railing
        ctx.strokeStyle = '#0a0510';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, pierY + 10);
        ctx.lineTo(w, pierY + 10);
        ctx.stroke();

        // Lamp posts
        lamps.forEach((lx) => {
          const lampX = w * lx / 100;
          const lampY = pierY;
          
          // Post
          ctx.strokeStyle = '#0a0510';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(lampX, lampY);
          ctx.lineTo(lampX, lampY - 40);
          ctx.stroke();

          // Bulb glow
          const glowIntensity = 0.6 + Math.sin(t * 2 + lx) * 0.2;
          ctx.globalCompositeOperation = 'lighter';
          drawGlow(lampX, lampY - 40, 15, 'rgb(255,220,150)', glowIntensity * emotion.intensity * 0.5);
          ctx.globalCompositeOperation = 'source-over';
          
          ctx.fillStyle = '#ffd080';
          ctx.beginPath();
          ctx.arc(lampX, lampY - 40, 4, 0, Math.PI * 2);
          ctx.fill();

          // Reflection
          if (lx > 40 && lx < 90) {
            const refGrad = ctx.createLinearGradient(lampX, pierY, lampX, h);
            refGrad.addColorStop(0, 'rgba(255,220,150,0.3)');
            refGrad.addColorStop(0.5, 'rgba(255,200,130,0.1)');
            refGrad.addColorStop(1, 'rgba(255,180,100,0)');
            ctx.fillStyle = refGrad;
            ctx.fillRect(lampX - 8, pierY, 16, h - pierY);
          }
        });

        // String of lights
        for (let i = 0; i < 20; i++) {
          const lx = (i / 19) * w;
          const ly = pierY + 5 + Math.sin((i / 19) * Math.PI * 2) * 3;
          const twinkle = 0.7 + Math.sin(t * 2 + i * 0.3) * 0.3;
          
          ctx.globalCompositeOperation = 'lighter';
          drawGlow(lx, ly, 6, 'rgb(255,220,150)', twinkle * 0.4 * emotion.intensity);
          ctx.globalCompositeOperation = 'source-over';
          
          ctx.fillStyle = `rgba(255,220,150,${twinkle})`;
          ctx.beginPath();
          ctx.arc(lx, ly, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Couple silhouette
        couplePhase += 0.01 * emotion.intensity;
        const coupleX = w * 0.58;
        const coupleY = pierY - 15;
        const sway = Math.sin(couplePhase) * 3;
        const lean = emotion.phase === 'peak' ? 2 : 0;

        ctx.fillStyle = '#0a0510';
        
        // Person 1
        ctx.beginPath();
        ctx.ellipse(coupleX - 8 + sway, coupleY - 10, 6, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(coupleX - 10 + sway, coupleY, 4, 15);

        // Person 2
        ctx.beginPath();
        ctx.ellipse(coupleX + 8 - sway + lean, coupleY - 10, 6, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(coupleX + 6 - sway + lean, coupleY, 4, 15);

        // Petals
        if (!prefersReduced && Math.random() < 0.08 * emotion.intensity) spawnPetal();

        petals.forEach((p, i) => {
          p.spiral += 0.03;
          p.vx += Math.cos(p.spiral) * 0.02;
          p.vy += Math.sin(p.spiral) * 0.015;
          p.x += p.vx;
          p.y += p.vy;
          p.rot += p.rotSpeed;
          p.life += 0.01;

          if (p.life > 1 || p.x > 110) {
            petals.splice(i, 1);
            return;
          }

          const px = p.x * w / 100;
          const py = p.y * h / 100;
          const inClear = inClearZone(px, py);
          const alpha = Math.min(p.life * 2, 1) * (1 - p.life) * (inClear ? 0.3 : 1);

          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(p.rot);
          ctx.globalAlpha = alpha;
          ctx.fillStyle = '#ffb3d9';
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 1.4, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // Bokeh orbs
        if (!prefersReduced && Math.random() < 0.04 * emotion.intensity) {
          spawnBokeh(w * (0.3 + Math.random() * 0.4), h * (0.4 + Math.random() * 0.3));
        }

        bokeh.forEach((b, i) => {
          b.x += b.vx;
          b.y += b.vy;
          b.life += 0.01;
          b.phase += 0.05;

          if (b.life > 1) {
            bokeh.splice(i, 1);
            return;
          }

          const alpha = Math.min(b.life * 2, 1) * (1 - b.life);
          const glow = (Math.sin(b.phase) + 1) / 2;

          ctx.globalCompositeOperation = 'lighter';
          drawGlow(b.x, b.y, b.size * 2, 'rgb(255,220,180)', alpha * glow * 0.4);
          ctx.globalCompositeOperation = 'source-over';
          ctx.fillStyle = `rgba(255,230,200,${alpha * glow * 0.6})`;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
          ctx.fill();
        });

        // Heart glow at peak
        if (emotion.phase === 'peak') {
          const heartX = w * 0.5;
          const heartY = h * 0.4;
          const hs = 30;
          
          ctx.globalCompositeOperation = 'lighter';
          drawGlow(heartX, heartY, 50, 'rgb(255,150,180)', 0.3);
          ctx.globalCompositeOperation = 'source-over';
          
          ctx.fillStyle = 'rgba(255,180,200,0.4)';
          ctx.beginPath();
          ctx.moveTo(heartX, heartY + hs * 0.3);
          ctx.bezierCurveTo(heartX, heartY - hs * 0.2, heartX - hs * 0.5, heartY - hs * 0.4, heartX - hs * 0.5, heartY);
          ctx.bezierCurveTo(heartX - hs * 0.5, heartY + hs * 0.3, heartX, heartY + hs * 0.7, heartX, heartY + hs);
          ctx.bezierCurveTo(heartX, heartY + hs * 0.7, heartX + hs * 0.5, heartY + hs * 0.3, heartX + hs * 0.5, heartY);
          ctx.bezierCurveTo(heartX + hs * 0.5, heartY - hs * 0.4, heartX, heartY - hs * 0.2, heartX, heartY + hs * 0.3);
          ctx.fill();
        }

        // Fireflies
        if (!prefersReduced && fireflies.length < 10 && Math.random() < 0.02) {
          fireflies.push({
            x: Math.random() * 100,
            y: 20 + Math.random() * 50,
            vx: (Math.random() - 0.5) * 0.1,
            vy: (Math.random() - 0.5) * 0.1,
            phase: Math.random() * Math.PI * 2,
          });
        }

        fireflies.forEach((f, i) => {
          f.x += f.vx;
          f.y += f.vy;
          f.phase += 0.05;

          if (f.x < 0 || f.x > 100 || f.y < 10 || f.y > 70) {
            fireflies.splice(i, 1);
            return;
          }

          const fx = f.x * w / 100;
          const fy = f.y * h / 100;
          const glow = (Math.sin(f.phase) + 1) / 2;

          ctx.globalCompositeOperation = 'lighter';
          drawGlow(fx, fy, 4, 'rgb(255,240,150)', glow * 0.5);
          ctx.globalCompositeOperation = 'source-over';
          ctx.fillStyle = `rgba(255,250,200,${glow})`;
          ctx.beginPath();
          ctx.arc(fx, fy, 1.5, 0, Math.PI * 2);
          ctx.fill();
        });

        // Lanterns
        if (!prefersReduced && lanterns.length < 5 && Math.random() < 0.01) spawnLantern();

        lanterns.forEach((l, i) => {
          l.sway += 0.03;
          l.x += l.vx + Math.cos(l.sway) * 0.05;
          l.y += l.vy;
          l.life += 0.008;

          if (l.life > 1 || l.y < -10) {
            lanterns.splice(i, 1);
            return;
          }

          const lx = l.x * w / 100;
          const ly = l.y * h / 100;
          const alpha = Math.min(l.life * 2, 1) * (1 - l.life);

          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = '#ffe5b0';
          ctx.fillRect(lx - l.size, ly - l.size * 1.2, l.size * 2, l.size * 2.4);
          ctx.globalCompositeOperation = 'lighter';
          drawGlow(lx, ly, l.size * 3, 'rgb(255,200,100)', 0.4);
          ctx.restore();
        });

        // Golden bloom during peak
        if (emotion.phase === 'peak' || emotion.phase === 'afterglow') {
          const bloomAlpha = emotion.phase === 'peak' ? 0.15 : 0.08;
          ctx.fillStyle = `rgba(255,220,180,${bloomAlpha})`;
          ctx.fillRect(0, 0, w, h);
        }

        raf = requestAnimationFrame(loop);
      };

      resize();
      window.addEventListener('resize', resize);
      canvas.dataset.mounted = 'true';
      loop();

      return () => {
        delete canvas.dataset.mounted;
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
      };
    } catch (error) {
      console.error('StepBySide canvas error:', error);
      return () => {};
    }
  }, []);

  console.log('StepBySide component rendering');
  return (
    <div className="mw mw--stepbyside">
      <canvas ref={canvasRef} className="sbs-canvas" />
    </div>
  );
}

function OldMemory() {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      console.log('OldMemory useEffect: canvas mounted, starting animation');
      const ctx = canvas.getContext('2d', { alpha: false });
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      let w, h, raf, t = 0;
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);
      const maxParticles = prefersReduced ? 15 : (isMobile ? 80 : 150);

      const resize = () => {
        w = canvas.offsetWidth;
        h = canvas.offsetHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.scale(dpr, dpr);
      };

      // Sky breathing (sepia to dusty rose to teal-grey)
      const getSkyColors = (t) => {
        const breathe = Math.sin(t * 0.1) * 0.5 + 0.5;
        return {
          top: `hsl(${190 + breathe * 10}, ${25 - breathe * 10}%, ${30 - breathe * 5}%)`,
          mid: `hsl(${340 + breathe * 20}, ${35 + breathe * 10}%, ${45 + breathe * 5}%)`,
          bottom: `hsl(${35 - breathe * 10}, ${45 + breathe * 10}%, ${55 + breathe * 5}%)`,
        };
      };

      // Film grain
      const grainOpacity = 0.03;

      // Light beams
      const beams = Array.from({ length: 3 }, (_, i) => ({
        x: 10 + i * 15,
        angle: 65 + i * 5,
        width: 80 + i * 20,
      }));

      // Dust motes
      const dustMotes = [];

      // Kites
      const kites = Array.from({ length: 3 }, (_, i) => ({
        x: 20 + i * 30,
        y: 15 + i * 8,
        sway: Math.random() * Math.PI * 2,
        color: ['#c89', '#8ac', '#ca8'][i],
      }));

      // Birds (flocks)
      const birds = [];
      let birdTimer = 0;

      // Memory photographs
      const photographs = [];
      let photoTimer = 0;

      // Radio sparkles
      const radioSparkles = [];

      // Emotion loop (20s)
      const getEmotion = (t) => {
        const cycle = (t / 20) % 1;
        if (cycle < 0.25) return { phase: 'quiet', intensity: 0.2 };
        if (cycle < 0.45) return { phase: 'glow', intensity: 0.4 + (cycle - 0.25) * 2 };
        if (cycle < 0.55) return { phase: 'swell', intensity: 0.8 };
        if (cycle < 0.6) return { phase: 'peak', intensity: 1.0 };
        if (cycle < 0.8) return { phase: 'settle', intensity: 0.6 - (cycle - 0.6) * 1.5 };
        return { phase: 'quiet', intensity: 0.2 };
      };

      const spawnDust = () => {
        if (dustMotes.length >= maxParticles * 0.5) return;
        dustMotes.push({
          x: Math.random() * 40,
          y: 20 + Math.random() * 60,
          vx: 0.05 + Math.random() * 0.1,
          vy: (Math.random() - 0.5) * 0.05,
          size: 0.5 + Math.random() * 1.5,
          life: 0,
          phase: Math.random() * Math.PI * 2,
        });
      };

      const spawnBird = () => {
        birds.push({
          x: -5,
          y: 20 + Math.random() * 30,
          vx: 0.3 + Math.random() * 0.2,
          vy: (Math.random() - 0.5) * 0.05,
          flap: Math.random() * Math.PI * 2,
        });
      };

      const spawnPhoto = () => {
        if (photographs.length >= 6) return;
        photographs.push({
          x: 30 + Math.random() * 40,
          y: 110,
          vy: -0.15 - Math.random() * 0.1,
          vx: (Math.random() - 0.5) * 0.05,
          rot: (Math.random() - 0.5) * 0.2,
          life: 0,
          size: 8 + Math.random() * 4,
        });
      };

      const spawnRadioSparkle = () => {
        if (radioSparkles.length >= 20) return;
        radioSparkles.push({
          x: 15,
          y: 85,
          vx: (Math.random() - 0.5) * 0.2,
          vy: -0.5 - Math.random() * 0.3,
          life: 0,
          size: 1 + Math.random() * 1.5,
        });
      };

      const drawGlow = (x, y, size, color, alpha = 1) => {
        const grad = ctx.createRadialGradient(x, y, 0, x, y, size);
        grad.addColorStop(0, color.replace(')', `,${alpha})`).replace('rgb', 'rgba'));
        grad.addColorStop(0.5, color.replace(')', `,${alpha * 0.4})`).replace('rgb', 'rgba'));
        grad.addColorStop(1, color.replace(')', ',0)').replace('rgb', 'rgba'));
        ctx.fillStyle = grad;
        ctx.fillRect(x - size, y - size, size * 2, size * 2);
      };

      const inClearZone = (x, y) => {
        return (x < w * 0.3 && y < h * 0.2) || (x > w * 0.3 && x < w * 0.7 && y > h * 0.75);
      };

      const loop = () => {
        if (!canvas || document.hidden) {
          raf = requestAnimationFrame(loop);
          return;
        }

        t += 0.016;
        const emotion = prefersReduced ? { phase: 'quiet', intensity: 0.3 } : getEmotion(t);
        const skyColors = getSkyColors(t);

        // Sky gradient
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, skyColors.top);
        grad.addColorStop(0.5, skyColors.mid);
        grad.addColorStop(1, skyColors.bottom);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Light beams
        if (!prefersReduced) {
          ctx.globalCompositeOperation = 'lighter';
          beams.forEach((beam) => {
            const beamX = beam.x * w / 100;
            const beamY = 0;
            const beamAngle = (beam.angle * Math.PI) / 180;
            const beamLength = h * 1.2;
            
            ctx.save();
            ctx.translate(beamX, beamY);
            ctx.rotate(beamAngle);
            
            const beamGrad = ctx.createLinearGradient(-beam.width / 2, 0, beam.width / 2, 0);
            beamGrad.addColorStop(0, 'rgba(255,220,180,0)');
            beamGrad.addColorStop(0.5, `rgba(255,230,190,${0.08 * emotion.intensity})`);
            beamGrad.addColorStop(1, 'rgba(255,220,180,0)');
            ctx.fillStyle = beamGrad;
            ctx.fillRect(-beam.width / 2, 0, beam.width, beamLength);
            
            ctx.restore();
          });
          ctx.globalCompositeOperation = 'source-over';
        }

        // Dust motes
        if (Math.random() < 0.1 * emotion.intensity) spawnDust();

        dustMotes.forEach((d, i) => {
          d.x += d.vx;
          d.y += d.vy;
          d.life += 0.008;
          d.phase += 0.05;

          if (d.life > 1 || d.x > 110 || d.y < 0 || d.y > 100) {
            dustMotes.splice(i, 1);
            return;
          }

          const dx = d.x * w / 100;
          const dy = d.y * h / 100;
          const sparkle = (Math.sin(d.phase) + 1) / 2;
          const alpha = Math.min(d.life * 2, 1) * (1 - d.life) * sparkle;

          ctx.globalCompositeOperation = 'lighter';
          ctx.fillStyle = `rgba(255,240,200,${alpha * 0.6})`;
          ctx.fillRect(dx, dy, d.size, d.size);
          ctx.globalCompositeOperation = 'source-over';
        });

        // Kites
        kites.forEach((k) => {
          k.sway += 0.02;
          const kx = (k.x + Math.sin(k.sway) * 2) * w / 100;
          const ky = (k.y + Math.cos(k.sway * 0.5) * 1) * h / 100;

          // Kite diamond
          ctx.fillStyle = k.color;
          ctx.beginPath();
          ctx.moveTo(kx, ky - 8);
          ctx.lineTo(kx + 5, ky);
          ctx.lineTo(kx, ky + 8);
          ctx.lineTo(kx - 5, ky);
          ctx.closePath();
          ctx.fill();

          // Tail
          ctx.strokeStyle = k.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(kx, ky + 8);
          for (let i = 1; i <= 5; i++) {
            const ty = ky + 8 + i * 6;
            const tx = kx + Math.sin(k.sway + i * 0.5) * 3;
            ctx.lineTo(tx, ty);
          }
          ctx.stroke();
        });

        // Birds
        birdTimer++;
        if (!prefersReduced && birdTimer > 120 && Math.random() < 0.02) {
          spawnBird();
          birdTimer = 0;
        }

        birds.forEach((b, i) => {
          b.x += b.vx;
          b.y += b.vy;
          b.flap += 0.15;

          if (b.x > 110) {
            birds.splice(i, 1);
            return;
          }

          const bx = b.x * w / 100;
          const by = b.y * h / 100;
          const flapY = Math.sin(b.flap) * 2;

          ctx.strokeStyle = 'rgba(80,70,90,0.5)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(bx - 4, by + flapY);
          ctx.lineTo(bx, by);
          ctx.lineTo(bx + 4, by + flapY);
          ctx.stroke();
        });

        // Rooftop silhouette
        const roofY = h * 0.78;
        ctx.fillStyle = '#1a1520';
        ctx.fillRect(0, roofY, w, h - roofY);

        // Water tank
        const tankX = w * 0.75;
        const tankY = roofY - 30;
        ctx.fillStyle = '#0d0a12';
        ctx.fillRect(tankX, tankY, 40, 30);
        ctx.fillRect(tankX + 10, tankY - 8, 20, 8);

        // Antenna
        const antX = w * 0.85;
        ctx.strokeStyle = '#0d0a12';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(antX, roofY);
        ctx.lineTo(antX, roofY - 50);
        ctx.stroke();

        // Wire from antenna
        ctx.strokeStyle = 'rgba(13,10,18,0.3)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(antX, roofY - 50);
        ctx.quadraticCurveTo(antX - 60, roofY - 30, antX - 120, roofY - 20);
        ctx.stroke();

        // Clothesline with cloth
        const clothX = w * 0.4;
        ctx.strokeStyle = '#0d0a12';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(clothX - 60, roofY - 25);
        ctx.lineTo(clothX + 60, roofY - 25);
        ctx.stroke();

        const clothSway = Math.sin(t * 0.5) * 2;
        ctx.fillStyle = '#2a2535';
        ctx.fillRect(clothX + clothSway, roofY - 35, 20, 25);

        // Radio
        const radioX = w * 0.15;
        const radioY = roofY - 10;
        ctx.fillStyle = '#2a2535';
        ctx.fillRect(radioX, radioY, 15, 10);
        
        // Radio dial glow
        const dialGlow = 0.5 + Math.sin(t * 2) * 0.3 * emotion.intensity;
        ctx.globalCompositeOperation = 'lighter';
        drawGlow(radioX + 12, radioY + 5, 6, 'rgb(255,180,100)', dialGlow * 0.6);
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = `rgba(255,180,100,${dialGlow})`;
        ctx.fillRect(radioX + 11, radioY + 4, 2, 2);

        // Radio sparkles
        if (emotion.phase !== 'quiet' && Math.random() < 0.08 * emotion.intensity) spawnRadioSparkle();

        radioSparkles.forEach((s, i) => {
          s.x += s.vx;
          s.y += s.vy;
          s.life += 0.015;

          if (s.life > 1) {
            radioSparkles.splice(i, 1);
            return;
          }

          const sx = s.x * w / 100;
          const sy = s.y * h / 100;
          const alpha = Math.min(s.life * 2, 1) * (1 - s.life);

          ctx.globalCompositeOperation = 'lighter';
          ctx.fillStyle = `rgba(255,220,150,${alpha * 0.7})`;
          ctx.beginPath();
          ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalCompositeOperation = 'source-over';
        });

        // Memory photographs
        photoTimer++;
        if (!prefersReduced && photoTimer > 100 && photographs.length < 6 && Math.random() < 0.03) {
          spawnPhoto();
          photoTimer = 0;
        }

        photographs.forEach((p, i) => {
          p.x += p.vx;
          p.y += p.vy;
          p.life += 0.006;

          if (p.life > 1 || p.y < -10) {
            photographs.splice(i, 1);
            return;
          }

          const px = p.x * w / 100;
          const py = p.y * h / 100;
          const inClear = inClearZone(px, py);
          const alpha = Math.min(p.life * 1.5, 1) * (1 - p.life) * (inClear ? 0.2 : 1);
          const photoGlow = emotion.phase === 'peak' ? 0.3 : 0;

          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(p.rot);
          ctx.globalAlpha = alpha;

          // Frame
          ctx.fillStyle = '#e8dcc0';
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);

          // Sepia blur inside (abstract shapes)
          ctx.fillStyle = `rgba(180,160,130,${0.6 + photoGlow})`;
          ctx.fillRect(-p.size / 2 + 1, -p.size / 2 + 1, p.size - 2, p.size - 2);
          
          ctx.fillStyle = 'rgba(140,120,100,0.4)';
          ctx.beginPath();
          ctx.arc(0, -p.size / 4, p.size / 4, 0, Math.PI * 2);
          ctx.fill();

          if (photoGlow > 0) {
            ctx.globalCompositeOperation = 'lighter';
            drawGlow(0, 0, p.size, 'rgb(255,220,180)', photoGlow);
          }

          ctx.restore();
        });

        // Film grain
        if (!prefersReduced) {
          ctx.globalAlpha = grainOpacity;
          for (let i = 0; i < 100; i++) {
            ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#000';
            ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
          }
          ctx.globalAlpha = 1;
        }

        // Vignette
        const vignette = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
        vignette.addColorStop(0, 'rgba(0,0,0,0)');
        vignette.addColorStop(0.7, 'rgba(0,0,0,0.1)');
        vignette.addColorStop(1, 'rgba(0,0,0,0.3)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, w, h);

        // Film scratches (rare)
        if (!prefersReduced && Math.random() < 0.005) {
          const scratchX = Math.random() * w;
          ctx.strokeStyle = 'rgba(255,255,255,0.1)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(scratchX, 0);
          ctx.lineTo(scratchX + (Math.random() - 0.5) * 20, h);
          ctx.stroke();
        }

        // Flicker
        if (!prefersReduced && Math.random() < 0.02) {
          ctx.fillStyle = 'rgba(255,255,255,0.03)';
          ctx.fillRect(0, 0, w, h);
        }

        // Golden swell during peak
        if (emotion.phase === 'swell' || emotion.phase === 'peak') {
          const swellAlpha = emotion.phase === 'peak' ? 0.08 : 0.04;
          ctx.fillStyle = `rgba(255,210,160,${swellAlpha})`;
          ctx.fillRect(0, 0, w, h);
        }

        raf = requestAnimationFrame(loop);
      };

      resize();
      window.addEventListener('resize', resize);
      canvas.dataset.mounted = 'true';
      loop();

      return () => {
        delete canvas.dataset.mounted;
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
      };
    } catch (error) {
      console.error('OldMemory canvas error:', error);
      return () => {};
    }
  }, []);

  console.log('OldMemory component rendering');
  return (
    <div className="mw mw--oldmemory">
      <canvas ref={canvasRef} className="om-canvas" />
      <Character name="together-lazy" className="om-char" idle="breathe" shadow={false} eager />
    </div>
  );
}

function FightQueen() {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      console.log('FightQueen useEffect: canvas mounted, starting animation');
      const ctx = canvas.getContext('2d', { alpha: false });
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      let w, h, raf, t = 0;
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);
      const maxParticles = prefersReduced ? 20 : (isMobile ? 100 : 200);

      const resize = () => {
        w = canvas.offsetWidth;
        h = canvas.offsetHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.scale(dpr, dpr);
      };

      // Mountain ridges (4 layers, far to near)
      const ridges = Array.from({ length: 4 }, (_, i) => ({
        points: Array.from({ length: 15 }, () => Math.random()),
        y: 60 - i * 8,
        opacity: 0.3 + i * 0.2,
        drift: (4 - i) * 0.02,
      }));

      // Rolling clouds
      const cloudLayers = Array.from({ length: 3 }, (_, i) => ({
        y: 70 + i * 5,
        speed: 0.05 + i * 0.03,
        offset: Math.random() * 100,
      }));

      // Lightning flashes
      let lightningTimer = 0;
      let lightningFlash = 0;

      // Rain streaks
      const rainStreaks = [];

      // Embers/sparks
      const embers = [];

      // Lanterns on path
      const lanterns = Array.from({ length: 8 }, (_, i) => ({
        x: 20 + i * 8,
        y: 85 - i * 3,
        lit: false,
        litTime: 0,
      }));

      // God rays
      const godRays = Array.from({ length: 12 }, (_, i) => ({
        angle: -30 + i * 5,
        width: 20 + (i % 3) * 10,
      }));

      // Emotion loop (20s)
      const getEmotion = (t) => {
        const cycle = (t / 20) % 1;
        if (cycle < 0.3) return { phase: 'storm', intensity: 0.1, sunRise: 0 };
        if (cycle < 0.4) return { phase: 'crack', intensity: 0.3, sunRise: 0.2 };
        if (cycle < 0.5) return { phase: 'burst', intensity: 0.7, sunRise: 0.6 };
        if (cycle < 0.65) return { phase: 'triumph', intensity: 1.0, sunRise: 1.0 };
        if (cycle < 0.8) return { phase: 'glow', intensity: 0.8, sunRise: 0.9 };
        return { phase: 'storm', intensity: 0.1, sunRise: 0 };
      };

      const spawnRain = () => {
        if (rainStreaks.length >= maxParticles * 0.3) return;
        rainStreaks.push({
          x: Math.random() * 110,
          y: -5,
          vy: 2 + Math.random(),
          length: 10 + Math.random() * 10,
        });
      };

      const spawnEmber = () => {
        if (embers.length >= maxParticles * 0.4) return;
        embers.push({
          x: 20 + Math.random() * 60,
          y: 110,
          vx: (Math.random() - 0.5) * 0.2,
          vy: -0.5 - Math.random() * 0.5,
          life: 0,
          size: 1.5 + Math.random() * 2,
          phase: Math.random() * Math.PI * 2,
        });
      };

      const drawGlow = (x, y, size, color, alpha = 1) => {
        const grad = ctx.createRadialGradient(x, y, 0, x, y, size);
        grad.addColorStop(0, color.replace(')', `,${alpha})`).replace('rgb', 'rgba'));
        grad.addColorStop(0.5, color.replace(')', `,${alpha * 0.4})`).replace('rgb', 'rgba'));
        grad.addColorStop(1, color.replace(')', ',0)').replace('rgb', 'rgba'));
        ctx.fillStyle = grad;
        ctx.fillRect(x - size, y - size, size * 2, size * 2);
      };

      const inClearZone = (x, y) => {
        return (x < w * 0.3 && y < h * 0.2) || (x > w * 0.3 && x < w * 0.7 && y > h * 0.75);
      };

      const loop = () => {
        if (!canvas || document.hidden) {
          raf = requestAnimationFrame(loop);
          return;
        }

        t += 0.016;
        const emotion = prefersReduced ? { phase: 'triumph', intensity: 0.5, sunRise: 0.7 } : getEmotion(t);

        // Sky gradient (storm to sunrise)
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
        if (emotion.phase === 'storm') {
          skyGrad.addColorStop(0, '#1a1d2e');
          skyGrad.addColorStop(0.6, '#2a2d3e');
          skyGrad.addColorStop(1, '#3a3d4e');
        } else {
          const sr = emotion.sunRise;
          skyGrad.addColorStop(0, `hsl(${200 + sr * 40}, ${20 + sr * 30}%, ${15 + sr * 25}%)`);
          skyGrad.addColorStop(0.4, `hsl(${340 + sr * 20}, ${40 + sr * 20}%, ${25 + sr * 20}%)`);
          skyGrad.addColorStop(0.7, `hsl(${20 + sr * 10}, ${60 + sr * 20}%, ${40 + sr * 15}%)`);
          skyGrad.addColorStop(1, `hsl(${30}, ${70}%, ${50 + sr * 10}%)`);
        }
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h);

        // Lightning
        if (emotion.phase === 'storm') {
          lightningTimer++;
          if (lightningTimer > 60 && Math.random() < 0.03) {
            lightningFlash = 1;
            lightningTimer = 0;
          }
          if (lightningFlash > 0) {
            ctx.fillStyle = `rgba(200,220,255,${lightningFlash * 0.3})`;
            ctx.fillRect(0, 0, w, h * 0.6);
            lightningFlash *= 0.85;
          }
        }

        // Rolling clouds
        cloudLayers.forEach((cloud, i) => {
          cloud.offset += cloud.speed;
          const cy = h * cloud.y / 100;
          
          ctx.fillStyle = i === 0 ? 'rgba(80,85,100,0.4)' : i === 1 ? 'rgba(100,105,120,0.3)' : 'rgba(120,125,140,0.2)';
          ctx.beginPath();
          for (let x = -50; x <= w + 50; x += 30) {
            const y = cy + Math.sin((x + cloud.offset * 10) * 0.02) * 15;
            if (x === -50) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.lineTo(w + 50, h);
          ctx.lineTo(-50, h);
          ctx.closePath();
          ctx.fill();
        });

        // Rain
        if (emotion.phase === 'storm' && Math.random() < 0.15) spawnRain();
        if (emotion.phase === 'crack' && Math.random() < 0.05) spawnRain();

        rainStreaks.forEach((r, i) => {
          r.y += r.vy;
          if (r.y > h + 10) {
            rainStreaks.splice(i, 1);
            return;
          }

          const rx = r.x * w / 100;
          const alpha = emotion.phase === 'storm' ? 0.3 : 0.1;
          ctx.strokeStyle = `rgba(150,180,220,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(rx, r.y);
          ctx.lineTo(rx + 2, r.y + r.length);
          ctx.stroke();
        });

        // Sun rising
        if (emotion.sunRise > 0.1) {
          const sunX = w * 0.5;
          const sunY = h * (0.65 - emotion.sunRise * 0.15);
          
          // God rays
          if (!prefersReduced) {
            ctx.globalCompositeOperation = 'lighter';
            godRays.forEach((ray) => {
              ctx.save();
              ctx.translate(sunX, sunY);
              ctx.rotate((ray.angle * Math.PI) / 180);
              
              const rayGrad = ctx.createLinearGradient(-ray.width / 2, 0, ray.width / 2, 0);
              rayGrad.addColorStop(0, 'rgba(255,200,100,0)');
              rayGrad.addColorStop(0.5, `rgba(255,220,150,${0.15 * emotion.sunRise})`);
              rayGrad.addColorStop(1, 'rgba(255,200,100,0)');
              ctx.fillStyle = rayGrad;
              ctx.fillRect(-ray.width / 2, 0, ray.width, h);
              
              ctx.restore();
            });
            ctx.globalCompositeOperation = 'source-over';
          }

          // Sun glow
          ctx.globalCompositeOperation = 'lighter';
          drawGlow(sunX, sunY, 80 * emotion.sunRise, 'rgb(255,200,100)', 0.5 * emotion.sunRise);
          drawGlow(sunX, sunY, 40 * emotion.sunRise, 'rgb(255,230,180)', 0.7 * emotion.sunRise);
          ctx.globalCompositeOperation = 'source-over';
          
          ctx.fillStyle = `rgba(255,240,200,${emotion.sunRise})`;
          ctx.beginPath();
          ctx.arc(sunX, sunY, 20 * emotion.sunRise, 0, Math.PI * 2);
          ctx.fill();
        }

        // Mountain ridges
        ridges.forEach((ridge, ri) => {
          const ry = h * ridge.y / 100;
          const color = ri === 0 ? 'rgba(100,105,120,0.3)' : ri === 1 ? 'rgba(70,75,90,0.5)' : ri === 2 ? 'rgba(40,45,60,0.7)' : 'rgba(20,25,40,0.9)';
          
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(0, h);
          for (let i = 0; i < ridge.points.length; i++) {
            const x = (i / (ridge.points.length - 1)) * w;
            const offset = Math.sin(t * ridge.drift + i * 0.5) * 2;
            const y = ry + (ridge.points[i] * 30) + offset;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(w, h);
          ctx.closePath();
          ctx.fill();
        });

        // Embers/sparks
        if ((emotion.phase === 'burst' || emotion.phase === 'triumph' || emotion.phase === 'glow') && Math.random() < 0.08 * emotion.intensity) {
          spawnEmber();
        }

        embers.forEach((e, i) => {
          e.x += e.vx;
          e.y += e.vy;
          e.life += 0.01;
          e.phase += 0.08;

          if (e.life > 1 || e.y < -10) {
            embers.splice(i, 1);
            return;
          }

          const ex = e.x * w / 100;
          const ey = e.y * h / 100;
          const inClear = inClearZone(ex, ey);
          const sparkle = (Math.sin(e.phase) + 1) / 2;
          const alpha = Math.min(e.life * 2, 1) * (1 - e.life) * sparkle * (inClear ? 0.3 : 1);

          ctx.globalCompositeOperation = 'lighter';
          drawGlow(ex, ey, e.size * 3, 'rgb(255,180,100)', alpha * 0.4);
          ctx.globalCompositeOperation = 'source-over';
          ctx.fillStyle = `rgba(255,200,120,${alpha})`;
          ctx.beginPath();
          ctx.arc(ex, ey, e.size, 0, Math.PI * 2);
          ctx.fill();
        });

        // Lanterns lighting up
        lanterns.forEach((l, i) => {
          if (!l.lit && emotion.sunRise > i * 0.12) {
            l.lit = true;
            l.litTime = t;
          }

          if (l.lit) {
            const lx = l.x * w / 100;
            const ly = l.y * h / 100;
            const glow = Math.min((t - l.litTime) * 2, 1);

            ctx.globalCompositeOperation = 'lighter';
            drawGlow(lx, ly, 8, 'rgb(255,220,150)', glow * 0.5);
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = `rgba(255,220,150,${glow})`;
            ctx.beginPath();
            ctx.arc(lx, ly, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        // Crown of light at triumph
        if (emotion.phase === 'triumph') {
          const crownX = w * 0.85;
          const crownY = h * 0.55;
          
          ctx.globalCompositeOperation = 'lighter';
          drawGlow(crownX, crownY, 60, 'rgb(255,220,180)', 0.3);
          ctx.globalCompositeOperation = 'source-over';
          
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const sx = crownX + Math.cos(angle) * 25;
            const sy = crownY + Math.sin(angle) * 25;
            const ex = crownX + Math.cos(angle) * 35;
            const ey = crownY + Math.sin(angle) * 35;
            
            ctx.strokeStyle = 'rgba(255,230,200,0.4)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(ex, ey);
            ctx.stroke();
          }
        }

        // Lens flare sweep
        if (!prefersReduced && emotion.phase === 'burst') {
          const flareX = ((t * 5) % 1) * w;
          const flareGrad = ctx.createRadialGradient(flareX, h / 2, 0, flareX, h / 2, w * 0.3);
          flareGrad.addColorStop(0, 'rgba(255,255,255,0.15)');
          flareGrad.addColorStop(0.5, 'rgba(255,230,200,0.08)');
          flareGrad.addColorStop(1, 'rgba(255,200,150,0)');
          ctx.fillStyle = flareGrad;
          ctx.fillRect(0, 0, w, h);
        }

        // Golden bloom
        if (emotion.phase === 'triumph' || emotion.phase === 'glow') {
          const bloomAlpha = emotion.phase === 'triumph' ? 0.12 : 0.06;
          ctx.fillStyle = `rgba(255,210,150,${bloomAlpha})`;
          ctx.fillRect(0, 0, w, h);
        }

        raf = requestAnimationFrame(loop);
      };

      resize();
      window.addEventListener('resize', resize);
      canvas.dataset.mounted = 'true';
      loop();

      return () => {
        delete canvas.dataset.mounted;
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
      };
    } catch (error) {
      console.error('FightQueen canvas error:', error);
      return () => {};
    }
  }, []);

  console.log('FightQueen component rendering');
  return (
    <div className="mw mw--fightqueen">
      <canvas ref={canvasRef} className="fq-canvas" />
      <Character name="fighting" className="fq-char" idle="bob" shadow={false} eager />
    </div>
  );
}

const WORLDS = { train: Train, city: City, sky: Sky, room: Room, neverending: NeverEnding, stepbyside: StepBySide, oldmemory: OldMemory, fightqueen: FightQueen };

function MusicWorld({ id }) {
  console.log('MusicWorld rendering with id:', id, 'Component:', WORLDS[id]?.name || 'NOT FOUND');
  const W = WORLDS[id];
  return W ? <W /> : null;
}

export default memo(MusicWorld);
