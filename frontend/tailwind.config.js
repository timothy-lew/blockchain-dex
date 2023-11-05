/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        baseColor: '#192134',
        baseSecondaryColor: '#070815',
        primary: '#1A1D1F',
        secondary: '#272A2E',
        tertiary: '#1f2639',
        textMain: '#F5F5F7',
        textSecondary: '#6c86ad',
        borderColor: '#21273a',
      }
    },
    fontFamily: {
      'body': ['Roboto', '"Helvetica Neue"', 'serif'],
    },
  },
  plugins: [],
}

