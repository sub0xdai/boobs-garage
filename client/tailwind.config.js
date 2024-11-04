/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Add this line
  theme: {
    extend: {
      colors: {
        'mauve': {  
          200: '#D1B3C4',
          600: '#7D5D75',
        },
        // Add dark mode specific colors if you want
        dark: {
          'bg': '#1a1a1a',
          'text': '#ffffff',
          'accent': '#D1B3C4',
        },
        light: {
          'bg': '#ffffff',
          'text': '#1a1a1a',
          'accent': '#7D5D75',
        }
      },
    },
  },
  plugins: [],
}
