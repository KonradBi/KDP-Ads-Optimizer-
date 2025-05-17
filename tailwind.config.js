/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        invert: {
          css: {
            '--tw-prose-headings': theme('colors.amber.300'), // Default for h1, h3, h4 etc. in prose
            'h2': {
              'color': theme('colors.orange.500'), // Explicitly set h2 to orange-500
            },
          },
        },
      }),
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
  plugins: [require('@tailwindcss/typography')],
} 