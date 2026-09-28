import React, { useEffect, useRef } from 'react';
import { sky } from '../lib/sky';

export default function StarField() {
  const ref = useRef(null);
  useEffect(() => {
    sky.attach(ref.current);
    return () => sky.detach();
  }, []);
  return <canvas ref={ref} className="starfield" aria-hidden="true" />;
}
