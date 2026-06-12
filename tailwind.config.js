/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:       '#080C14',
        surface:  '#0D1424',
        border:   '#1E2D4A',
        primary:  '#2563EB',
        accent:   '#38BDF8',
        muted:    '#64748B',
        text:     '#F8FAFC',
        'text-2': '#94A3B8',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif:   ['"Cormorant Garamond"', 'serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
