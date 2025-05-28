import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './layouts/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],

  safelist: [
    'bg-brand-dark',
    'bg-brand-light',
    'bg-strain-indica',
    'bg-strain-sativa',
    'bg-strain-hybrid',
  ],

  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-bebas)', 'sans-serif'],
        heading: ['var(--font-montserrat)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: 'var(--color-primary)',
        'primary-light': 'var(--color-primary-light)',
        'primary-dark': 'var(--color-primary-dark)',
        bg: 'var(--color-bg)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',

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
      keyframes: {
        slowPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.07)' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      animation: {
        slowPulse: 'slowPulse 3s ease-in-out infinite',
        slideIn: 'slideIn 0.6s ease-out forwards',
      },
    },
  },

  plugins: [],
};

export default config;
