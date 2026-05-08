/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          base: '#0A0A0A',
          surface: '#121212',
          deep: '#0e0e0e',
        },
        text: {
          primary: '#ffffff',
          secondary: '#c4c7c8',
          muted: '#8e9192',
        },
        accent: {
          red: '#8b1919',
          highlight: '#ffb3ac',
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
