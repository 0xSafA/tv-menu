import { useEffect, useRef, useState } from 'react';

// Настройки
const TRAIL_LENGTH = 100; // 👈 длина следа
const MOVE_INTERVAL = 80; // 👈 скорость движения (мс)
const FADE_DURATION = 2000; // 👈 затухание следа (мс)
const STEP_SIZE = 8;
const DIRECTIONS = [
  { x: 1, y: 0 },   // вправо
  { x: 0, y: 1 },   // вниз
  { x: -1, y: 0 },  // влево
  { x: 0, y: -1 },  // вверх
];

export default function PacmanWithTrail() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [angle, setAngle] = useState(0);
  const [trail, setTrail] = useState<{ x: number; y: number; time: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = () => {
      const container = containerRef.current;
      if (!container) return;

      const maxX = container.offsetWidth - 48; // ширина Pacman
      const maxY = container.offsetHeight - 48;

      const dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      const dx = dir.x * STEP_SIZE;
      const dy = dir.y * STEP_SIZE;

      setPosition(prev => {
        const newX = Math.max(0, Math.min(prev.x + dx, maxX));
        const newY = Math.max(0, Math.min(prev.y + dy, maxY));

        setAngle(dirToAngle(dir));
        setTrail(prevTrail => [...prevTrail.slice(-TRAIL_LENGTH), { x: newX, y: newY, time: Date.now() }]);

        return { x: newX, y: newY };
      });
    };

    const interval = setInterval(move, MOVE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen overflow-hidden">
      {/* след */}
      {trail.map((pt, i) => {
        const age = Date.now() - pt.time;
        const opacity = 1 - age / FADE_DURATION;
        if (opacity <= 0) return null;
        return (
          <div
            key={i}
            className="absolute bg-white"
            style={{
              width: 48,
              height: 48,
              left: pt.x,
              top: pt.y,
              opacity,
              transition: `opacity ${FADE_DURATION}ms linear`,
              pointerEvents: 'none',
            }}
          />
        );
      })}

      {/* Pacman */}
      <svg
        className="absolute w-12 h-12 z-50"
        style={{
          left: position.x,
          top: position.y,
          transform: `rotate(${angle}deg)`
        }}
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
              <animate attributeName="fill" values="black;black;black" dur="0.6s" repeatCount="indefinite" />
            </path>
          </mask>
        </defs>

        <circle cx="50" cy="50" r="50" fill="#B0BF93" mask="url(#mouth)" />
        <circle cx="43" cy="22" r="8" fill="#536C4A" />
      </svg>
    </div>
  );
}

function dirToAngle(dir: { x: number; y: number }) {
  if (dir.x === 1) return 0;
  if (dir.y === 1) return 90;
  if (dir.x === -1) return 180;
  if (dir.y === -1) return 270;
  return 0;
}