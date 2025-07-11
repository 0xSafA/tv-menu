'use client';
import { useEffect, useRef, useState } from 'react';

const directions = [
  { dx: 1, dy: 0, angle: 0 },     // right
  { dx: -1, dy: 0, angle: 180 },  // left
  { dx: 0, dy: 1, angle: 90 },    // down
  { dx: 0, dy: -1, angle: -90 },  // up
];

export default function PacmanTrail() {
  const pacmanRef = useRef<SVGSVGElement>(null);
  const [trail, setTrail] = useState<{ x: number; y: number; angle: number; id: number }[]>([]);

  function getOffsetByAngle(angle: number) {
  switch (angle) {
    case 0:     return 'translate(-95px, 0)';  // → вправо
    case 180:   return 'translate(95px, 0)';   // ← влево
    case 90:    return 'translate(0, -70px)';  // ↓ вниз
    case -90:   return 'translate(0, 70px)';   // ↑ вверх
    default:    return 'translate(-95px, 0)';
  }
}

  useEffect(() => {
    const pacman = pacmanRef.current;
    if (!pacman) return;

    let x = 100;
    let y = 100;
    let dirIndex = 0;
    let angle = 0;
    let lastId = 0;

    const size = 60;
    const speed = 1;
    const maxW = window.innerWidth - size;
    const maxH = window.innerHeight - size;

    const interval = setInterval(() => {
      let attempts = 0;
      let chosen = false;
      let dir = directions[dirIndex];

      while (attempts < 10 && !chosen) {
        const nextX = x + dir.dx * speed;
        const nextY = y + dir.dy * speed;

        if (nextX >= 0 && nextX <= maxW && nextY >= 0 && nextY <= maxH) {
          chosen = true;
          break;
        }

        dirIndex = Math.floor(Math.random() * directions.length);
        dir = directions[dirIndex];
        attempts++;
      }

      // fallback: если не нашли новое направление — идём назад
      if (!chosen) {
        dirIndex = (dirIndex + 2) % directions.length;
        dir = directions[dirIndex];
      }

      x += dir.dx * speed;
      y += dir.dy * speed;
      angle = dir.angle;

      pacman.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;

      setTrail(prev => [...prev.slice(-350), { x, y, angle, id: lastId++ }]);
    }, 25); // 40 FPS

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {trail.map(({ x, y, angle, id }) => {

  return (
    <div
  key={id}
  className="fixed w-[135px] h-[45px] bg-white opacity-15 rounded-sm pointer-events-none transition-opacity duration-1000 z-[998]"
  style={{
    transform: `translate(${x}px, ${y}px) rotate(${angle}deg) ${getOffsetByAngle(angle)}`,
    transformOrigin: 'center center',
  }}
/>
  );
})}
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