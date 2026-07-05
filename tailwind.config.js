/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // "After hours" tokens — values live in CSS variables (:root / html.dark)
        paper:      'rgb(var(--paper-rgb) / <alpha-value>)',
        ink:        'rgb(var(--ink-rgb) / <alpha-value>)',
        'ink-2':    'var(--ink-2)',
        'ink-3':    'var(--ink-3)',
        emerald:    'rgb(var(--emerald-rgb) / <alpha-value>)',
        honey:      'rgb(var(--honey-rgb) / <alpha-value>)',
        wa:         'rgb(var(--wa-rgb) / <alpha-value>)',
        surface:    'var(--surface)',
        'surface-2': 'var(--surface-2)',
        line:       'var(--line)',
      },
      fontFamily: {
        sans:    ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque"', '"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        mono:    ['"Geist Mono"', 'ui-monospace', '"SF Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
