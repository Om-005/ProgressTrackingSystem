/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: {
          light: '#f8fafc',
          dark: '#0B1120',
        },
        surface: {
          light: '#ffffff',
          dark: '#111827',
        },
        brand: {
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
        },
        accent: {
          500: '#06b6d4',
        }
      }
    },
  },
  plugins: [],
}
