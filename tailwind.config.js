/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#0f172a',
        },
      },
      fontFamily: {
        ios: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        'ios-xs': ['12px', { lineHeight: '16px' }],
        'ios-sm': ['13px', { lineHeight: '18px' }],
        'ios-base': ['16px', { lineHeight: '22px' }],
        'ios-lg': ['17px', { lineHeight: '22px' }],
        'ios-xl': ['20px', { lineHeight: '24px' }],
        'ios-2xl': ['28px', { lineHeight: '34px' }],
      },
      boxShadow: {
        'ios-light': '0 0 1px rgba(0, 0, 0, 0.08)',
        'ios-sm': '0 1px 3px rgba(0, 0, 0, 0.12)',
        'ios-md': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'ios-lg': '0 8px 24px rgba(0, 0, 0, 0.18)',
      },
    },
  },
  plugins: [],
};
