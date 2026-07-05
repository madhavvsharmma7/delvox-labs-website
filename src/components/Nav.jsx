import { useState } from 'react'
import LogoMark, { Wordmark } from './LogoMark.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import { smoothTo, smoothTop, useMagnetic } from '../lib/motion.jsx'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const ctaRef = useMagnetic()
  const nav = [
    { label: 'Demos',        id: 'demos' },
    { label: 'How it works', id: 'how' },
    { label: 'Pricing',      id: 'pricing' },
    { label: 'FAQ',          id: 'faq' },
    { label: 'Contact',      id: 'trial' },
  ]

  const goto = (id) => {
    smoothTo(id)
    setOpen(false)
  }

  return (
    <header className="fixed top-3 inset-x-0 z-50 px-4">
      <div className="nav-glass max-w-5xl mx-auto rounded-2xl">
        <div className="flex items-center justify-between px-5 h-14">
          <button
            onClick={smoothTop}
            className="cursor-pointer flex items-center gap-2.5"
            aria-label="Delvox Labs, back to top"
          >
            <LogoMark className="h-7 w-auto text-ink" />
            <Wordmark className="text-[15px] hidden sm:inline" />
          </button>

          <nav className="hidden md:flex items-center gap-5 lg:gap-7" aria-label="Main">
            {nav.map((n) => (
              <button
                key={n.id}
                onClick={() => goto(n.id)}
                className="text-[13px] text-ink-2 hover:text-ink transition-colors duration-200 cursor-pointer whitespace-nowrap"
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <button
              ref={ctaRef}
              onClick={() => goto('trial')}
              className="btn-primary hidden md:inline-flex text-[13px] px-4 py-1.5"
            >
              Start free trial
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden flex items-center justify-center w-9 h-9 cursor-pointer"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <span className={`hamburger ${open ? 'open' : ''}`}>
                <span /><span />
              </span>
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden px-5 pb-5 pt-1 flex flex-col gap-1 border-t border-line">
            {nav.map((n) => (
              <button
                key={n.id}
                onClick={() => goto(n.id)}
                className="text-left text-[15px] text-ink-2 hover:text-ink py-2.5 transition-colors cursor-pointer"
              >
                {n.label}
              </button>
            ))}
            <button
              onClick={() => goto('trial')}
              className="btn-primary text-sm px-5 py-2.5 mt-2"
            >
              Start free trial
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
