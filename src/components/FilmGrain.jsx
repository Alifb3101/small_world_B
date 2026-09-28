import React, { useEffect, useRef } from 'react';

function noiseTile(size = 128) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const img = g.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = (Math.random() * 255) | 0;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  return c.toDataURL('image/png');
}

export default function FilmGrain() {
  const grain = useRef(null);
  useEffect(() => {
    grain.current.style.backgroundImage = `url(${noiseTile()})`;
  }, []);
  return (
    <>
      <div className="vignette" aria-hidden="true" />
      <div className="grain" ref={grain} aria-hidden="true" />
    </>
  );
}
