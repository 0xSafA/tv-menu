'use client';

import { useEffect } from 'react';

export default function PacmanTrail() {
  useEffect(() => {
    const pacman = document.querySelector('.pacman') as HTMLElement | null;
    const trail = document.querySelector('.pacman-trail') as HTMLElement | null;

    if (!pacman || !trail) return;

    let x = 0;
    let y = 0;
    let angle = 0;

    function randomStep() {
      // Случайное направление: 0, 90, 180, 270 градусов
      const direction = Math.floor(Math.random() * 4) * 90;
      angle = direction;

      // Длина шага (в пикселях)
      const step = 60;

      // Смещение по направлению
      switch (direction) {
        case 0: x += step; break;       // вправо
        case 90: y -= step; break;      // вверх
        case 180: x -= step; break;     // влево
        case 270: y += step; break;     // вниз
      }

      // Ограничение по краям экрана
      x = Math.max(0, Math.min(window.innerWidth - 60, x));
      y = Math.max(0, Math.min(window.innerHeight - 60, y));

      // Применяем трансформации
      pacman.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
      trail.style.transform = `translate(${x}px, ${y}px)`;

      // Плавное исчезновение следа
      trail.style.opacity = '1';
      setTimeout(() => {
        if (trail) trail.style.opacity = '0';
      }, 2000); // исчезает через 2 секунды
    }

    const interval = setInterval(randomStep, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Trail (белый след) */}
      <div
        className="pacman-trail fixed w-12 h-12 bottom-[40px] left-0 bg-white z-[900] pointer-events-none transition-opacity duration-1000 opacity-0"
        style={{ borderRadius: '50%' }}
      />
      
      {/* Pacman */}
      <svg
        className="pacman fixed w-12 h-12 bottom-[40px] left-0 z-[1000] pointer-events-none transition-transform duration-1000"
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
        <circle cx="43" cy="22" r="8" fill="#536C4A" />
      </svg>
    </>
  );
}