/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          light: '#feb47b',
          dark: '#ff7e5f',
        },
        red: {
          light: '#ff4b2b',
          dark: '#ff416c',
        }
      },
      backgroundImage: {
        'orange-gradient': 'linear-gradient(to right, #ff7e5f, #feb47b)',
        'red-gradient': 'linear-gradient(to right, #ff416c, #ff4b2b)',
      },
      keyframes: {
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'slide-in-left': 'slide-in-left 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
