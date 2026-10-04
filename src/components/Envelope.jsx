import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';
import { sfx, stopSong, holdAmbience, releaseAmbience } from '../lib/audio';
import { REDUCED } from '../lib/motion';
import { lockScroll } from '../lib/director';
import { OPEN_WHEN } from '../data/content';

/** A slightly battered envelope with a wax seal. */
export function Envelope({ letter, index, onOpen }) {
  const rot = ((index * 17) % 11) - 5;
  return (
    <button
      type="button"
      className={`env env--${letter.tint}`}
      style={{ '--rot': `${rot}deg`, '--i': index }}
      onClick={(e) => onOpen(letter, e)}
      data-nofx
      aria-label={letter.label}
    >
      <span className="env__back" />
      <span className="env__body">
        <span className="env__lines" />
        <span className="env__label">{letter.label}</span>
      </span>
      <span className="env__flap" />
      <span className="env__seal" aria-hidden="true">
        {letter.seal}
      </span>
    </button>
  );
}

const clipSrc = (file) => (file.startsWith('/') || /^https?:\/\//.test(file) ? file : `/clips/${file}`);

/** A clip taped onto the letter. Hides itself if the file isn't there yet. */
function LetterVideo({ file }) {
  const [failed, setFailed] = useState(false);
  const held = useRef(false);

  const hold = () => {
    if (held.current) return;
    held.current = true;
    holdAmbience();
    stopSong();
  };
  const release = () => {
    if (!held.current) return;
    held.current = false;
    releaseAmbience();
  };

  useEffect(() => release, []);

  if (failed) return null;
  return (
    <video
      className="owc-video"
      // #t=0.1 makes iOS show the first frame instead of a blank box
      src={`${clipSrc(file)}#t=0.1`}
      controls
      playsInline
      preload="metadata"
      onPlay={hold}
      onPause={release}
      onEnded={release}
      onError={() => setFailed(true)}
      data-nofx
    />
  );
}

/** Unfolded paper, handwritten, filling the night. */
export function OpenWhenCard({ letter, onClose }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const env = el.querySelector('.owc-env');
    const flap = el.querySelector('.owc-flap');
    const paper = el.querySelector('.owc-paper');
    sfx.paper();
    const tl = gsap.timeline();
    tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.25 })
      .fromTo(env, { scale: 0.55, y: 40 }, { scale: 1, y: 0, duration: REDUCED ? 0.2 : 0.7, ease: 'expo.out' }, 0)
      .fromTo(flap, { rotateX: 0 }, { rotateX: -168, duration: REDUCED ? 0.2 : 0.7, ease: 'power2.inOut' }, 0.35)
      .fromTo(
        paper,
        { yPercent: 42, scaleY: 0.15, opacity: 0 },
        { yPercent: 0, y: -12, scaleY: 1, opacity: 1, duration: REDUCED ? 0.25 : 0.85, ease: 'power3.out' },
        0.7,
      )
      .call(() => sfx.soft());
    return () => tl.kill();
  }, [letter]);

  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    lockScroll(true, 'letter');
    const onKey = (e) => e.key === 'Escape' && closeRef.current();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      lockScroll(false, 'letter');
    };
  }, []);

  return (
    <div className={`owc${letter.secret ? ' owc--secret' : ''}`} ref={ref} role="dialog" aria-label={letter.label}>
      <button type="button" className="owc-scrim" onClick={onClose} aria-label="Close the letter" data-nofx />
      <button type="button" className="owc-x" onClick={onClose} aria-label="Close the letter" data-nofx>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>
      <div className="owc-env">
        <div className="owc-pocket">
          <div className={`owc-paper owc-paper--${letter.tint}`}>
            {letter.secret && (
              <span className="owc-mark" aria-hidden="true">
                {letter.seal}
              </span>
            )}
            <span className="owc-kicker">{letter.label}</span>
            {letter.video && <LetterVideo file={letter.video} />}
            {letter.body.map((line, i) =>
              line ? (
                <p key={i} className="owc-line">
                  {line}
                </p>
              ) : (
                <br key={i} />
              ),
            )}
          </div>
        </div>
        <div className="owc-flap" />
      </div>
      <button type="button" className="owc-close" onClick={onClose} data-nofx>
        {OPEN_WHEN.closeButton}
      </button>
    </div>
  );
}

/** The closed card under the pile. Same paper as the letters, one size of its own. */
export function FoldedCard({ secret, onOpen }) {
  return (
    <button type="button" className="fold" onClick={onOpen} data-nofx aria-label={`${secret.label}. ${secret.whisper}`}>
      <span className="fold__flap" />
      <span className="fold__seal" aria-hidden="true">
        {secret.seal}
      </span>
      <span className="fold__sheet">
        <span className="fold__kicker">folded</span>
        <span className="fold__title">{secret.label}</span>
        <span className="fold__hint">{secret.whisper}</span>
      </span>
    </button>
  );
}

/** The folded note. Nothing inside it is on the page until the word is right. */
export function SecretGate({ secret, onClose, onUnlock }) {
  const [value, setValue] = useState('');
  const [wrong, setWrong] = useState(false);
  const [shake, setShake] = useState(0);
  const cardRef = useRef(null);
  const inputRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    lockScroll(true, 'seal');
    const focus = setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e) => e.key === 'Escape' && closeRef.current();
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(focus);
      window.removeEventListener('keydown', onKey);
      lockScroll(false, 'seal');
    };
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || !shake) return;
    el.classList.remove('is-shake');
    void el.offsetWidth;
    el.classList.add('is-shake');
  }, [shake]);

  const submit = (e) => {
    e.preventDefault();
    const attempt = value.trim().toLowerCase();
    const answer = String(secret.password || '').trim().toLowerCase();
    if (attempt && attempt === answer) {
      sfx.chime();
      onUnlock();
      return;
    }
    setWrong(true);
    setShake((n) => n + 1);
    sfx.thud();
    inputRef.current?.focus();
  };

  return (
    <div className="seal" role="dialog" aria-modal="true" aria-labelledby="seal-title">
      <button type="button" className="owc-scrim" onClick={onClose} aria-label="Close" data-nofx />
      <button type="button" className="owc-x" onClick={onClose} aria-label="Close" data-nofx>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>
      <form className="fold fold--ask" ref={cardRef} onSubmit={submit}>
        <span className="fold__flap" />
        <span className="fold__seal" aria-hidden="true">
          {secret.seal}
        </span>
        <span className="fold__sheet">
          <span className="fold__kicker">folded</span>
          <h2 id="seal-title" className="fold__title">
            {secret.title}
          </h2>
          <p className="fold__hint">{secret.line}</p>
          <label className="fold__field">
            <span className="sr-only">Password</span>
            <input
              ref={inputRef}
              className="fold__input"
              type="password"
              name="sealed-note"
              value={value}
              placeholder={secret.placeholder}
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="done"
              aria-invalid={wrong || undefined}
              aria-describedby="seal-status"
              onChange={(e) => {
                setValue(e.target.value);
                if (wrong) setWrong(false);
              }}
              data-nofx
            />
          </label>
          <p id="seal-status" className="fold__status" role="status">
            {wrong ? secret.wrong : ''}
          </p>
          <button type="submit" className="fold__go" disabled={!value.trim()} data-nofx>
            {secret.button}
          </button>
        </span>
      </form>
    </div>
  );
}
