/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        border: 'rgba(0, 0, 0, 0.1)',
      },
      borderColor: {
        DEFAULT: 'rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
} 