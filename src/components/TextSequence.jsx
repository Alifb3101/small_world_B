import React, { useEffect, useRef, useState } from 'react';
import AnimatedText from './AnimatedText';

/**
 * Reveals lines one after another, with a pause ("hold") after each.
 * Lines already read can dim so the eye stays on the newest one.
 */
export default function TextSequence({ lines, play, onDone, className = '', dimPast = false, lineClass = '' }) {
  const [step, setStep] = useState(-1);
  const timers = useRef([]);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (play && step === -1) setStep(0);
  }, [play, step]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const next = (i, hold) => {
    timers.current.push(
      setTimeout(() => {
        if (i === lines.length - 1) doneRef.current?.();
        else setStep((s) => Math.max(s, i + 1));
      }, hold ?? 700),
    );
  };

  return (
    <div className={`tseq ${className}`}>
      {lines.map((l, i) => (
        <AnimatedText
          key={i}
          as="p"
          text={l.text}
          split={l.split || 'words'}
          variant={l.variant || 'blur'}
          play={step >= i}
          className={`tseq__line ${lineClass} ${l.big ? 'is-big' : ''} ${l.className || ''} ${
            dimPast && step > i ? 'is-past' : ''
          }`}
          onDone={() => next(i, l.hold)}
        />
      ))}
    </div>
  );
}
