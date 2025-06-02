/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
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
    { pattern: /grid-cols-\[2fr_2fr_1fr\]/, variants: ['sm', 'lg'] },
  ],
  theme: {
    extend: {
      colors: {
        primary: '#536C4A', // основной зелёный
        accent: '#B0BF93', // светло-зелёный
      },
      keyframes: {
    smokeRise: {
      '0%':   { transform: 'translateY(0) scale(0.8)', opacity: 0.4 },
      '50%':  { opacity: 0.6 },
      '100%': { transform: 'translateY(-160%) scale(1.4)', opacity: 0 },
    },
  },
  animation: {
    smokeRise: 'smokeRise 18s linear forwards',   // 1 «подъём» ≈18 сек
  },
  
    },
  },
  plugins: [],
};
