/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{ts,tsx}",      // 👈 вместо app/
    "./components/**/*.{ts,tsx}", // общий UI
    "./layouts/**/*.{ts,tsx}"     // если вынесем layouts
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-bebas)", "sans-serif"],
        heading: ["var(--font-montserrat)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      colors: {
        primary:        "var(--color-primary)",
        "primary-light":"var(--color-primary-light)",
        "primary-dark": "var(--color-primary-dark)",
        bg:             "var(--color-bg)",
        text:           "var(--color-text)",
        muted:          "var(--color-muted)",
      },
      keyframes: {
        slowPulse: {
          "0%,100%": { transform: "scale(1)"   },
          "50%"    : { transform: "scale(1.07)"}
        },
        slideIn: {
          "0%"  : { transform: "translateY(20px)", opacity: 0 },
          "100%": { transform: "translateY(0)",    opacity: 1 },
        },
      },
      animation: {
        slowPulse: "slowPulse 3s ease-in-out infinite",
        slideIn  : "slideIn 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};