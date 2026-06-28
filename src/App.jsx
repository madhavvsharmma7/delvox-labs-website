import { useEffect, useRef, useState, useCallback, Fragment } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import './index.css'

gsap.registerPlugin(ScrollTrigger)

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches
const INTERACTIVE = 'a, button, [data-cursor]'

// Shared Lenis instance + smooth-scroll helpers (fall back to native when Lenis is off)
let lenisInstance = null
function smoothTo(target, offset = -80) {
  const el = typeof target === 'string' ? document.getElementById(target) : target
  if (!el) return
  if (lenisInstance) lenisInstance.scrollTo(el, { offset, duration: 1.1 })
  else el.scrollIntoView({ behavior: 'smooth' })
}
function smoothTop() {
  if (lenisInstance) lenisInstance.scrollTo(0, { duration: 1.1 })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ─── Scroll reveal — subtle opacity + small translate only ─────────────────────
function useInView() {
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

function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }) {
  const [ref, inView] = useInView()
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}

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

// ─── Magnetic button — pulls toward the cursor within a radius ──────────────────
function useMagnetic(strength = 0.4, radius = 60) {
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
function SplitReveal({ text, as: Tag = 'h2', className = '', onLoad = false, stagger = 0.08 }) {
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
        className="w-full h-full bg-black/25"
        style={{ transform: 'scaleY(0)', transformOrigin: 'top center' }}
      />
    </div>
  )
}

// ─── LogoDivider — centered mark between hero and services ──────────────────────
function LogoDivider() {
  return (
    <Reveal className="flex items-center justify-center gap-6 py-4">
      <span className="hidden sm:block h-px w-16 bg-line" />
      <LogoMark className="h-8 w-auto opacity-80 text-text" />
      <span className="hidden sm:block h-px w-16 bg-line" />
    </Reveal>
  )
}

// ─── Wordmark ──────────────────────────────────────────────────────────────────
function Wordmark({ className = '' }) {
  return (
    <span className={`font-semibold tracking-tight text-text ${className}`}>
      Delvox Labs
    </span>
  )
}

// ─── LogoMark — arrow-D monogram, crisp single-weight vector (currentColor) ──────
function LogoMark({ className = '', style }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M25 20 L45 20 L75 50 L45 80 L25 80 Z" />
    </svg>
  )
}

// ─── LoadingScreen ─────────────────────────────────────────────────────────────
function LoadingScreen({ onDone }) {
  const [hide, setHide] = useState(false)

  useEffect(() => {
    const fade = setTimeout(() => setHide(true), 950)
    const done = setTimeout(onDone, 1500)
    return () => { clearTimeout(fade); clearTimeout(done) }
  }, [onDone])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: '#ffffff',
        opacity: hide ? 0 : 1,
        transition: 'opacity 0.55s ease',
      }}
    >
      <LogoMark className="loader-mark w-auto h-14 md:h-16 text-text" />
    </div>
  )
}

// ─── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false)
  const ctaRef = useMagnetic()
  const nav = ['Services', 'Portfolio', 'Process', 'About', 'FAQ', 'Contact']

  const goto = (id) => {
    smoothTo(id.toLowerCase())
    setOpen(false)
  }

  return (
    <header className="fixed top-3 inset-x-0 z-50 px-4">
      <div className="nav-glass max-w-5xl mx-auto rounded-2xl">
        <div className="flex items-center justify-between px-5 h-14">
          <button
            onClick={smoothTop}
            className="cursor-pointer flex items-center"
            aria-label="Delvox Labs — back to top"
          >
            <LogoMark className="h-7 w-auto text-text" />
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {nav.map((n) => (
              <button
                key={n}
                onClick={() => goto(n)}
                className="text-[13px] text-text-2 hover:text-text transition-colors duration-200 cursor-pointer"
              >
                {n}
              </button>
            ))}
          </nav>

          <a
            ref={ctaRef}
            href="mailto:madhavs.work07@gmail.com"
            className="btn-blue btn-shimmer hidden md:inline-flex text-[13px] px-4 py-1.5"
          >
            Start a Project
          </a>

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

        {open && (
          <div className="md:hidden px-5 pb-5 pt-1 flex flex-col gap-1 border-t border-line">
            {nav.map((n) => (
              <button
                key={n}
                onClick={() => goto(n)}
                className="text-left text-[15px] text-text-2 hover:text-text py-2.5 transition-colors cursor-pointer"
              >
                {n}
              </button>
            ))}
            <a
              href="mailto:madhavs.work07@gmail.com"
              className="btn-blue text-sm px-5 py-2.5 mt-2"
            >
              Start a Project
            </a>
          </div>
        )}
      </div>
    </header>
  )
}

