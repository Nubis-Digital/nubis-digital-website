import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/app/(frontend)/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'cloud-dancer': '#F0EEE9',
        'deep-ink': '#101417',
        'plasma-teal': '#00F5D4',
        'holo-lilac': '#B9A7FF',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
