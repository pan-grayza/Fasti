import { type Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lightText: 'rgb(249 250 251)', // #f9fafb
        darkText: 'rgb(31 41 55)', // #1f2937
        lightBorder: 'rgb(229 231 235)', // #e5e7eb
        darkBorder: 'rgb(55 65 81)', // #374151
        lightBG: 'rgb(249 250 251)', // #f9fafb
        darkBG: 'rgb(55 65 81)', // #374151
        lightSelected: 'rgb(147 197 253 / 0.5)', // #93c5fd/0.5
        darkSelected: 'rgb(59 130 246 / 0.25)', // #3b82f6/0.25
        lightHover: 'rgb(209 213 219 / 0.5)', // #d1d5db/0.5
        darkHover: 'rgb(100 116 139 / 0.25)', // #64748b/0.1
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
  plugins: [],
} satisfies Config
