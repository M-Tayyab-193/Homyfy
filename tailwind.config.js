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
        // Enhanced gradient colors
        'primary-gradient-start': '#3b82f6',
        'primary-gradient-end': '#1e40af',
        'accent-gradient-start': '#60a5fa',
        'accent-gradient-end': '#2563eb',
      },
      fontFamily: {
        'sans': ['Circular', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 6px 16px rgba(0, 0, 0, 0.12)',
        'card-hover': '0 12px 28px rgba(0, 0, 0, 0.18)',
        'nav': '0 2px 4px rgba(0, 0, 0, 0.06)',
        'button': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-lg': '0 0 30px rgba(59, 130, 246, 0.4)',
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-shine': 'linear-gradient(110deg, transparent 40%, rgba(255, 255, 255, 0.3) 50%, transparent 60%)',
      },
      backgroundSize: {
        '200': '200% 200%',
        '300': '300% 300%',
      },
      transitionDuration: {
        '2000': '2000ms',
      },
    },
  },
  plugins: [],
}