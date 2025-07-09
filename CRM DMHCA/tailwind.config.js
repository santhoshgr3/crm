/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#fbeaec',
          100: '#f5cfd3',
          200: '#e99fa7',
          300: '#de6f7b',
          400: '#d23f4f',
          500: '#b71c2b', // thick maroon/red
          600: '#921622',
          700: '#6d1019',
          800: '#480a10',
          900: '#230508',
        },
        red: {
          600: '#b71c2b', // thick red
        },
      },
    },
  },
  plugins: [],
};
