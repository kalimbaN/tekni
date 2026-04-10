/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand color - Green (Button / Accent)
        primary: {
          DEFAULT: '#219D75',  // RGB: 33, 157, 117
          50: '#E8F5F0',
          100: '#D1EBE1',
          200: '#A3D7C3',
          300: '#75C3A5',
          400: '#47AF87',
          500: '#219D75',
          600: '#1A7D5E',
          700: '#145E46',
          800: '#0D3E2F',
          900: '#071F17',
        },
        // Light Mint Background
        mint: {
          DEFAULT: '#F5FCF8',  // RGB: 245, 252, 248
          50: '#F5FCF8',
          100: '#EBF9F1',
          200: '#D7F3E3',
        },
        // Light Gray / Soft UI Background
        grayLight: {
          DEFAULT: '#C1CAC6',  // RGB: 193, 202, 198
          50: '#F5F6F5',
          100: '#EBEDEC',
          200: '#D7DBD9',
          300: '#C1CAC6',
          400: '#A8B3AE',
        },
        // Medium Gray (Text / Borders)
        grayMedium: {
          DEFAULT: '#8B9691',  // RGB: 139, 150, 145
          50: '#F0F2F1',
          100: '#E1E5E3',
          200: '#C3CBC7',
          300: '#A5B1AB',
          400: '#8B9691',
        },
        // Dark Gray (Primary Text)
        grayDark: {
          DEFAULT: '#4F5450',  // RGB: 79, 84, 80
          50: '#EDEEED',
          100: '#DCDEDC',
          200: '#B9BDBA',
          300: '#969C98',
          400: '#4F5450',
        },
        // Almost Black (Strong Text)
        textDark: {
          DEFAULT: '#0E110E',  // RGB: 14, 17, 14
        },
      },
    },
  },
  plugins: [],
}