// ─── Hero ──────────────────────────────────────────────────────────────────────
function Hero({ started }) {
  const parallaxRef = useRef(null)
  const headlineRef = useRef(null)
  const ctaRef = useMagnetic()

  // Headline words stagger in once the loader has cleared (not hidden behind it)
  useEffect(() => {
    const words = headlineRef.current.querySelectorAll('.hero-word')
    if (prefersReduced()) { gsap.set(words, { opacity: 1, y: 0 }); return }
    if (!started) return
    const tween = gsap.fromTo(
      words,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1, delay: 0.1 }
    )
    return () => tween.kill()
  }, [started])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    let raf
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = parallaxRef.current
        if (!el) return
        const y = window.scrollY
        // Move slightly slower than the page, and fade out gently
        el.style.transform = `translate3d(0, ${y * 0.18}px, 0)`
        el.style.opacity = String(Math.max(0, 1 - y / 700))
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-20">
      <div ref={parallaxRef} className="parallax flex flex-col items-center w-full">
      <Reveal as="p" className="eyebrow mb-7">Solo dev · AI-first · Building in Public</Reveal>

      <h1 ref={headlineRef} className="display text-text max-w-5xl">
        <span style={{ fontSize: 'clamp(2.75rem, 8.5vw, 6.5rem)' }} className="block">
          {['We', 'Build', 'the', 'AI', 'Layer'].map((w, i) => (
            <Fragment key={`a${i}`}><span className="hero-word inline-block">{w}</span>{' '}</Fragment>
          ))}
          <br className="hidden sm:block" />
          {['for', 'Small', 'Business'].map((w, i) => (
            <Fragment key={`b${i}`}><span className="hero-word inline-block">{w}</span>{i < 2 ? ' ' : ''}</Fragment>
          ))}
        </span>
      </h1>

      <Reveal as="p" delay={160} className="lead text-xl md:text-2xl max-w-2xl mt-8">
        Websites, automation, and AI agents for small businesses — the kind of work that used to require a whole team. Built on Claude AI, shipped in days, not months.
      </Reveal>

      <Reveal delay={240} className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mt-11">
        <a ref={ctaRef} href="mailto:madhavs.work07@gmail.com" className="btn-blue btn-shimmer text-[17px] px-6 py-3">
          Start a Project
        </a>
        <button
          onClick={() => smoothTo('portfolio')}
          className="link-blue text-[17px]"
        >
          See the Work&nbsp;›
        </button>
      </Reveal>

      <Reveal delay={320} className="mt-24 w-full max-w-3xl">
        <div className="hr mb-10" />
        <div className="flex flex-col sm:flex-row items-stretch justify-center gap-8 sm:gap-0">
          {[
            { value: 'FixIt Plumbers', label: 'First Client — Live' },
            { value: 'Claude AI',      label: 'Core Engine' },
            { value: 'Open',           label: 'Taking New Work' },
          ].map(({ value, label }, i) => (
            <div
              key={label}
              className={`flex-1 px-6 ${i > 0 ? 'sm:border-l border-line' : ''}`}
            >
              <div className="headline text-text text-2xl md:text-[28px]">{value}</div>
              <div className="text-text-3 text-sm mt-2">{label}</div>
            </div>
          ))}
        </div>
      </Reveal>
      </div>
    </section>
  )
}

