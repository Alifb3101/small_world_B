import React, { forwardRef } from 'react';

export const charSrc = (name) => `/characters/${name}.png`;

/**
 * A real Tom & Jerry cut-out, lit to sit inside the night scenes.
 * Structure: wrapper (GSAP moves this) > flip layer > img (CSS idle loop).
 */
const Character = forwardRef(function Character(
  { name, alt = '', className = '', idle = 'none', flip = false, shadow = true, eager = false, onClick, style, children, poses },
  ref,
) {
  const interactive = !!onClick;
  return (
    <div
      ref={ref}
      className={`char char--${idle} ${interactive ? 'is-tappable' : ''} ${className}`}
      style={style}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? alt : undefined}
      onKeyDown={interactive ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick(e) : undefined}
    >
      {shadow && <span className="char__shadow" aria-hidden="true" />}
      <div className={`char__flip ${flip ? 'is-flipped' : ''}`}>
        <div className="char__idle">
          {poses ? (
            poses.map((p) => (
              <img
                key={p}
                data-pose={p}
                className={`char__img ${p === name ? 'is-on' : ''}`}
                src={charSrc(p)}
                alt={p === name ? alt : ''}
                loading={eager ? 'eager' : 'lazy'}
                decoding="async"
                draggable="false"
              />
            ))
          ) : (
            <img
              className="char__img is-on"
              src={charSrc(name)}
              alt={alt}
              loading={eager ? 'eager' : 'lazy'}
              decoding="async"
              draggable="false"
            />
          )}
        </div>
      </div>
      {children}
    </div>
  );
});

export default Character;
