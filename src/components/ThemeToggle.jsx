import { useState } from 'react'

const KEY = 'delvox-theme'

// Class-on-<html> theme toggle. The no-flash script in index.html sets the
// initial class before paint; this component just mirrors + persists it.
export default function ThemeToggle({ className = '' }) {
  const [dark, setDark] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  )

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    // Keep the browser chrome color in step with the manual toggle
    document.getElementById('theme-color')?.setAttribute('content', next ? '#0C1712' : '#F4F6F3')
    try { localStorage.setItem(KEY, next ? 'dark' : 'light') } catch { /* private mode */ }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-full border border-line text-ink-2 hover:text-ink hover:bg-surface transition-colors cursor-pointer ${className}`}
    >
      {dark ? (
        /* sun */
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="w-[17px] h-[17px]" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
        </svg>
      ) : (
        /* moon */
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px]" aria-hidden="true">
          <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z" />
        </svg>
      )}
    </button>
  )
}
