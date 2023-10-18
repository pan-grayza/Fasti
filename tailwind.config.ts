import { type Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      roboto: 'Roboto',
      kalam: 'Kalam',
    },
    extend: {
      colors: {
        darkThemeText: '#fafafa',
        lightThemeText: '#09090B',
        darkThemeBorder: '#3f3f46',
        lightThemeBorder: '#e4e4e7',
        lightThemeBG: '#fafafa',
        darkThemeBG: '#27272A',
        lightThemeDarkerBG: '#f4f4f5',
        darkThemeDarkerBG: '#18181b',
        lightThemeSecondaryBG: '#ffffff',
        darkThemeSecondaryBG: '#3f3f46',
        lightThemeSelected: 'rgb(147 197 253 / 0.5)', // #93c5fd/0.5
        darkThemeSelected: 'rgb(59 130 246 / 0.5)', // #3b82f6/0.25
        lightThemeHover: 'rgb(212 212 216 / 0.5)', // #d4d4d8/0.5
        darkThemeHover: 'rgb(82 82 91 / 0.5)', // #a1a1aa/0.1
        accent: 'rgb(37 99 235)', // #2563EB
      },
      animation: {
        fadeIn: 'fadeInKeyframes 150ms forwards ease-out',
        fadeOut: 'fadeOutKeyframes 150ms forwards ease-out',
      },
      keyframes: {
        fadeOutKeyframes: {
          from: {
            opacity: '1',
          },
          to: {
            opacity: '0',
          },
        },
        fadeInKeyframes: {
          from: {
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },
      },
    },
  },
  plugins: [require('tailwindcss-3d'), require('tailwind-scrollbar-hide')],
} satisfies Config
