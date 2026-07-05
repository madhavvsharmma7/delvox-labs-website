import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import LogoMark, { Wordmark } from './LogoMark.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import Footer from './Footer.jsx'

export default function LegalLayout({ title, updated, children }) {
  // Per-page document title; restore the homepage title on unmount
  useEffect(() => {
    const prev = document.title
    document.title = `${title} · Delvox Labs`
    return () => { document.title = prev }
  }, [title])

  return (
    <>
      <header className="fixed top-3 inset-x-0 z-50 px-4">
        <div className="nav-glass max-w-3xl mx-auto rounded-2xl">
          <div className="flex items-center justify-between px-5 h-14">
            <Link to="/" className="flex items-center gap-2.5" aria-label="Delvox Labs, home">
              <LogoMark className="h-7 w-auto text-ink" />
              <Wordmark className="text-[15px]" />
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/" className="text-[13px] text-ink-2 hover:text-ink transition-colors">
                &lsaquo; Back to site
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <h1 className="headline text-ink text-4xl md:text-5xl">{title}</h1>
        <p className="font-mono text-[12px] text-ink-3 mt-3">Last updated: {updated}</p>
        <div className="legal-prose mt-8">{children}</div>
      </main>

      <Footer />
    </>
  )
}
