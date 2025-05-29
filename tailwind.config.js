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
    { pattern: /grid-cols-\[2fr_2fr_1fr\]/, variants: ['sm', 'lg'] },
  ],
  theme: {
    extend: {
      colors: {
        primary: '#536C4A', // основной зелёный
        accent: '#B0BF93', // светло-зелёный
      },
    },
  },
  plugins: [],
};
