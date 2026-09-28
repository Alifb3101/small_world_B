import { charSrc } from '../components/Character';

/*
 * Mobile browsers decode lazy images on the main thread the first time they
 * paint, and spin up the media pipeline on the first <video>. Both show up as
 * a dropped second mid-animation, so pay those costs up front, one at a time,
 * while nothing important is moving.
 */

const WORLD_POSES = ['together-hug', 'jerry-dash', 'together-lazy'];
const VIDEOS = ['/clips/rain-city.mp4', '/clips/chase-room.mp4'];

const kept = [];
const idle = (cb) =>
  window.requestIdleCallback ? requestIdleCallback(cb, { timeout: 1200 }) : setTimeout(cb, 120);

function queue(tasks) {
  let i = 0;
  const next = () => {
    if (i >= tasks.length) return;
    const task = tasks[i++];
    idle(() => Promise.resolve(task()).catch(() => {}).finally(next));
  };
  next();
}

function decodeUrl(src) {
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
  kept.push(img);
  return img.decode ? img.decode() : Promise.resolve();
}

function warmVideo(src) {
  return new Promise((resolve) => {
    const v = document.createElement('video');
    v.muted = true;
    v.playsInline = true;
    v.preload = 'auto';
    v.setAttribute('aria-hidden', 'true');
    v.style.cssText = 'position:fixed;left:0;top:0;width:2px;height:2px;opacity:0.01;pointer-events:none;';
    v.src = src;
    document.body.appendChild(v);
    const done = () => {
      v.pause();
      v.remove();
      resolve();
    };
    v.play()
      .then(() => setTimeout(done, 300))
      .catch(done);
    setTimeout(done, 4000);
  });
}

let started = false;

export function warmAssets() {
  if (started) return;
  started = true;
  const domImgs = [...document.querySelectorAll('.story img')];
  const seen = new Set();
  const tasks = [];
  domImgs.forEach((img) => {
    const src = img.currentSrc || img.src;
    if (!src || seen.has(src)) return;
    seen.add(src);
    tasks.push(() => {
      img.loading = 'eager';
      return img.decode ? img.decode() : null;
    });
  });
  WORLD_POSES.map(charSrc).forEach((src) => {
    const abs = new URL(src, location.href).href;
    if (!seen.has(abs)) tasks.splice(Math.min(4, tasks.length), 0, () => decodeUrl(src));
  });
  tasks.splice(Math.min(2, tasks.length), 0, () => warmVideo(VIDEOS[0]));
  tasks.push(() => warmVideo(VIDEOS[1]));
  queue(tasks);
}
