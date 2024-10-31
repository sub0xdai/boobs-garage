/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mauve': {  
          200: '#D1B3C4',
          600: '#7D5D75',
        },
      },
    },
  },
  plugins: [],
}
