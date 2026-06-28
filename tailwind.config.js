/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Apple-style light minimalism
        bg:       '#FFFFFF',
        'bg-2':   '#F5F5F7',
        text:     '#1D1D1F',
        'text-2': '#6E6E73',
        'text-3': '#86868B',
        line:     'rgba(0,0,0,0.12)',
        surface:  'rgba(0,0,0,0.035)',
        blue:     '#0066CC',
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
