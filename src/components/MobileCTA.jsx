import { useEffect, useState } from 'react'
import { smoothTo } from '../lib/motion.jsx'

// Persistent mobile-only CTA. Appears once the visitor has scrolled past the
// hero and hides again when the trial form is in view (so it never covers the
// thing it points at). Desktop keeps the CTA in the nav, so this is md:hidden.
export default function MobileCTA() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.9
      const trial = document.getElementById('trial')
      const nearTrial = trial && trial.getBoundingClientRect().top < window.innerHeight * 0.9
      setShow(past && !nearTrial)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      onClick={() => smoothTo('trial')}
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={`md:hidden fixed bottom-4 inset-x-4 z-40 btn-primary justify-center py-3.5 text-[16px] shadow-lg transition-all duration-300 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      Start your free trial
    </button>
  )
}
