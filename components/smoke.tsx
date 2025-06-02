'use client';
import { useEffect, useState } from 'react';

interface Wisp {
  id: number;
  x: number;       // 0–100 (% по ширине)
  delay: number;   // сек до запуска animation
}

export default function Smoke() {
  const [wisps, setWisps] = useState<Wisp[]>([]);

  // helper — создаём 2-3 новых струйки
  const spawn = () => {
    const count = 2 + Math.floor(Math.random() * 2); // 2 или 3
    const now = Date.now();
    setWisps(
      Array.from({ length: count }, (_, i) => ({
        id: now + i,
        x: Math.random() * 100,         // % ширины
        delay: Math.random() * 6,       // разброс старта 0-6 с
      }))
    );
  };

  useEffect(() => {
    spawn();                            // первый запуск
    const t = setInterval(spawn, 30000 + Math.random() * 20000); // каждые 30-50 с
    return () => clearInterval(t);
  }, []);

  return (
    <div className="smoke-container">
      {wisps.map((w) => (
        <span
          key={w.id}
          style={{
            left: `${w.x}%`,
            animationDelay: `${w.delay}s`,
          }}
          className="smoke-wisp"
        />
      ))}
    </div>
  );
}