// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './styles/**/*.css',
  ],
  safelist: [
    'grid',
    'grid-cols-3',
    'grid-cols-1',
    'gap-8',
    'w-16',
    'text-xl',
    'h-[32px]',
    'max-w-[1600px]',
    'w-[1600px]',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: '#536C4A',
        accent: '#B0BF93',
      },
      extend: {
        keyframes: {
          /* подъём на 160 % контейнера (выезжает за верх) */
          smokeStream: {
            '0%': { transform: 'translateY(0) rotate(0deg)', opacity: 0 },
            '10%': { opacity: 0.7 },
            '90%': { opacity: 0.4 },
            '100%': { transform: 'translateY(-160%) rotate(3deg)', opacity: 0 }
          },
          breath: {
            '0%,100%': { transform: 'scale(1)', opacity: 0.8 },
            '50%': { transform: 'scale(1.35)', opacity: 1 },
          },
          breathLeaf: {
            '0%,100%': { transform: 'scale(1) rotate(0deg)', opacity: 0.8 },
            '50%': { transform: 'scale(1.25) rotate(-8deg)', opacity: 1 },
          },
          /* мелкий маятник ±6 px ←→ */
          smokeSway: {
            '0%,100%': { transform: 'translateX(0)' },
            '50%': { transform: 'translateX(6px)' }
          }
        },
        animation: {
          smokeStream: 'smokeStream 12s linear forwards',
          smokeSway: 'smokeSway 3s ease-in-out infinite',
          breath: 'breath 1.8s ease-in-out infinite',
        breathLeaf: 'breathLeaf 1.8s ease-in-out infinite',
        }
      }
    },
  },
  plugins: [],
};
