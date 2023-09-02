import { type Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
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
  plugins: [],
} satisfies Config
