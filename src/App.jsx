import { lazy, Suspense, useEffect, useRef } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import './index.css'
import { prefersReduced, finePointer, setLenis, scrollTopInstant } from './lib/motion.jsx'
import Home from './pages/Home.jsx'
import ChatWidget from './components/ChatWidget.jsx'

// Legal pages are lazy-loaded so they don't weigh down the homepage bundle
const Privacy = lazy(() => import('./pages/Privacy.jsx'))
const Terms = lazy(() => import('./pages/Terms.jsx'))

gsap.registerPlugin(ScrollTrigger)

const INTERACTIVE = 'a, button, [data-cursor]'

// ─── Custom cursor — GSAP-smoothed dot that expands over interactives ───────────
function CursorDot() {
  const dotRef = useRef(null)
  useEffect(() => {
    if (!finePointer() || prefersReduced()) return
    const dot = dotRef.current
    document.documentElement.classList.add('has-custom-cursor')
    gsap.set(dot, { xPercent: -50, yPercent: -50, scale: 0.2, opacity: 0 })
    const xTo = gsap.quickTo(dot, 'x', { duration: 0.4, ease: 'power3' })
    const yTo = gsap.quickTo(dot, 'y', { duration: 0.4, ease: 'power3' })
    let shown = false

    const onMove = (e) => {
      xTo(e.clientX); yTo(e.clientY)
      if (!shown) { shown = true; gsap.to(dot, { opacity: 1, duration: 0.3 }) }
    }
    const expand = () => gsap.to(dot, { scale: 1, backgroundColor: 'rgba(255,255,255,0.15)', duration: 0.3, ease: 'power3' })
    const shrink = () => gsap.to(dot, { scale: 0.2, backgroundColor: '#ffffff', duration: 0.3, ease: 'power3' })
    const onOver = (e) => { if (e.target.closest?.(INTERACTIVE)) expand() }
    const onOut = (e) => {
      if (e.target.closest?.(INTERACTIVE) && !e.relatedTarget?.closest?.(INTERACTIVE)) shrink()
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [])
  return <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
}

// ─── ScrollProgress — thin line on the right that grows with scroll ─────────────
function ScrollProgress() {
  const barRef = useRef(null)
  useEffect(() => {
    const bar = barRef.current
    gsap.set(bar, { scaleY: 0, transformOrigin: 'top center' })
    // Scroll-linked (not autonomous motion) — safe to keep on for reduced-motion too
    const tween = gsap.to(bar, {
      scaleY: 1, ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: true },
    })
    return () => { tween.scrollTrigger?.kill(); tween.kill() }
  }, [])
  return (
    <div className="fixed top-0 right-0 h-screen w-[2px] z-[9000] pointer-events-none" aria-hidden="true">
      <div
        ref={barRef}
        className="w-full h-full bg-emerald/30"
        style={{ transform: 'scaleY(0)', transformOrigin: 'top center' }}
      />
    </div>
  )
}

// Reset scroll + refresh ScrollTrigger when navigating between routes
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    scrollTopInstant()
    ScrollTrigger.refresh()
  }, [pathname])
  return null
}

// ─── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  // Lenis inertia scrolling — drives every scroll animation, synced to GSAP's ticker
  useEffect(() => {
    if (prefersReduced()) return
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    setLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)
    const onTick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(onTick)
      lenis.destroy()
      setLenis(null)
    }
  }, [])

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <CursorDot />
      <ScrollProgress />
      <div className="grain" aria-hidden="true" />
      <ScrollToTop />
      <div className="bg-paper text-ink min-h-screen">
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center text-ink-3 text-sm">
              Loading…
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
      <ChatWidget />
      <Analytics />
    </>
  )
}
