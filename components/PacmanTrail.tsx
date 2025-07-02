'use client';
import { useEffect, useRef, useState } from 'react';

const directions = [
  { dx: 1, dy: 0, angle: 0 }, // right
  { dx: -1, dy: 0, angle: 180 }, // left
  { dx: 0, dy: 1, angle: 90 }, // down
  { dx: 0, dy: -1, angle: -90 }, // up
];

export default function PacmanTrail({ text }: { text: string }) {
  const pacmanRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [trail, setTrail] = useState<
    { x: number; y: number; angle: number; id: number }[]
  >([]);

  useEffect(() => {
    const pacman = pacmanRef.current;
    const textEl = textRef.current;
    if (!pacman || !textEl) return;

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

      if (!chosen) {
        dirIndex = (dirIndex + 2) % directions.length;
        dir = directions[dirIndex];
      }

      x += dir.dx * speed;
      y += dir.dy * speed;
      angle = dir.angle;

      pacman.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;

      // позиционируем надпись рядом с пакменом
      textEl.style.transform = `translate(${x - 80}px, ${y - 10}px)`;
      textEl.style.transformOrigin = 'left center';

      setTrail((prev) => [...prev.slice(-50), { x, y, angle, id: lastId++ }]);
    }, 25);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Trail */}
      {trail.map(({ x, y, angle, id }) => (
        <div
          key={id}
          className='fixed w-[135px] h-[45px] bg-white opacity-15 rounded-sm pointer-events-none z-[998]'
          style={{
            transform: `translate(${x}px, ${y}px) rotate(${angle}deg) translateX(-68px)`,
            transformOrigin: 'center center',
          }}
        />
      ))}

      {/* Text block (едет за пакменом) */}
      <div
        ref={textRef}
        className='fixed z-[999] text-[#536C4A] font-semibold text-[15px] whitespace-nowrap pointer-events-none'
      >
        {text}
      </div>

      {/* Pac-Man */}
      <svg
        ref={pacmanRef}
        className='fixed w-12 h-12 z-[1000] pointer-events-none'
        viewBox='0 0 100 100'
        xmlns='http://www.w3.org/2000/svg'
      >
        <defs>
          <mask id='mouth'>
            <rect width='100' height='100' fill='white' />
            <path>
              <animate
                attributeName='d'
                dur='0.6s'
                repeatCount='indefinite'
                values='
                  M50,50 L100,30 A50,50 0 1,1 100,70 Z;
                  M50,50 L100,48 A50,50 0 1,1 100,52 Z;
                  M50,50 L100,30 A50,50 0 1,1 100,70 Z'
              />
            </path>
          </mask>
        </defs>
        <circle cx='50' cy='50' r='50' fill='#B0BF93' mask='url(#mouth)' />
        <circle cx='40' cy='26' r='9' fill='#536C4A' />
      </svg>
    </>
  );
}
