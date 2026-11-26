import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import Scene from '../components/Scene';
import MagneticButton from '../components/MagneticButton';
import { blueprintOfUs } from '../data/content';
import { goTo } from '../lib/director';
import { sfx } from '../lib/audio';
import { gsap } from '../lib/gsap';
import { REDUCED } from '../lib/motion';
import { useScene } from '../components/Scene';
import './BlueprintOfUs.css';

// Safe defaults for content
const content = {
  eyebrow: blueprintOfUs?.eyebrow || '',
  title: blueprintOfUs?.title || 'Blueprint of',
  titleAccent: blueprintOfUs?.titleAccent || 'Us',
  subtitle: blueprintOfUs?.subtitle || '',
  theme: blueprintOfUs?.theme || {},
  titleBlock: blueprintOfUs?.titleBlock || {},
  rooms: blueprintOfUs?.rooms || [],
  palette: blueprintOfUs?.palette || [],
  finale: blueprintOfUs?.finale || '',
  hint: blueprintOfUs?.hint || 'tap a room',
  progress: blueprintOfUs?.progress || 'rooms discovered',
  close: blueprintOfUs?.close || 'close',
  next: blueprintOfUs?.next || 'continue →',
};

// Mood-specific ambient particles
function MoodAmbience({ mood, active }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    if (!active || REDUCED) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 20 : 40;

    // Initialize particles based on mood
    if (mood === 'golden') {
      // Dust motes in golden light
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.2,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.2,
      }));
    } else if (mood === 'rain') {
      // Rain streaks
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vy: Math.random() * 3 + 2,
        length: Math.random() * 8 + 4,
        opacity: Math.random() * 0.3 + 0.1,
      }));
    } else if (mood === 'candle') {
      // Warm glow particles
      particlesRef.current = Array.from({ length: Math.floor(count * 0.6) }, () => ({
        x: rect.width * 0.5 + (Math.random() - 0.5) * 60,
        y: rect.height * 0.3 + Math.random() * 40,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.6 - 0.3,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        flicker: Math.random() * Math.PI * 2,
      }));
    } else if (mood === 'morning') {
      // Soft sunrise rays (static gradient, minimal particles)
      particlesRef.current = Array.from({ length: Math.floor(count * 0.4) }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height * 0.4,
        vy: Math.random() * 0.2 + 0.1,
        size: Math.random() * 1.2 + 0.8,
        opacity: Math.random() * 0.25 + 0.15,
      }));
    } else if (mood === 'midnight') {
      // Stars twinkling
      particlesRef.current = Array.from({ length: Math.floor(count * 0.5) }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height * 0.6,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.2,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
      }));
    }

    function animate() {
      ctx.clearRect(0, 0, rect.width, rect.height);

      particlesRef.current.forEach((p) => {
        if (mood === 'golden') {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -10) {
            p.y = rect.height + 10;
            p.x = Math.random() * rect.width;
          }
          if (p.x < 0 || p.x > rect.width) p.vx *= -1;
          ctx.fillStyle = `rgba(243, 207, 138, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (mood === 'rain') {
          p.y += p.vy;
          if (p.y > rect.height + 10) {
            p.y = -10;
            p.x = Math.random() * rect.width;
          }
          ctx.strokeStyle = `rgba(210, 215, 255, ${p.opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, p.y + p.length);
          ctx.stroke();
        } else if (mood === 'candle') {
          p.flicker += 0.05;
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -10) {
            p.y = rect.height * 0.3 + Math.random() * 40;
            p.x = rect.width * 0.5 + (Math.random() - 0.5) * 60;
          }
          const flickerOpacity = p.opacity * (0.8 + Math.sin(p.flicker) * 0.2);
          ctx.fillStyle = `rgba(243, 180, 120, ${flickerOpacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (mood === 'morning') {
          p.y += p.vy;
          if (p.y > rect.height) {
            p.y = -10;
            p.x = Math.random() * rect.width;
          }
          ctx.fillStyle = `rgba(255, 240, 220, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (mood === 'midnight') {
          p.twinkle += p.twinkleSpeed;
          const twinkleOpacity = p.opacity * (0.6 + Math.sin(p.twinkle) * 0.4);
          ctx.fillStyle = `rgba(220, 220, 255, ${twinkleOpacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      rafRef.current = requestAnimationFrame(animate);
    }

    animate();

    const onVisibilityChange = () => {
      if (document.hidden && rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else if (!document.hidden && active && !REDUCED) {
        animate();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [mood, active]);

  if (REDUCED || !active) return null;

  return <canvas ref={canvasRef} className="bp-ambience" />;
}

// Memory card dialog
function MemoryCard({ room, onClose, onNext, onPrev, currentIndex, totalRooms }) {
  const cardRef = useRef(null);
  const [flippedSwatch, setFlippedSwatch] = useState(null);

  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el || REDUCED) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { opacity: 0, scale: 0.9, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.4)' });
    }, el);
    return () => ctx.revert();
  }, [room]);

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const onClickOutside = (e) => {
      if (e.target.classList.contains('bp-card-backdrop')) onClose();
    };
    document.addEventListener('keydown', onEsc);
    document.addEventListener('click', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.removeEventListener('click', onClickOutside);
    };
  }, [onClose]);

  if (!room) return null;

  return (
    <div className="bp-card-backdrop" role="dialog" aria-modal="true" aria-labelledby="memory-title">
      <div className="bp-card" ref={cardRef}>
        <MoodAmbience mood={room.mood || 'golden'} active={true} />
        <button type="button" className="bp-card-close" onClick={onClose} aria-label={content.close}>
          ✕
        </button>
        <div className="bp-card-content">
          <span className="bp-card-room-name">{room.name || ''}</span>
          <h3 className="bp-card-title" id="memory-title">
            {room.title || ''}
          </h3>
          {room.date && <span className="bp-card-date">{room.date}</span>}
          <p className="bp-card-note">{room.note || ''}</p>
          {room.image && (
            <div className="bp-card-image">
              <img src={room.image} alt="" loading="lazy" decoding="async" />
            </div>
          )}
        </div>
        <div className="bp-card-nav">
          {totalRooms > 1 && (
            <>
              <button type="button" className="bp-card-arrow" onClick={onPrev} aria-label="Previous room">
                ‹
              </button>
              <span className="bp-card-counter">
                {currentIndex + 1} / {totalRooms}
              </span>
              <button type="button" className="bp-card-arrow" onClick={onNext} aria-label="Next room">
                ›
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BlueprintOfUs() {
  const { inView } = useScene();
  const floorRef = useRef(null);
  const [openedRooms, setOpenedRooms] = useState(new Set());
  const [activeRoom, setActiveRoom] = useState(null);
  const [flippedSwatch, setFlippedSwatch] = useState(null);
  const [showFinale, setShowFinale] = useState(false);

  const rooms = content.rooms;
  const palette = content.palette;

  // Drawing animation on entrance
  useLayoutEffect(() => {
    const el = floorRef.current;
    if (!el || REDUCED) return;
    const ctx = gsap.context(() => {
      const walls = el.querySelectorAll('.bp-wall');
      const doors = el.querySelectorAll('.bp-door');
      const windows = el.querySelectorAll('.bp-window');
      const furniture = el.querySelectorAll('.bp-furniture');
      const dimensions = el.querySelectorAll('.bp-dimension');
      const labels = el.querySelectorAll('.bp-room-label');

      if (walls.length) {
        walls.forEach((wall) => {
          const length = wall.getTotalLength?.() || 0;
          if (length) {
            gsap.set(wall, { strokeDasharray: length, strokeDashoffset: length });
          }
        });
        gsap.to(walls, { strokeDashoffset: 0, duration: 2.5, stagger: 0.08, ease: 'power1.inOut', delay: 0.3 });
      }

      if (doors.length || windows.length || furniture.length) {
        gsap.fromTo(
          [doors, windows, furniture],
          { opacity: 0 },
          { opacity: 1, duration: 0.8, stagger: 0.05, ease: 'power2.out', delay: 2.8 },
        );
      }

      if (dimensions.length || labels.length) {
        gsap.fromTo(
          [dimensions, labels],
          { opacity: 0 },
          { opacity: 1, duration: 0.6, stagger: 0.04, ease: 'power2.out', delay: 3.2 },
        );
      }
    }, el);
    return () => ctx.revert();
  }, [inView]);

  // Finale when all rooms discovered
  useEffect(() => {
    if (rooms.length && openedRooms.size === rooms.length && !showFinale) {
      setShowFinale(true);
      sfx.soft?.();
    }
  }, [openedRooms.size, rooms.length, showFinale]);

  const openRoom = (room) => {
    if (!room) return;
    sfx.tap?.();
    setActiveRoom(room);
    setOpenedRooms((prev) => new Set([...prev, room.id]));
  };

  const closeRoom = () => {
    setActiveRoom(null);
  };

  const nextRoom = () => {
    if (!activeRoom || !rooms.length) return;
    const idx = rooms.findIndex((r) => r.id === activeRoom.id);
    const next = rooms[(idx + 1) % rooms.length];
    setActiveRoom(next);
    setOpenedRooms((prev) => new Set([...prev, next.id]));
  };

  const prevRoom = () => {
    if (!activeRoom || !rooms.length) return;
    const idx = rooms.findIndex((r) => r.id === activeRoom.id);
    const prev = rooms[(idx - 1 + rooms.length) % rooms.length];
    setActiveRoom(prev);
    setOpenedRooms((prev) => new Set([...prev, prev.id]));
  };

  const flipSwatch = (swatch) => {
    if (!swatch) return;
    sfx.tap?.();
    setFlippedSwatch(flippedSwatch === swatch.code ? null : swatch.code);
    // Tint the floor plan briefly
    const floor = floorRef.current;
    if (floor && swatch.hex) {
      gsap.to(floor, { filter: `hue-rotate(0deg) brightness(1.1)`, duration: 0.3, yoyo: true, repeat: 1 });
    }
  };

  const currentRoomIndex = activeRoom ? rooms.findIndex((r) => r.id === activeRoom.id) : -1;

  return (
    <Scene id="blueprint" theme="blueprint" camera="rise" className="bp" label="Blueprint of Us">
      <div className="bp-wrap">
        <header className="bp-head">
          <span className="eyebrow">{content.eyebrow}</span>
          <h2 className="h-serif bp-title">
            {content.title} <em>{content.titleAccent}</em>
          </h2>
          {content.subtitle && <p className="bp-subtitle">{content.subtitle}</p>}
        </header>

        <div className="bp-floor-wrap">
          <svg
            ref={floorRef}
            className="bp-floor"
            viewBox="0 0 400 300"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Floor plan with clickable rooms"
          >
            <defs>
              <pattern id="bp-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke={content.theme.grid || '#1a2844'} strokeWidth="0.3" />
              </pattern>
              <pattern id="bp-grid-major" width="50" height="50" patternUnits="userSpaceOnUse">
                <rect width="50" height="50" fill="url(#bp-grid)" />
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke={content.theme.grid || '#1a2844'} strokeWidth="0.6" />
              </pattern>
            </defs>

            {/* Background grid */}
            <rect width="400" height="300" fill="url(#bp-grid-major)" opacity="0.4" />

            {/* Outer walls */}
            <rect
              className="bp-wall"
              x="40"
              y="40"
              width="320"
              height="220"
              fill="none"
              stroke={content.theme.line || '#d4c4a8'}
              strokeWidth="2"
              shapeRendering="geometricPrecision"
            />

            {/* Inner walls - creating rooms */}
            {/* Living room wall */}
            <line className="bp-wall" x1="40" y1="140" x2="180" y2="140" stroke={content.theme.line || '#d4c4a8'} strokeWidth="1.5" />
            {/* Kitchen wall */}
            <line className="bp-wall" x1="180" y1="40" x2="180" y2="140" stroke={content.theme.line || '#d4c4a8'} strokeWidth="1.5" />
            {/* Balcony wall */}
            <line className="bp-wall" x1="260" y1="40" x2="260" y2="140" stroke={content.theme.line || '#d4c4a8'} strokeWidth="1.5" />
            {/* Bedroom wall */}
            <line className="bp-wall" x1="180" y1="180" x2="360" y2="180" stroke={content.theme.line || '#d4c4a8'} strokeWidth="1.5" />
            {/* Study wall */}
            <line className="bp-wall" x1="260" y1="180" x2="260" y2="260" stroke={content.theme.line || '#d4c4a8'} strokeWidth="1.5" />

            {/* Doors (small gaps + arcs) */}
            <path className="bp-door" d="M 180 100 Q 195 100 195 85" fill="none" stroke={content.theme.line || '#d4c4a8'} strokeWidth="0.8" opacity="0.6" />
            <path className="bp-door" d="M 220 140 Q 220 125 235 125" fill="none" stroke={content.theme.line || '#d4c4a8'} strokeWidth="0.8" opacity="0.6" />
            <path className="bp-door" d="M 110 140 Q 110 155 95 155" fill="none" stroke={content.theme.line || '#d4c4a8'} strokeWidth="0.8" opacity="0.6" />
            <path className="bp-door" d="M 220 180 Q 220 195 235 195" fill="none" stroke={content.theme.line || '#d4c4a8'} strokeWidth="0.8" opacity="0.6" />

            {/* Windows (double lines) */}
            <g className="bp-window" opacity="0.5">
              <line x1="80" y1="40" x2="120" y2="40" stroke={content.theme.line || '#d4c4a8'} strokeWidth="1.2" />
              <line x1="80" y1="43" x2="120" y2="43" stroke={content.theme.line || '#d4c4a8'} strokeWidth="0.6" />
            </g>
            <g className="bp-window" opacity="0.5">
              <line x1="300" y1="40" x2="340" y2="40" stroke={content.theme.line || '#d4c4a8'} strokeWidth="1.2" />
              <line x1="300" y1="43" x2="340" y2="43" stroke={content.theme.line || '#d4c4a8'} strokeWidth="0.6" />
            </g>

            {/* Furniture outlines */}
            {/* Sofa in living room */}
            <rect className="bp-furniture" x="60" y="80" width="40" height="20" fill="none" stroke={content.theme.line || '#d4c4a8'} strokeWidth="0.8" opacity="0.4" />
            {/* Dining table in kitchen */}
            <ellipse className="bp-furniture" cx="220" cy="90" rx="18" ry="12" fill="none" stroke={content.theme.line || '#d4c4a8'} strokeWidth="0.8" opacity="0.4" />
            {/* Bed in bedroom */}
            <rect className="bp-furniture" x="280" y="200" width="50" height="30" fill="none" stroke={content.theme.line || '#d4c4a8'} strokeWidth="0.8" opacity="0.4" />
            {/* Desk in study */}
            <rect className="bp-furniture" x="190" y="220" width="30" height="15" fill="none" stroke={content.theme.line || '#d4c4a8'} strokeWidth="0.8" opacity="0.4" />
            {/* Plant in balcony */}
            <circle className="bp-furniture" cx="300" cy="90" r="6" fill="none" stroke={content.theme.line || '#d4c4a8'} strokeWidth="0.8" opacity="0.4" />

            {/* Dimension lines */}
            <g className="bp-dimension" opacity="0.3">
              <line x1="40" y1="30" x2="360" y2="30" stroke={content.theme.accent || '#f3cf8a'} strokeWidth="0.5" markerEnd="url(#arrow)" />
              <text x="200" y="26" fill={content.theme.accent || '#f3cf8a'} fontSize="6" textAnchor="middle" fontFamily="monospace">
                32'-0"
              </text>
            </g>

            {/* North arrow */}
            <g className="bp-dimension" opacity="0.5">
              <path d="M 25 25 L 25 15 L 23 17 M 25 15 L 27 17" fill="none" stroke={content.theme.accent || '#f3cf8a'} strokeWidth="0.6" />
              <text x="25" y="12" fill={content.theme.accent || '#f3cf8a'} fontSize="5" textAnchor="middle" fontFamily="serif">
                N
              </text>
            </g>

            {/* Title block */}
            <g className="bp-title-block" opacity="0.7">
              <rect x="300" y="265" width="80" height="30" fill="none" stroke={content.theme.line || '#d4c4a8'} strokeWidth="0.5" />
              <line x1="300" y1="272" x2="380" y2="272" stroke={content.theme.line || '#d4c4a8'} strokeWidth="0.3" />
              <line x1="300" y1="279" x2="380" y2="279" stroke={content.theme.line || '#d4c4a8'} strokeWidth="0.3" />
              <line x1="300" y1="286" x2="380" y2="286" stroke={content.theme.line || '#d4c4a8'} strokeWidth="0.3" />
              <text x="303" y="270" fill={content.theme.line || '#d4c4a8'} fontSize="4.5" fontFamily="monospace">
                {content.titleBlock.project || ''}
              </text>
              <text x="303" y="277" fill={content.theme.line || '#d4c4a8'} fontSize="4.5" fontFamily="monospace">
                {content.titleBlock.drawnFor || ''}
              </text>
              <text x="303" y="284" fill={content.theme.line || '#d4c4a8'} fontSize="4.5" fontFamily="monospace">
                {content.titleBlock.date || ''}
              </text>
              <text x="303" y="291" fill={content.theme.line || '#d4c4a8'} fontSize="4.5" fontFamily="monospace">
                {content.titleBlock.sheet || ''}
              </text>
            </g>

            {/* Clickable room regions */}
            {rooms.map((room, idx) => {
              const positions = {
                living: { x: 40, y: 140, w: 140, h: 120 },
                kitchen: { x: 180, y: 40, w: 80, h: 100 },
                balcony: { x: 260, y: 40, w: 100, h: 100 },
                bedroom: { x: 180, y: 180, w: 180, h: 80 },
                study: { x: 180, y: 180, w: 80, h: 80 },
                entrance: { x: 40, y: 40, w: 140, h: 100 },
              };
              const pos = positions[room.id] || { x: 50, y: 50, w: 80, h: 60 };
              const isOpened = openedRooms.has(room.id);

              return (
                <g key={room.id} className="bp-room-group">
                  <rect
                    className={`bp-room ${isOpened ? 'bp-room--opened' : ''}`}
                    x={pos.x}
                    y={pos.y}
                    width={pos.w}
                    height={pos.h}
                    fill={isOpened ? 'rgba(243, 207, 138, 0.08)' : 'transparent'}
                    stroke="transparent"
                    strokeWidth="2"
                    onClick={() => openRoom(room)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openRoom(room);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${room.name}: ${room.title}`}
                    style={{ cursor: 'pointer' }}
                  />
                  <text
                    className="bp-room-label"
                    x={pos.x + pos.w / 2}
                    y={pos.y + pos.h / 2}
                    fill={content.theme.line || '#d4c4a8'}
                    fontSize="8"
                    fontFamily="var(--hand)"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    pointerEvents="none"
                    opacity="0.6"
                  >
                    {room.name}
                  </text>
                </g>
              );
            })}

            {/* Finale stamp */}
            {showFinale && (
              <g className="bp-finale-stamp">
                <text x="200" y="150" fill={content.theme.accent || '#f3cf8a'} fontSize="10" textAnchor="middle" fontFamily="var(--hand)" opacity="0.8">
                  {content.finale}
                </text>
              </g>
            )}
          </svg>

          {!REDUCED && <div className="bp-hint hint">{content.hint}</div>}
          {rooms.length > 0 && (
            <div className="bp-progress">
              {openedRooms.size} / {rooms.length} {content.progress}
            </div>
          )}
        </div>

        {/* Paint chip palette */}
        {palette.length > 0 && (
          <div className="bp-palette" role="list" aria-label="Color palette">
            {palette.map((swatch) => {
              const isFlipped = flippedSwatch === swatch.code;
              return (
                <button
                  key={swatch.code}
                  type="button"
                  className={`bp-swatch ${isFlipped ? 'bp-swatch--flipped' : ''}`}
                  onClick={() => flipSwatch(swatch)}
                  aria-label={`${swatch.name}, ${swatch.caption}`}
                  style={{ '--swatch-color': swatch.hex || '#f3cf8a' }}
                >
                  <div className="bp-swatch-inner">
                    <div className="bp-swatch-front">
                      <div className="bp-swatch-color" style={{ backgroundColor: swatch.hex || '#f3cf8a' }} />
                      <div className="bp-swatch-info">
                        <span className="bp-swatch-name">{swatch.name || ''}</span>
                        <span className="bp-swatch-code">{swatch.code || ''}</span>
                        <span className="bp-swatch-caption">{swatch.caption || ''}</span>
                      </div>
                    </div>
                    <div className="bp-swatch-back">
                      <p>{swatch.memory || ''}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="bp-nav">
          <MagneticButton variant="link" onClick={() => goTo('message', 'night')} sound="soft">
            {content.next}
          </MagneticButton>
        </div>
      </div>

      {activeRoom && (
        <MemoryCard room={activeRoom} onClose={closeRoom} onNext={nextRoom} onPrev={prevRoom} currentIndex={currentRoomIndex} totalRooms={rooms.length} />
      )}
    </Scene>
  );
}
