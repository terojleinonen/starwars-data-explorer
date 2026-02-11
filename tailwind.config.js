// FILE: tailwind.config.js
// Clean, corrected Tailwind config for your premium SWAPI UI

module.exports = {
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        orbitron: ["Orbitron", sans-serif]
      },
    },
  },
  plugins: [],
};
// --- END OF FILE ---