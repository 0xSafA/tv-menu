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
        smokeRise: {
          '0%'  : { transform: 'translateY(0)   translateX(0)   rotate(0deg)', opacity: 0 },
          '10%' : { opacity: .9 },
          '35%' : { transform: 'translateY(-40%) translateX(4px)  rotate(2deg)' },
          '70%' : { transform: 'translateY(-120%) translateX(-6px) rotate(-2deg)', opacity: .5 },
          '100%': { transform: 'translateY(-220%) translateX(3px)  rotate(1deg)',  opacity: 0 },
        },
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
        smokeRise : 'smokeRise 14s linear forwards',
        breath    : 'breath 1.8s ease-in-out infinite',
        breathLeaf: 'breathLeaf 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};