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
          DEFAULT: '#0066FF',
          light: '#3385FF',
          dark: '#0047B3',
        },
        accent: {
          DEFAULT: '#00D4FF',
          light: '#33DEFF',
          dark: '#0099B3',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#D4B96A',
          dark: '#A88730',
        },
        dark: {
          900: '#020810',
          800: '#050A14',
          700: '#0A1628',
          600: '#0F2040',
          500: '#162B52',
          400: '#1E3A6E',
        },
        surface: {
          DEFAULT: '#0A1628',
          light: '#0F2040',
          card: 'rgba(10, 22, 40, 0.8)',
        },
      },
      fontFamily: {
        display: ['Rajdhani', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #020810 0%, #0A1628 50%, #020810 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(10,22,40,0.9) 0%, rgba(15,32,64,0.8) 100%)',
        'blue-glow': 'radial-gradient(ellipse at center, rgba(0,102,255,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(0, 102, 255, 0.4)',
        'glow-cyan': '0 0 20px rgba(0, 212, 255, 0.3)',
        'glow-gold': '0 0 20px rgba(201, 168, 76, 0.4)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 16px 48px rgba(0, 102, 255, 0.2)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