// ─── StatsBar — trust metrics directly below the hero ───────────────────────────
function StatsBar() {
  const STATS = [
    { value: '48hr', label: 'Delivery' },
    { value: '3',    label: 'Live Projects' },
    { value: '100%', label: 'Satisfaction' },
  ]

  return (
    <Reveal className="px-6">
      <div className="max-w-3xl mx-auto flex items-stretch justify-center divide-x divide-line border-y border-line">
        {STATS.map(({ value, label }) => (
          <div key={label} className="flex-1 text-center py-7 px-3 sm:px-6">
            <div className="headline text-text text-3xl md:text-5xl">{value}</div>
            <div className="text-text-3 text-xs sm:text-sm mt-2 tracking-wide">{label}</div>
          </div>
        ))}
      </div>
    </Reveal>
  )
}

// ─── Section header ─────────────────────────────────────────────────────────────
function SectionHeader({ eyebrow, title, sub }) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
      <Reveal as="p" className="eyebrow mb-5">{eyebrow}</Reveal>
      <SplitReveal as="h2" text={title} className="headline text-text text-4xl md:text-6xl" />
      {sub && <Reveal as="p" delay={120} className="lead text-lg md:text-xl mt-6">{sub}</Reveal>}
    </div>
  )
}

// ─── Services ───────────────────────────────────────────────────────────────────
function Services() {
  const SERVICES = [
    {
      title: 'AI-Powered Websites',
      desc: 'Fast, modern React sites that actually convert — with AI baked in where it counts. Smart contact forms, instant visitor answers, and copy that doesn\'t read like a brochure.',
      tags: 'React · Claude AI · Tailwind',
    },
    {
      title: 'Business Automations',
      desc: 'Python and n8n workflows that handle the tedious stuff — follow-ups, scheduling, form routing, notifications. The work that eats your day, automated in days.',
      tags: 'Python · n8n · APIs',
    },
    {
      title: 'AI Agents',
      desc: 'Claude AI agents built around how your business actually runs — not a generic chatbot dropped on a page. They answer questions, qualify leads, and handle intake while you\'re busy.',
      tags: 'Claude AI · LangChain · Voice',
    },
  ]

  return (
    <section id="services" className="py-16 md:py-24 px-6 max-w-5xl mx-auto">
      <SectionHeader
        eyebrow="What I Build"
        title="Three Services. No Retainers."
        sub="Pick what your business needs right now. No upselling, no packages — just the thing that actually solves the problem."
      />

      <div>
        {SERVICES.map(({ title, desc, tags }, i) => (
          <Reveal key={title} className={`relative overflow-hidden text-center py-12 md:py-16 ${i > 0 ? 'border-t border-line' : ''}`}>
            <span
              aria-hidden="true"
              className="pointer-events-none select-none absolute inset-0 flex items-center justify-center font-semibold leading-none text-black/[0.04]"
              style={{ fontSize: 'clamp(7rem, 20vw, 14rem)' }}
            >
              0{i + 1}
            </span>
            <div className="relative">
              <h3 className="headline text-text text-3xl md:text-5xl">{title}</h3>
              <p className="lead text-lg md:text-xl max-w-2xl mx-auto mt-6">{desc}</p>
              <p className="text-text-3 text-sm md:text-base mt-7 tracking-wide">{tags}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

// ─── How It Works — quick 4-step overview ───────────────────────────────────────
function HowItWorks() {
  const STEPS = [
    { num: '01', title: 'You share your vision', desc: 'Tell me what you’re building and what’s getting in the way.' },
    { num: '02', title: 'We design and build',   desc: 'I design and build it, with a staging link at every milestone.' },
    { num: '03', title: 'You review and approve', desc: 'Click through, request changes, sign off when it feels right.' },
    { num: '04', title: 'We deploy and launch',  desc: 'We push it live together — then I stay on for support.' },
  ]

  return (
    <section id="process" className="py-16 md:py-24 px-6 max-w-5xl mx-auto">
      <SectionHeader
        eyebrow="The Flow"
        title="How It Works"
        sub="Four simple steps from first message to a site that’s live."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line rounded-3xl overflow-hidden">
        {STEPS.map(({ num, title, desc }, i) => (
          <Reveal key={num} delay={i * 80} className="bg-bg p-8 md:p-9 h-full">
            <div className="headline text-text-3 text-2xl md:text-3xl tabular-nums">{num}</div>
            <h3 className="headline text-text text-xl md:text-2xl mt-6">{title}</h3>
            <p className="lead text-base mt-3">{desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

// ─── Portfolio ──────────────────────────────────────────────────────────────────
function Portfolio() {
  const pinRef = useRef(null)
  const trackRef = useRef(null)

  // Horizontal scroll is JS-driven: only desktop + no-reduced-motion gets the pinned
  // stage. Everyone else (mobile, reduced-motion) keeps the clean vertical stack.
  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const pin = pinRef.current
      const track = trackRef.current
      pin.classList.add('pf-horizontal')
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: () => '+=' + distance(),
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      return () => {
        tween.kill()
        pin.classList.remove('pf-horizontal')
        gsap.set(track, { clearProps: 'transform' })
      }
    })
    return () => mm.revert()
  }, [])

  return (
    <section id="portfolio" className="pt-16 md:pt-24 pb-0">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          eyebrow="Work"
          title="First Client Out the Door"
          sub="Two live projects so far. More in the pipeline. This is what Delvox actually ships."
        />
      </div>

      <div ref={pinRef} className="portfolio-pin">
        <div ref={trackRef} className="pf-track flex flex-col gap-12 px-6 max-w-5xl mx-auto">
          {/* Featured */}
          <div className="pf-card w-full text-center">
            <a
              href="https://sharmatravelagency.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-3xl overflow-hidden border border-line cursor-pointer group"
            >
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80"
                alt="Sharma Travels website"
                className="w-full h-64 md:h-96 object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                loading="lazy"
              />
            </a>
            <p className="eyebrow mt-10">Luxury Travel Agency</p>
            <h3 className="headline text-text text-3xl md:text-5xl mt-4">Sharma Travels</h3>
            <p className="lead text-lg max-w-2xl mx-auto mt-6">
              Luxury travel agency website with parallax sections, destination cards, and conversational enquiry form.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-8">
              <a
                href="https://sharmatravelagency.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="link-blue text-[17px]"
              >
                View live site&nbsp;›
              </a>
            </div>
          </div>

          {/* FixIt Plumbers */}
          <div className="pf-card w-full text-center">
            <a
              href="https://fixit-plumbers.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-3xl overflow-hidden border border-line cursor-pointer group"
            >
              <img
                src="https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1200&q=80"
                alt="FixIt Plumbers website"
                className="w-full h-64 md:h-96 object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                loading="lazy"
              />
            </a>
            <p className="eyebrow mt-10">Local Plumbing Company</p>
            <h3 className="headline text-text text-3xl md:text-5xl mt-4">FixIt Plumbers</h3>
            <p className="lead text-lg max-w-2xl mx-auto mt-6">
              A complete website for a local plumbing company — animated hero, mobile-first layout, and a contact form that routes straight to their inbox. Zero to live in 6 days.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-8">
              <a
                href="https://fixit-plumbers.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="link-blue text-[17px]"
              >
                View live site&nbsp;›
              </a>
            </div>
          </div>

          {/* Open slot */}
          <div className="pf-card w-full text-center flex flex-col justify-center">
            <p className="eyebrow mb-4">Slot #3 — Open</p>
            <h3 className="headline text-text text-3xl md:text-5xl">Your Business Here</h3>
            <p className="lead text-lg max-w-2xl mx-auto mt-6">
              I take on one or two projects at a time so nothing gets rushed. If you're interested, reach out early — slots fill up fast when you charge honest prices.
            </p>
            <a href="mailto:madhavs.work07@gmail.com" className="link-blue text-[17px] inline-block mt-8">
              Get in touch&nbsp;›
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Why Delvox — benefit cards with single-weight line icons ────────────────────
const BenefitIcon = ({ path }) => (
  <svg
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
    className="h-7 w-7 text-text" aria-hidden="true"
  >
    {path}
  </svg>
)

function WhyDelvox() {
  const BENEFITS = [
    {
      title: 'Built Fast',
      desc: 'Most projects ship in days, not months.',
      icon: <path d="M13 2 L4 14 h7 l-1 8 9-12 h-7 z" />,
    },
    {
      title: 'Honest Pricing',
      desc: 'One fixed price, quoted upfront. No retainers.',
      icon: <><path d="M3 12 L12 3 h6 a3 3 0 0 1 3 3 v6 l-9 9 z" /><circle cx="16.5" cy="7.5" r="1.2" /></>,
    },
    {
      title: 'You Own It All',
      desc: 'Code lives on your GitHub from day one.',
      icon: <><path d="M12 3 l7 3 v5 c0 4.5 -3 7.5 -7 9 c-4 -1.5 -7 -4.5 -7 -9 V6 z" /><path d="M9.5 12 l1.8 1.8 L15 9.8" /></>,
    },
    {
      title: 'AI-Native',
      desc: 'Built on Claude AI — smart where it counts.',
      icon: <><path d="M12 3 c1 4 2 5 6 6 c-4 1 -5 2 -6 6 c-1 -4 -2 -5 -6 -6 c4 -1 5 -2 6 -6 z" /></>,
    },
  ]

  return (
    <section id="why-delvox" className="py-16 md:py-24 px-6 max-w-5xl mx-auto">
      <SectionHeader
        eyebrow="Why Delvox"
        title="What You Actually Get"
        sub="No jargon, no lock-in, no disappearing act. Just the things that matter."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {BENEFITS.map(({ title, desc, icon }, i) => (
          <Reveal
            key={title}
            delay={i * 80}
            className="h-full rounded-2xl border border-line bg-bg p-7 md:p-8 transition-colors duration-300 hover:border-text-3/40"
          >
            <BenefitIcon path={icon} />
            <h3 className="headline text-text text-xl md:text-2xl mt-6">{title}</h3>
            <p className="lead text-base mt-3">{desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

// ─── About ──────────────────────────────────────────────────────────────────────
function About() {
  const facts = [
    { label: 'Age',          value: '18 years old' },
    { label: 'First client', value: 'FixIt Plumbers' },
    { label: 'Stack',        value: 'React · Python · Claude AI' },
    { label: 'Status',       value: 'Taking new clients' },
  ]

  return (
    <section id="about" className="relative overflow-hidden py-16 md:py-24 px-6">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <LogoMark
          className="rotate-slow w-auto opacity-[0.06] text-text"
          style={{ height: 'min(78vw, 420px)' }}
        />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <Reveal as="p" className="eyebrow mb-5">The Founder</Reveal>
        <SplitReveal as="h2" text="Why an 18-Year-Old Built This" className="headline text-text text-4xl md:text-6xl mb-10" />
        <Reveal className="text-left max-w-2xl mx-auto">
          <p className="lead text-lg md:text-xl mb-6">
            I'm Madhav. I started Delvox Labs at 18 because I wanted to build real things that solve real problems, and small businesses kept coming up as the obvious place to do that. Most of them are running on a website that hasn't changed since 2015, a Google Form, and someone manually forwarding emails.
          </p>
          <p className="lead text-lg md:text-xl">
            My first client was a plumbing company. I built their whole site from scratch in under a week. That proved the model: fast builds, real tooling, honest pricing. I'm doing this in public, sharing every project, every lesson, every misstep, because I think the best way to grow is to just ship things and talk about it.
          </p>
        </Reveal>

        <Reveal delay={80} className="max-w-md mx-auto mt-16">
          {facts.map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center py-4 border-t border-line last:border-b">
              <span className="text-text-3 text-sm">{label}</span>
              <span className="text-text text-base">{value}</span>
            </div>
          ))}
          <p className="text-text-3 text-sm mt-8">
            Available for new projects · Building in Public · Solo Founder · AI-First · Ships Fast
          </p>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Tech Stack ─────────────────────────────────────────────────────────────────
function TechStack() {
  const STACK = ['Claude AI', 'React', 'Python', 'Vite', 'Tailwind CSS', 'Node.js', 'n8n', 'GSAP']

  return (
    <section id="techstack" className="py-16 md:py-24 px-6 max-w-5xl mx-auto">
      <SectionHeader
        eyebrow="The Stack"
        title="Tools I Actually Use"
        sub="No bloated frameworks picked for the résumé. Every tool here earned its place in the last few months of shipping real projects."
      />

      <Reveal>
        <ul className="sr-only">
          {STACK.map((name) => <li key={name}>{name}</li>)}
        </ul>
        <div className="marquee py-2" aria-hidden="true">
          <div className="marquee__track">
            {['a', 'b'].map((k) =>
              STACK.map((name, i) => (
                <span key={`${k}-${i}`} className="inline-flex items-center">
                  <span className="display text-text text-4xl md:text-6xl px-10">{name}</span>
                  <span className="text-text-3 text-3xl md:text-5xl">·</span>
                </span>
              ))
            )}
          </div>
        </div>
      </Reveal>

      {/* Quiet terminal passage — no window chrome */}
      <Reveal delay={120} className="max-w-xl mx-auto mt-16">
        <div className="font-mono text-sm space-y-2 text-left">
          <p className="text-text-2"><span className="text-blue">❯ </span>node scripts/ship-fixit.js</p>
          <p className="text-text-3 text-xs pl-4">✓ Building React site...</p>
          <p className="text-text-3 text-xs pl-4">✓ Running Claude AI on contact form logic...</p>
          <p className="text-text-3 text-xs pl-4">✓ Deploying to prod...</p>
          <p className="text-text text-xs pl-4">✓ Done. Client got their site in 6 days.</p>
          <p className="text-text-2 pt-1"><span className="text-blue">❯ </span><span className="cursor-blink">█</span></p>
        </div>
      </Reveal>
    </section>
  )
}

// ─── Contact ────────────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: '', email: '', business: '', message: '' })
  const [status, setStatus] = useState('idle')

  const set = useCallback((key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value })), [])

  // ← Paste your Formspree endpoint here once you have it
  const FORMSPREE_URL = 'https://formspree.io/f/mgobnbrg'

  const submit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const connectLinks = [
    { label: 'Email',  value: 'madhavs.work07@gmail.com', href: 'mailto:madhavs.work07@gmail.com' },
    { label: 'GitHub', value: 'madhavvsharmma7',       href: 'https://github.com/madhavvsharmma7' },
    { label: 'X',      value: '@madhavvsharmma',        href: 'https://x.com/madhavvsharmma' },
  ]

  return (
    <section id="contact" className="py-16 md:py-24 px-6">
      <div className="max-w-xl mx-auto">
        <SectionHeader
          eyebrow="Start Something"
          title="Got a Project? Let's Talk."
          sub="No sales calls. Just a quick message about what you're working on — I reply the same day."
        />

        {status === 'sent' ? (
          <Reveal className="text-center py-12">
            <h3 className="headline text-text text-3xl mb-3">Got it — thanks.</h3>
            <p className="lead text-lg">I'll reply today or first thing tomorrow.</p>
          </Reveal>
        ) : status === 'error' ? (
          <Reveal className="text-center py-12">
            <h3 className="headline text-text text-3xl mb-3">Something went wrong.</h3>
            <p className="lead text-lg mb-6">The form couldn't send. Email me directly instead.</p>
            <a href="mailto:madhavs.work07@gmail.com" className="link-blue text-[17px]">madhavs.work07@gmail.com&nbsp;›</a>
            <button onClick={() => setStatus('idle')} className="block mx-auto mt-6 link-blue text-sm cursor-pointer">
              ‹&nbsp;Try again
            </button>
          </Reveal>
        ) : (
          <Reveal>
            <form onSubmit={submit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="c-name" className="block text-text-3 text-sm mb-2">Your Name</label>
                  <input id="c-name" type="text" required value={form.name} onChange={set('name')} placeholder="Jane Smith" className="field" />
                </div>
                <div>
                  <label htmlFor="c-email" className="block text-text-3 text-sm mb-2">Email</label>
                  <input id="c-email" type="email" required value={form.email} onChange={set('email')} placeholder="you@company.com" className="field" />
                </div>
              </div>
              <div>
                <label htmlFor="c-business" className="block text-text-3 text-sm mb-2">Business / Project</label>
                <input id="c-business" type="text" value={form.business} onChange={set('business')} placeholder="What kind of business do you run?" className="field" />
              </div>
              <div>
                <label htmlFor="c-message" className="block text-text-3 text-sm mb-2">What do you need?</label>
                <textarea
                  id="c-message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={set('message')}
                  placeholder="Describe the problem you're trying to solve. The messier the better — I can figure out the solution."
                  className="field resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-blue w-full py-3.5 text-[17px]"
              >
                {status === 'sending' ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </Reveal>
        )}

        <Reveal delay={80} className="mt-16">
          <p className="eyebrow text-center mb-6">Connect</p>
          <div className="max-w-md mx-auto">
            {connectLinks.map(({ label, value, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="flex items-center justify-between py-4 border-t border-line last:border-b group"
              >
                <span className="text-text-3 text-sm">{label}</span>
                <span className="text-text text-base group-hover:text-blue transition-colors duration-200">{value}</span>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Footer ─────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-line py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <Wordmark className="text-[15px]" />
          <p className="text-text-3 text-xs">All systems operational</p>
          <div className="flex items-center gap-6">
            <a href="mailto:madhavs.work07@gmail.com" className="text-text-3 text-xs hover:text-text transition-colors duration-200">Email</a>
            <a href="https://github.com/madhavvsharmma7" target="_blank" rel="noopener noreferrer" className="text-text-3 text-xs hover:text-text transition-colors duration-200">GitHub</a>
            <a href="https://x.com/madhavvsharmma" target="_blank" rel="noopener noreferrer" className="text-text-3 text-xs hover:text-text transition-colors duration-200">X</a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-line flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-text-3 text-xs">
            © {new Date().getFullYear()} Delvox Labs. Built with Claude AI &amp; React.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-text-3 text-xs cursor-pointer hover:text-text transition-colors">Privacy Policy</span>
            <span className="text-text-3 text-xs cursor-pointer hover:text-text transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── FAQ — objection handling + guarantees ──────────────────────────────────────
const FAQS = [
  {
    q: 'How much does a project cost?',
    a: 'Every project is quoted upfront before any work starts — one fixed price for the whole build, no hidden fees and no retainers. The number depends on scope, and we settle it in the first conversation so there are no surprises.',
  },
  {
    q: 'How long does it take?',
    a: 'Most builds ship in days to two weeks. FixIt Plumbers went from first conversation to a live, indexed site in six days. The timeline is agreed before starting, and you get a staging link at every milestone.',
  },
  {
    q: "Do I own everything when it's done?",
    a: 'Yes, completely. All the code lives on your GitHub and your accounts from day one. No lock-in and nothing held hostage.',
  },
  {
    q: "I'm not technical. Is that a problem?",
    a: 'Not at all. You get plain-language updates, a staging link to click through at each milestone, and a full walkthrough at handoff. You never have to touch code or jargon.',
  },
  {
    q: 'What happens if something breaks after launch?',
    a: "Every build includes two weeks of post-launch support, so I stay reachable to fix anything that comes up. After that I'm still an email away for changes.",
  },
  {
    q: 'Is this just AI and templates?',
    a: 'No. Every site is a custom React build written for your business, not a template or page builder. AI is a tool I use to ship faster and smarter; it is not the product.',
  },
]

const GUARANTEES = ['Same-day replies', 'You own the code', '2 weeks of support', 'No retainers, ever']

function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <section id="faq" className="py-16 md:py-24 px-6 max-w-3xl mx-auto">
      <SectionHeader
        eyebrow="Questions"
        title="Answers, Up Front"
        sub="The things people usually want to know before we start."
      />

      <Reveal className="border-t border-line">
        {FAQS.map((item, i) => {
          const isOpen = open === i
          return (
            <div key={i} className="border-b border-line">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-a-${i}`}
                className="w-full flex items-center justify-between gap-6 text-left py-6 cursor-pointer group"
              >
                <span className="text-text text-lg md:text-xl">{item.q}</span>
                <span className={`faq-plus ${isOpen ? 'open' : ''}`} aria-hidden="true" />
              </button>
              <div id={`faq-a-${i}`} className={`faq-answer ${isOpen ? 'open' : ''}`} role="region">
                <div>
                  <p className="lead text-base md:text-lg pb-6 max-w-2xl">{item.a}</p>
                </div>
              </div>
            </div>
          )
        })}
      </Reveal>

      {/* Guarantees — quiet, factual trust signals */}
      <Reveal delay={80} className="mt-14 flex flex-col sm:flex-row border border-line rounded-2xl overflow-hidden">
        {GUARANTEES.map((g, i) => (
          <div
            key={g}
            className={`flex-1 py-5 px-4 text-center ${i > 0 ? 'border-t sm:border-t-0 sm:border-l border-line' : ''}`}
          >
            <span className="text-text-2 text-sm">{g}</span>
          </div>
        ))}
      </Reveal>
    </section>
  )
}

// ─── FloatingCTA — persistent CTA on mobile (desktop has it in the nav) ──────────
function FloatingCTA() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.9
      const contact = document.getElementById('contact')
      const nearContact = contact && contact.getBoundingClientRect().top < window.innerHeight * 0.9
      setShow(past && !nearContact)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <a
      href="mailto:madhavs.work07@gmail.com"
      className={`md:hidden fixed bottom-4 inset-x-4 z-40 btn-blue btn-shimmer justify-center py-3.5 text-[16px] transition-all duration-300 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      Start a Project
    </a>
  )
}

// ─── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [loading, setLoading] = useState(true)

  // Lenis inertia scrolling — drives every scroll animation, synced to GSAP's ticker
  useEffect(() => {
    if (prefersReduced()) return
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisInstance = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const onTick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(onTick)
      lenis.destroy()
      lenisInstance = null
    }
  }, [])

  return (
    <>
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      <CursorDot />
      <ScrollProgress />
      <div className="grain" aria-hidden="true" />
      <div className="bg-bg text-text min-h-screen">
        <Navbar />
        <Hero started={!loading} />
        <StatsBar />
        <LogoDivider />
        <Services />
        <HowItWorks />
        <Portfolio />
        <WhyDelvox />
        <About />
        <TechStack />
        <FAQ />
        <Contact />
        <Footer />
      </div>
      <FloatingCTA />
    </>
  )
}
