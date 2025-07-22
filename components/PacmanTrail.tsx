'use client';
import { useEffect, useRef, useState } from 'react';

export default function PacmanTrail() {
  const pacmanRef = useRef<SVGSVGElement>(null);
  const trailRef = useRef<{ x: number; y: number; id: number }[]>([]);
  const [renderTrail, setRenderTrail] = useState<typeof trailRef.current>([]);
  const [angle, setAngle] = useState(0);
  const [position, setPosition] = useState({ x: 100, y: 100 });

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    let x = 100;
    let y = 100;
    let localAngle = 0;
    let lastId = 0;

    const path = [
      { x: 100, y: 100 },
      { x: w - 100, y: 100 },
      { x: w - 100, y: 250 },
      { x: 100, y: 250 },
      { x: 100, y: 400 },
      { x: w - 100, y: 400 },
      { x: w - 100, y: 550 },
      { x: 100, y: 550 },
      { x: 100, y: 700 },
      { x: w / 2, y: 700 },
      { x: w / 2, y: h / 2 },
      { x: w / 2 + 200, y: h / 2 },
      { x: w / 2 + 200, y: h - 100 },
      { x: 100, y: h - 100 },
    ];

    let pathIndex = 1;
    let target = path[pathIndex];
    const speed = 0.4;

    let animationFrame: number;
    const pacmanSize = 48;

    const animate = () => {
      const dx = target.x - x;
      const dy = target.y - y;

      if (Math.abs(dx) < speed && Math.abs(dy) < speed) {
        x = target.x;
        y = target.y;
        pathIndex = (pathIndex + 1) % path.length;
        target = path[pathIndex];

        const nextDx = target.x - x;
        const nextDy = target.y - y;
        if (nextDx !== 0) localAngle = nextDx > 0 ? 0 : 180;
        else if (nextDy !== 0) localAngle = nextDy > 0 ? 90 : -90;
      } else {
        if (x !== target.x) {
          x += speed * Math.sign(dx);
          localAngle = dx > 0 ? 0 : 180;
        } else if (y !== target.y) {
          y += speed * Math.sign(dy);
          localAngle = dy > 0 ? 90 : -90;
        }
      }

      let offsetX = 0;
      let offsetY = 0;

      switch (localAngle) {
        case 0:
          offsetX = -pacmanSize / 4;
          break;
        case 180:
          offsetX = pacmanSize / 4;
          break;
        case 90:
          offsetY = -pacmanSize / 4;
          break;
        case -90:
          offsetY = pacmanSize / 4;
          break;
        default:
          offsetX = -pacmanSize / 4;
      }

      setPosition({ x, y });
      setAngle(localAngle);

      trailRef.current.push({ x: x + offsetX, y: y + offsetY, id: lastId++ });
      if (trailRef.current.length > 370) {
        trailRef.current.shift();
      }

      setRenderTrail([...trailRef.current]);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <>
      {renderTrail.map(({ x, y, id }) => (
        <div
          key={id}
          className="fixed w-[48px] h-[48px] bg-white opacity-20 rounded-full pointer-events-none transition-opacity duration-1000 z-[998]"
          style={{
            transform: `translate(${x}px, ${y}px)`,
            transformOrigin: 'center center',
          }}
        />
      ))}

      <svg
        ref={pacmanRef}
        className="fixed w-12 h-12 z-[1000] pointer-events-none"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transformOrigin: 'center center',
        }}
      >
        <g transform={`rotate(${angle}, 50, 50)`}>
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
        </g>
      </svg>
    </>
  );
}