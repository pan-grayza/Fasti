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
        darkThemeHover: 'rgb(82 82 91 / 0.5)', // #a1a1aa/0.1
        accent: 'rgb(37 99 235)', // #2563EB
      },
      animation: {
        appearFromTop: 'appearFromTopKeyframes 150ms ease-in-out',
        sidebarShrinking: 'sidebarShrinkingKeyframes 100ms ease-in-out',
        sidebarExpanding: 'sidebarExpandingKeyframes 100ms ease-in-out',
      },
      keyframes: {
        appearFromTopKeyframes: {
          '0%': {
            transform: 'scale(1, 0.5) translateY(-10%)',
            transformOrigin: 'top center',
            opacity: '0',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        sidebarShrinkingKeyframes: {
          '0%': {
            width: '15rem',
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
            width: '15rem',
          },
        },
      },
    },
  },
  plugins: [require('tailwindcss-3d')],
} satisfies Config
