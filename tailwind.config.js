/* tailwind.config.js*/

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './styles/**/*.css',
  ],
  safelist: [
    'grid', 'grid-cols-3', 'grid-cols-1', 'gap-8',
    'w-16', 'text-xl', 'h-[32px]', 'max-w-[1600px]', 'w-[1600px]',
  ],
  theme: {
    extend: {
      /* ──────────────────────────────── */
      /* цвета, фоны                     */
      /* ──────────────────────────────── */
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic' :
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: '#536C4A',
        accent : '#B0BF93',
      },

      /* ──────────────────────────────── */
      /* анимации дыма                    */
      /* ──────────────────────────────── */
      keyframes: {
        /* Жевание: рот открывается/закрывается */
    pacChomp: {
      '0%,100%': { clipPath: 'polygon(50% 50%,100% 0,100% 100%)' },
      '50%'    : { clipPath: 'polygon(50% 50%,100% 40%,100% 60%)' },
    },
    /* Путь в форме «─ then │» */
    pacPath: ({ theme }) => ({
      /* ① старт вне экрана слева  */
      '0%'  : { transform: 'translate(-40px, 0)' },
      /* ② прибежал к началу вертикальной линии */
      /*   bottom-line длиной 1570 px; vertical-line стоит на х = 111% of page */
      '60%' : { transform: 'translate(calc(1570px - 40px), 0)' },
      /* небольшая задержка перед поворотом */
      '65%' : { transform: 'translate(calc(1570px - 40px), 0) rotate(0deg)' },
      /* ③ карабкается вверх по вертикали (высота ≈ 900 px) */
      '100%': { transform: 'translate(calc(1570px - 40px), -900px) rotate(-90deg)' },
    }),
        breath: {
          '0%,100%': { transform: 'scale(1)',           opacity: .8 },
          '50%'    : { transform: 'scale(1.35)',        opacity: 1  },
        },
        breathLeaf: {
          '0%,100%': { transform: 'scale(1) rotate(0deg)',  opacity: .8 },
          '50%'    : { transform: 'scale(1.25) rotate(-8deg)', opacity: 1 },
        },
      },
      animation: {
        breath    : 'breath 1.8s ease-in-out infinite',
        breathLeaf: 'breathLeaf 1.8s ease-in-out infinite',
        pacChomp: 'pacChomp .3s linear infinite',
    pacPath : 'pacPath 14s linear infinite',
      },
    },
  },
  plugins: [],
};