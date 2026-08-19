/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          dark: '#1A3A8F',
          light: '#87CEEB',
        },
        gray: {
          custom: '#9CA3AF',
        },
        maroon: {
          DEFAULT: '#8B0000',
          custom: '#8B0000',
        },
        white: '#FFFFFF',
      },
    },
  },
  plugins: [],
};
