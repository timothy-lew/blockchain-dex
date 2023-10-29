/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        baseColor: '#111213',
        primary: '#1A1D1F',
        secondary: '#272A2E',
        tertiary: '#ffffff0f',
        textMain: '#F5F5F7',
        textSecondary: '#A4A5A8',
        buttonBlue: '#007AFF',
        buttonPurple: '#482BFF',
        buttonGreen: '#00A862',
        buttonDarkGreen: '#00AF92',
      }
    },
    fontFamily: {
      'body': ['Play', 'sans-serif'],
    },
  },
  plugins: [],
}

