/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      fontSize: {
        'font-medium': ['1rem', { lineHeight: '1.5' }],
        'font-large': ['1.125rem', { lineHeight: '1.75' }],
        'font-extra-large': ['1.25rem', { lineHeight: '1.75' }],
      },
    },
  },
  plugins: [],
}
