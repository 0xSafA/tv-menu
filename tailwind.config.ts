import type { Config } from 'tailwindcss';

const config: Config = {
  content: {
    files: [
      './pages/**/*.{ts,tsx}',
      './components/**/*.{ts,tsx}',
      './layouts/**/*.{ts,tsx}',
      './lib/**/*.{ts,tsx}',
    ],
    // @ts-expect-error  — поле появилось в Tailwind 4, но ещё не описано в d.ts
    safelist: [
      'bg-brand-dark',
      'bg-brand-light',
      'bg-strain-indica',
      'bg-strain-sativa',
      'bg-strain-hybrid',
    ],
  },
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#536C4A',
          light: '#B0BF93',
        },
        strain: {
          hybrid: '#4F92FF',
          sativa: '#FF6137',
          indica: '#2ECC40',
        },
      },
    },
  },
  plugins: [],
};

export default config;
