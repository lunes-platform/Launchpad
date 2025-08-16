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
          DEFAULT: '#9469FF',
          50: '#F3EFFF',
          100: '#E7DEFF',
          200: '#D0BEFF',
          300: '#B89EFF',
          400: '#A17EFF',
          500: '#9469FF',
          600: '#7C3AED',
          700: '#6B21A8',
          800: '#581C87',
          900: '#4C1D95',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        title: ['Space Grotesk', 'sans-serif'],
      },
      borderRadius: {
        'card': '1.5rem',
        'button': '1rem',
        'input': '0.75rem',
        'badge': '9999px',
        'modal': '2rem',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'cardHover': '0 8px 32px rgba(0, 0, 0, 0.6)',
        'modal': '0 20px 60px rgba(0, 0, 0, 0.8)',
        'glow': '0 0 20px rgba(148, 105, 255, 0.3)',
        'glowHover': '0 0 30px rgba(148, 105, 255, 0.5)',
        'button': '0 4px 16px rgba(148, 105, 255, 0.2)',
        'buttonHover': '0 6px 20px rgba(148, 105, 255, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(148, 105, 255, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(148, 105, 255, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}