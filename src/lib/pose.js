/** Swap which pose image is visible inside a <Character poses=[...]>. */
export function setPose(charEl, name) {
  if (!charEl) return;
  charEl.querySelectorAll('.char__img').forEach((img) => {
    img.classList.toggle('is-on', img.dataset.pose === name);
  });
}

export function setFlip(charEl, on) {
  charEl?.querySelector('.char__flip')?.classList.toggle('is-flipped', on);
}
