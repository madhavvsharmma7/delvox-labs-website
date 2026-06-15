/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Apple-style dark minimalism
        bg:       '#000000',
        'bg-2':   '#0A0A0A',
        text:     '#F5F5F7',
        'text-2': '#A1A1A6',
        'text-3': '#86868B',
        line:     'rgba(255,255,255,0.12)',
        surface:  'rgba(255,255,255,0.05)',
        blue:     '#2997FF',
        'blue-btn': '#0071E3',
      },
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"',
          '"SF Pro Text"', '"Helvetica Neue"', 'Inter', 'system-ui', 'sans-serif',
        ],
        mono: ['ui-monospace', '"SF Mono"', '"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
