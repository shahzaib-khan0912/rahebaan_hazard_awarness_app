/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00C853',
        secondary: '#1976D2',
        accent: '#FF6D00',
        dark: {
          bg: '#0B1220',
          card: 'rgba(255, 255, 255, 0.08)',
          border: 'rgba(255, 255, 255, 0.1)'
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
