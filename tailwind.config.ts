import type { Config } from 'tailwindcss';
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { ink: '#141414', sage: '#7EA87A' },
      fontFamily: {
        sans: ['var(--font-dm)', 'sans-serif'],
        display: ['var(--font-syne)', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config;
