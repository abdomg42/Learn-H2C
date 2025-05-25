/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",         // ✅ si tu utilises Tailwind dans le HTML
    "./src/**/*.{js,jsx,ts,tsx}",  // ✅ si tu utilises Tailwind dans React
  ],
  darkMode: 'class', // Enable dark mode
  theme: {
    extend: {
      animation: {
        'marquee': 'marquee 20s linear infinite',
        'marquee2': 'marquee2 20s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
  plugins: [],
};
