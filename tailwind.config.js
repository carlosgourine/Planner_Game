/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'press-start': ['"Press Start 2P"', 'cursive'],
      },
      colors: {
        wolf: '#4a5d23', // Forest green
        tiger: '#d48817', // Orange
        lion: '#e6c229', // Gold
        bear: '#2c3e50', // Dark Blue/Grey
        dragon: '#8e44ad', // Purple
      },
    },
  },
  plugins: [],
}
