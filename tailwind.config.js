/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'airbnb-primary': '#FF5A5F',
        'airbnb-secondary': '#00A699',
        'airbnb-dark': '#484848',
        'airbnb-light': '#767676',
        'airbnb-bg': '#F7F7F7',
        'airbnb-success': '#008489',
        'airbnb-warning': '#FFB400',
        'airbnb-error': '#FF385C',
      },
      fontFamily: {
        'sans': ['Circular', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 6px 16px rgba(0, 0, 0, 0.12)',
        'nav': '0 2px 4px rgba(0, 0, 0, 0.06)',
        'button': '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}