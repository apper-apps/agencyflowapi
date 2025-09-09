/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          500: '#4F46E5',
          600: '#4338ca',
          700: '#3730a3'
        },
        secondary: {
          50: '#faf5ff',
          500: '#7C3AED',
          600: '#7c2d92'
        },
        accent: {
          50: '#fffbeb',
          500: '#F59E0B',
          600: '#d97706'
        },
        success: {
          50: '#ecfdf5',
          500: '#10B981',
          600: '#059669'
        },
        warning: {
          50: '#fffbeb',
          500: '#F59E0B',
          600: '#d97706'
        },
        error: {
          50: '#fef2f2',
          500: '#EF4444',
          600: '#dc2626'
        },
        info: {
          50: '#eff6ff',
          500: '#3B82F6',
          600: '#2563eb'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}