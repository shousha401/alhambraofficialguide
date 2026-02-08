import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Legacy aliases (used across app)
        primary: {
          50: '#faf6f1',
          100: '#e8dfd4',
          200: '#d0c7b8',
          300: '#b5a691',
          400: '#9f8b72',
          500: '#8f7864',
          600: '#836558',
          700: '#6d534a',
          800: '#5a4541',
          900: '#4c3b37',
          950: '#1a1614',
        },
        accent: {
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#c4942e',
          600: '#a67c20',
          700: '#854d0e',
        },
        // Alhambra-inspired: terracotta, stone, tile blue, gold
        stone: {
          850: '#2c2622',
          950: '#1a1614',
        },
        terracotta: {
          400: '#c47b5a',
          500: '#b85c3a',
          600: '#9e4a2e',
          700: '#7d3a24',
        },
        tile: {
          400: '#5b8a9e',
          500: '#4a7a8e',
          600: '#3d6577',
          700: '#2d4d5c',
        },
        gold: {
          400: '#d4a853',
          500: '#c4942e',
          600: '#a67c20',
        },
        cream: '#faf6f1',
        sand: '#e8dfd4',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-up-delay': 'fadeInUp 0.6s ease-out 0.15s forwards',
        'fade-in-up-delay-2': 'fadeInUp 0.6s ease-out 0.25s forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'pattern-strip': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='%23d4a853' fill-opacity='0.08' fill-rule='evenodd'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
