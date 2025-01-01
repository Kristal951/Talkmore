/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        darkBackground: "#212121e6",
        darkBackground2: "#2d2d2d",
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}