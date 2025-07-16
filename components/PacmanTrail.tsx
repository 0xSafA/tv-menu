'use client';
import { useEffect, useRef, useState } from 'react';

export default function PacmanTrail() {
  const pacmanRef = useRef<SVGSVGElement>(null);
  const [trail, setTrail] = useState<{ x: number; y: number; angle: number; id: number }[]>([]);

  function getOffsetByAngle(angle: number) {
    switch (angle) {
      case 0: return 'translate(-155px, 0)';   // → вправо
      case 180: return 'translate(-25px, 0)';  // ← влево
      case 90: return 'translate(0, -70px)';  // ↓ вниз
      case -90: return 'translate(0, 70px)';  // ↑ вверх
      default: return 'translate(-155px, 0)';
    }
  }

  useEffect(() => {
    const pacman = pacmanRef.current;
    if (!pacman) return;

    let x = 100;
    let y = 100;
    let angle = 0;
    let lastId = 0;

    const w = window.innerWidth;
    const h = window.innerHeight;

    const path = [
      { x: 100, y: 100, angle: 0 },
      { x: w - 100, y: 100, angle: 0 },
      { x: w - 100, y: 250, angle: 90 },
      { x: 100, y: 250, angle: 180 },
      { x: 100, y: 400, angle: 90 },
      { x: w - 100, y: 400, angle: 0 },
      { x: w - 100, y: 550, angle: 90 },
      { x: 100, y: 550, angle: 180 },
      { x: 100, y: 700, angle: 90 },
      { x: w / 2, y: 700, angle: 0 },
      { x: w / 2, y: h - 100, angle: 90 },
    ];

    let pathIndex = 1;
    let target = path[pathIndex];
    const speed = 1;

    const interval = setInterval(() => {
      const dx = target.x - x;
      const dy = target.y - y;

  if (Math.abs(dx) < speed && Math.abs(dy) < speed) {
  x = target.x;
  y = target.y;
  pathIndex = (pathIndex + 1) % path.length;
  target = path[pathIndex];
  angle = target.angle;
} else {
  if (x !== target.x) {
    x += speed * Math.sign(dx);
  } else if (y !== target.y) {
    y += speed * Math.sign(dy);
  }
}

      pacman.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;

      setTrail(prev => [...prev.slice(-350), { x, y, angle, id: lastId++ }]);
    }, 25); // ~40 FPS

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {trail.map(({ x, y, angle, id }) => (
        <div
          key={id}
          className="fixed w-[175px] h-[45px] bg-white opacity-15 rounded-sm pointer-events-none transition-opacity duration-1000 z-[998]"
          style={{
            transform: `translate(${x}px, ${y}px) rotate(${angle}deg) ${getOffsetByAngle(angle)}`,
            transformOrigin: 'center center',
          }}
        />
      ))}

      <svg
        ref={pacmanRef}
        className="fixed w-12 h-12 z-[1000] pointer-events-none"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id="mouth">
            <rect width="100" height="100" fill="white" />
            <path>
              <animate
                attributeName="d"
                dur="0.6s"
                repeatCount="indefinite"
                values="
                  M50,50 L100,30 A50,50 0 1,1 100,70 Z;
                  M50,50 L100,48 A50,50 0 1,1 100,52 Z;
                  M50,50 L100,30 A50,50 0 1,1 100,70 Z"
              />
            </path>
          </mask>
        </defs>
        <circle cx="50" cy="50" r="50" fill="#B0BF93" mask="url(#mouth)" />
        <circle cx="40" cy="26" r="9" fill="#536C4A" />
      </svg>
    </>
  );
}