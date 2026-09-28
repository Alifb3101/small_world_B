import React, { useEffect, useRef } from 'react';
import { fx } from '../lib/fx';

export default function ParticleField() {
  const ref = useRef(null);
  useEffect(() => {
    fx.attach(ref.current);
    return () => fx.detach();
  }, []);
  return <canvas ref={ref} className="particles" aria-hidden="true" />;
}
