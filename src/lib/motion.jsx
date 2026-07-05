/* eslint-disable react-refresh/only-export-components -- shared motion lib: hooks + helpers + primitives live together by design */
import { useEffect, useRef, useState, Fragment } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

// Shared Lenis instance + smooth-scroll helpers (fall back to native when Lenis is off)
let lenisInstance = null
export function setLenis(instance) {
  lenisInstance = instance
}
export function smoothTo(target, offset = -90) {
  const el = typeof target === 'string' ? document.getElementById(target) : target
  if (!el) return
  if (lenisInstance) lenisInstance.scrollTo(el, { offset, duration: 1.1 })
  else el.scrollIntoView({ behavior: 'smooth' })
}
export function smoothTop() {
  if (lenisInstance) lenisInstance.scrollTo(0, { duration: 1.1 })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}
// Instant jump to top (route changes) — goes through Lenis so its internal
// scroll position stays in sync instead of fighting window.scrollTo
export function scrollTopInstant() {
  if (lenisInstance) lenisInstance.scrollTo(0, { immediate: true })
  else window.scrollTo(0, 0)
}

// ─── Scroll reveal — subtle opacity + small translate only ─────────────────────
export function useInView() {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.unobserve(el)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, inView]
}

export function Reveal({ children, className = '', delay = 0, as: Tag = 'div', ...rest }) {
  const [ref, inView] = useInView()
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}

// ─── Magnetic button — pulls toward the cursor within a radius ──────────────────
export function useMagnetic(strength = 0.4, radius = 60) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !finePointer() || prefersReduced()) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' })
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const reach = Math.max(r.width, r.height) / 2 + radius
      if (Math.hypot(dx, dy) < reach) { xTo(dx * strength); yTo(dy * strength) }
      else { xTo(0); yTo(0) }
    }
    const reset = () => { xTo(0); yTo(0) }
    window.addEventListener('mousemove', onMove, { passive: true })
    el.addEventListener('mouseleave', reset)
    return () => { window.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', reset) }
  }, [strength, radius])
  return ref
}

// ─── SplitReveal — heading words stagger in (load or on scroll) ─────────────────
export function SplitReveal({ text, as: Tag = 'h2', className = '', onLoad = false, stagger = 0.08 }) {
  const ref = useRef(null)
  useEffect(() => {
    const words = ref.current.querySelectorAll('.sr-word')
    if (prefersReduced()) { gsap.set(words, { opacity: 1, y: 0 }); return }
    gsap.set(words, { opacity: 0, y: 20 })
    const vars = {
      opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger,
    }
    if (onLoad) vars.delay = 0.15
    else vars.scrollTrigger = { trigger: ref.current, start: 'top 85%', once: true }
    const tween = gsap.to(words, vars)
    return () => { tween.scrollTrigger?.kill(); tween.kill() }
  }, [text, onLoad, stagger])

  const words = text.split(' ')
  return (
    <Tag ref={ref} className={className}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="sr-word inline-block">{w}</span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </Tag>
  )
}

// ─── Section header — shared eyebrow + title + sub pattern ──────────────────────
export function SectionHeader({ eyebrow, title, sub }) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
      <Reveal as="p" className="eyebrow mb-5">{eyebrow}</Reveal>
      <SplitReveal as="h2" text={title} className="headline text-ink text-4xl md:text-6xl" />
      {sub && <Reveal as="p" delay={120} className="lead text-lg md:text-xl mt-6">{sub}</Reveal>}
    </div>
  )
}
