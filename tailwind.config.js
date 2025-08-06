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
    'grid', 'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'gap-4', 'gap-6', 'gap-8',
    'sm:grid-cols-1', 'sm:grid-cols-2', 'sm:grid-cols-3',
    'md:grid-cols-1', 'md:grid-cols-2', 'md:grid-cols-3',
    'lg:grid-cols-1', 'lg:grid-cols-2', 'lg:grid-cols-3',
    'w-16', 'w-[60px]', 'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl',
    'sm:text-xs', 'sm:text-sm', 'sm:text-base', 'sm:text-lg', 'sm:text-xl', 'sm:text-2xl', 'sm:text-3xl',
    'md:text-xs', 'md:text-sm', 'md:text-base', 'md:text-lg', 'md:text-xl', 'md:text-2xl', 'md:text-3xl',
    'lg:text-xs', 'lg:text-sm', 'lg:text-base', 'lg:text-lg', 'lg:text-xl', 'lg:text-2xl', 'lg:text-3xl',
    'h-[32px]', 'max-w-[1600px]', 'w-[1600px]', 'px-2', 'px-4', 'px-6', 'py-1', 'py-2', 'py-4',
    'hidden', 'block', 'sm:hidden', 'sm:block', 'md:hidden', 'md:block', 'lg:hidden', 'lg:block',
    'flex', 'flex-col', 'flex-row', 'sm:flex', 'md:flex', 'lg:flex',
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

