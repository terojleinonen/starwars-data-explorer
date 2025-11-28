// FILE: tailwind.config.js
// Super-premium Tailwind setup for VisionOS-style UI

module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          light: 'rgba(255,255,255,0.55)',
          dark: 'rgba(15,23,42,0.55)',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass-lg': '0 20px 40px rgba(0,0,0,0.25)',
        'glass-sm': '0 8px 20px rgba(0,0,0,0.15)',
      },
      animation: {
        'float-slow': 'float 12s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(-2px)' },
          '50%': { transform: 'translateY(2px)' },
        },
      },
    },
  },
  plugins: [],
};