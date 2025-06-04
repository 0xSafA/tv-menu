//smoke.tsx
'use client';
import { useEffect, useState } from 'react';

interface Wisp { id:number; x:number; delay:number; }

export default function Smoke() {
  const [wisps, setWisps] = useState<Wisp[]>([]);

  const spawn = () => {
    const count = 2 + Math.floor(Math.random()*2);      // 2–3 струйки
    const now   = Date.now();
    setWisps(
      Array.from({ length: count }, (_, i) => ({
        id: now + i,
        x: Math.random()*100,            // % от ширины экрана
        delay: Math.random()*4           // старт в первые 4 с
      }))
    );
  };

  useEffect(() => {
    spawn();
    const t = setInterval(spawn, 25000);                // волна каждые 25 с
    return () => clearInterval(t);
  }, []);

  return (
    <div className="smoke-container">
      {wisps.map(w => (
        <span
          key={w.id}
          style={{
            left: `${w.x}%`,
            animationDelay: `${w.delay}s`
          }}
          className="smoke-wisp"
        />
      ))}
    </div>
  );
}