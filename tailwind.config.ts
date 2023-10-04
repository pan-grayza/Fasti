import { type Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      roboto: 'Roboto, sans-serif',
      kalam: 'Kalam, serif',
    },
    extend: {
      colors: {
        darkThemeText: '#f9fafb',
        lightThemeText: '#09090B',
        darkThemeBorder: '#3f3f46',
        lightThemeBorder: '#e4e4e7',
        lightThemeBG: '#f9fafb',
        darkThemeBG: '#27272A',
        lightThemeSelected: 'rgb(147 197 253 / 0.5)', // #93c5fd/0.5
        darkThemeSelected: 'rgb(59 130 246 / 0.5)', // #3b82f6/0.25
        lightThemeHover: 'rgb(212 212 216 / 0.5)', // #d4d4d8/0.5
        darkThemeHover: 'rgb(161 161 170 / 0.25)', // #a1a1aa/0.1
        accent: 'rgb(37 99 235)', // #2563EB
      },
      animation: {
        appearFromTopLeft: 'appearFromTopLeftKeyframes 50ms ease-in-out',
        sidebarShrinking: 'sidebarShrinkingKeyframes 150ms ease-in-out',
        sidebarExpanding: 'sidebarExpandingKeyframes 150ms ease-in-out',
      },
      keyframes: {
        appearFromTopLeftKeyframes: {
          '0%': {
            transform: 'scale(0.8, 0.6)',
            transformOrigin: '5% 5%',
            opacity: '0.7',
          },
          '100%': {
            transform: 'scale(1)',
            transformOrigin: '10% 10%',
            opacity: '1',
          },
        },
        sidebarShrinkingKeyframes: {
          '0%': {
            width: '12rem',
          },
          '100%': {
            width: '2rem',
          },
        },
        sidebarExpandingKeyframes: {
          '0%': {
            width: '2rem',
          },
          '100%': {
            width: '12rem',
          },
        },
      },
    },
  },
  plugins: [require('tailwindcss-3d')],
} satisfies Config
