import { useEffect, useState } from 'react'
import { smoothTo } from '../lib/motion.jsx'

// Persistent mobile-only CTA. Appears once the visitor has scrolled past the
// hero and hides again when the trial form is in view (so it never covers the
// thing it points at). Desktop keeps the CTA in the nav, so this is md:hidden.
export default function MobileCTA() {
  const [show, setShow] = useState(false)

  // IntersectionObserver instead of a scroll listener — callbacks fire only at
  // threshold crossings, off the scroll hot path (no getBoundingClientRect /
  // layout read per frame). Show once the hero has scrolled away, hide again
  // when the trial form nears the viewport.
  useEffect(() => {
    const hero = document.querySelector('main section')
    const trial = document.getElementById('trial')
    let pastHero = false
    let nearTrial = false
    const update = () => setShow(pastHero && !nearTrial)

    const observers = []
    if (hero) {
      const o = new IntersectionObserver(
        ([e]) => {
          pastHero = !e.isIntersecting
          update()
        },
        { threshold: 0 }
      )
      o.observe(hero)
      observers.push(o)
    }
    if (trial) {
      const o = new IntersectionObserver(
        ([e]) => {
          nearTrial = e.isIntersecting
          update()
        },
        { rootMargin: '0px 0px -15% 0px' }
      )
      o.observe(trial)
      observers.push(o)
    }
    return () => observers.forEach((o) => o.disconnect())
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
