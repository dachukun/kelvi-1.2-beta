/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'indigo-light': '#6366F1',
        'cream': '#D4B08C',
        'glass': 'rgba(30, 41, 59, 0.6)',
      },
      backgroundImage: {
        'indigo-gradient': 'linear-gradient(to right, #6366F1, #D4B08C)',
      },
      backdropBlur: {
        'glass': '12px',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      animation: {
        'flow': 'flow 3s ease-in-out infinite',
      },
      keyframes: {
        flow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}