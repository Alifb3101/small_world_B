import React, { forwardRef } from 'react';

const CRACKS = [
  'M50 50 L38 30 L42 18 L30 4',
  'M50 50 L66 40 L74 46 L94 34',
  'M50 50 L56 66 L48 78 L54 96',
  'M50 50 L32 58 L20 54 L4 64',
];

/** A classic cartoon thought bubble, with cracks waiting to happen. */
const ThoughtBubble = forwardRef(function ThoughtBubble({ text, size = 'md', onPop, style }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      className={`thought thought--${size}`}
      style={style}
      onClick={onPop}
      data-nofx
      aria-label={`Pop the thought: ${text}`}
    >
      <span className="thought__body">
        <span className="thought__text">{text}</span>
        <svg className="thought__cracks" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {CRACKS.map((d, i) => (
            <path key={i} d={d} pathLength="1" className="thought__crack" />
          ))}
        </svg>
        <span className="thought__tail thought__tail--1" />
        <span className="thought__tail thought__tail--2" />
      </span>
    </button>
  );
});

export default ThoughtBubble;
