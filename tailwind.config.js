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
    'grid', 'grid-cols-3', 'grid-cols-1', 'gap-8',
    'w-16', 'w-[60px]', 'text-xl', 'h-[32px]', 'max-w-[1600px]', 'w-[1600px]',
  ],
  theme: {
    extend: {
      transitionProperty: {
        'transform': 'transform',
        'opacity': 'opacity',
        'all': 'all',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: '#536C4A',
        accent: '#B0BF93',
      },
      keyframes: {
        breath: {
          '0%,100%': { transform: 'scale(1)', opacity: 0.8 },
          '50%': { transform: 'scale(1.35)', opacity: 1 },
        },
        breathLeaf: {
          '0%,100%': { transform: 'scale(1) rotate(0deg)', opacity: 0.8 },
          '50%': { transform: 'scale(1.25) rotate(-8deg)', opacity: 1 },
        },
      },
      animation: {
        breath: 'breath 1.8s ease-in-out infinite',
        breathLeaf: 'breathLeaf 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

