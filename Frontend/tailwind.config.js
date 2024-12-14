/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-medium': 'float 6s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-20px) translateX(20px)' },
          '50%': { transform: 'translateY(-40px) translateX(-20px)' },
          '75%': { transform: 'translateY(-20px) translateX(20px)' },
        },
      },
      colors: {
        Eventhive: "#FFC107",
        Eventgray: "#37474F",
        Eventblue: "#00ACC1",
        Eventwhite: "#FAFAFA",
        Eventchar: "#212121",
      },
    },
  },
  plugins: [],
}