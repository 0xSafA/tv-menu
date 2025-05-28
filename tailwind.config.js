import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './layouts/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],

  theme: {
    extend: {
      /* ---------- шрифты ---------- */
      fontFamily: {
        display : ['var(--font-bebas)',      'sans-serif'],
        heading : ['var(--font-montserrat)', 'sans-serif'],
        body    : ['var(--font-inter)',      'sans-serif'],
        sans    : ['Inter',                  'sans-serif'], // общий UI
      },

      /* ---------- цвета ---------- */
      colors: {
        primary        : 'var(--color-primary)',
        'primary-light': 'var(--color-primary-light)',
        'primary-dark' : 'var(--color-primary-dark)',
        bg    : 'var(--color-bg)',
        text  : 'var(--color-text)',
        muted : 'var(--color-muted)',

        brand: {
          dark : '#536C4A', // основной зелёный
          light: '#B0BF93', // светло-зелёный
        },

        strain: {
          hybrid: '#4F92FF', // синий кружок
          sativa: '#FF6137', // оранжевый
          indica: '#2ECC40', // зелёный
        },
      },

      /* ---------- анимации ---------- */
      keyframes: {
        slowPulse: {
          '0%,100%': { transform: 'scale(1)'   },
          '50%'    : { transform: 'scale(1.07)'},
        },
        slideIn: {
          '0%'  : { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)',    opacity: 1 },
        },
      },
      animation: {
        slowPulse: 'slowPulse 3s ease-in-out infinite',
        slideIn  : 'slideIn 0.6s ease-out forwards',
      },
    },
  },

  plugins: [],
};

export default config;
