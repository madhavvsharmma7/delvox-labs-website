import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Globe, Zap, Bot, ArrowRight, Mail,
  Code2, ExternalLink, Menu, X,
  ChevronRight, Clock, Send, MessageSquare,
  Check, Phone,
} from 'lucide-react'

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const LinkedinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

import './index.css'

gsap.registerPlugin(ScrollTrigger)

// ─── Signature Animation: Code Rain ──────────────────────────────────────────
function CodeRain() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    const resizeObs = new ResizeObserver(resize)
    resizeObs.observe(canvas)

    const CHARS = '{}[]<>/\\;:=!@01/*+=?$&#'
    const FONT_SIZE = 13
    let cols = Math.floor(canvas.width / FONT_SIZE)
    let drops = Array.from({ length: cols }, () => Math.random() * -50)
    let raf
    let lastFrame = 0

    const draw = (ts) => {
      raf = requestAnimationFrame(draw)
      if (ts - lastFrame < 50) return
      lastFrame = ts

      ctx.fillStyle = 'rgba(8, 12, 20, 0.06)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${FONT_SIZE}px "JetBrains Mono", monospace`

      cols = Math.floor(canvas.width / FONT_SIZE)
      while (drops.length < cols) drops.push(0)

      drops.forEach((y, i) => {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)]
        const p = y / canvas.height
        ctx.fillStyle = p < 0.2 ? '#38BDF8' : p < 0.6 ? '#2563EB' : 'rgba(37,99,235,0.25)'
        ctx.fillText(char, i * FONT_SIZE, y)
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i] += FONT_SIZE * 0.65
      })
    }

    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      resizeObs.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.32 }}
    />
  )
}

// ─── LogoMark ─────────────────────────────────────────────────────────────────
function LogoMark({ size = 28, uid = 'a' }) {
  const gid = `cg-${uid}`
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="200" height="200" rx="44" fill="#080C14"/>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38BDF8"/>
          <stop offset="100%" stopColor="#2563EB"/>
        </linearGradient>
      </defs>
      <polyline points="38,52 82,100 38,148" fill="none" stroke={`url(#${gid})`} strokeWidth="15" strokeLinejoin="miter" strokeLinecap="round"/>
      <path fillRule="evenodd" fill="#F8FAFC" d="M 100 52 L 118 52 A 48 48 0 0 1 118 148 L 100 148 Z M 118 70 A 30 30 0 0 1 118 130 Z"/>
      <rect x="168" y="128" width="18" height="7" rx="3.5" fill="#38BDF8"/>
    </svg>
  )
}

// ─── LoadingScreen ────────────────────────────────────────────────────────────
function LoadingScreen({ onDone }) {
  const overlayRef = useRef(null)
  const logoRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(logoRef.current,
        { scale: 0.72, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.6)' }
      )
      gsap.fromTo(glowRef.current,
        { scale: 0.6, opacity: 0.55 },
        { scale: 1.8, opacity: 0, duration: 1.4, ease: 'power2.out', repeat: -1 }
      )
      gsap.to(logoRef.current, {
        scale: 1.07, duration: 0.9, ease: 'sine.inOut',
        yoyo: true, repeat: -1, delay: 0.45,
      })
    })

    const timer = setTimeout(() => {
      gsap.to(overlayRef.current, {
        opacity: 0, duration: 0.55, ease: 'power2.inOut',
        onComplete: onDone,
      })
    }, 1150)

    return () => { ctx.revert(); clearTimeout(timer) }
  }, [onDone])

  return (
    <div ref={overlayRef} style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#080C14' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div ref={glowRef} style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, #38BDF8 0%, #2563EB 35%, transparent 68%)', pointerEvents: 'none' }} />
        <div ref={logoRef} style={{ position: 'relative' }}>
          <LogoMark size={100} uid="loader" />
        </div>
      </div>
      <p style={{ marginTop: 20, fontFamily: 'var(--font-display, sans-serif)', fontWeight: 700, fontSize: 15, letterSpacing: '0.08em', color: '#F8FAFC', opacity: 0.75 }}>
        Delvox <span style={{ background: 'linear-gradient(90deg,#38BDF8,#2563EB)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Labs</span>
      </p>
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const nav = ['Services', 'Portfolio', 'Process', 'About', 'Contact']
  const goto = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-border py-3' : 'py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5"
        >
          <LogoMark size={28} uid="nav" />
          <span className="font-display font-bold text-text text-lg tracking-tight">
            Delvox <span className="text-gradient">Labs</span>
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-7">
          {nav.map((n) => (
            <button
              key={n}
              onClick={() => goto(n)}
              className="font-body text-text-2 text-sm hover:text-text transition-colors duration-200 font-medium"
            >
              {n}
            </button>
          ))}
        </nav>

        <a
          href="mailto:madhavs.work07@gmail.com"
          className="btn-primary relative hidden md:inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl z-10"
        >
          <span className="relative z-10">Start a Project</span>
          <ArrowRight size={14} className="relative z-10" />
        </a>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-text-2 hover:text-text transition-colors p-1"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass border-t border-border">
          <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col gap-4">
            {nav.map((n) => (
              <button
                key={n}
                onClick={() => goto(n)}
                className="text-left text-text-2 hover:text-text font-medium py-1 transition-colors"
              >
                {n}
              </button>
            ))}
            <a
              href="mailto:madhavs.work07@gmail.com"
              className="btn-primary relative text-center text-white text-sm font-semibold px-5 py-3 rounded-xl z-10 mt-1"
            >
              <span className="relative z-10">Start a Project</span>
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const badgeRef  = useRef(null)
  const h1Ref     = useRef(null)
  const subRef    = useRef(null)
  const ctaRef    = useRef(null)
  const statsRef  = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.1 })
    tl.fromTo(badgeRef.current,  { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
      .fromTo(h1Ref.current,     { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.2')
      .fromTo(subRef.current,    { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .fromTo(ctaRef.current,    { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
      .fromTo(statsRef.current,  { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
  }, [])

  return (
    <section className="relative min-h-screen flex items-center grid-bg overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80"
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-bg/88" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/50 via-transparent to-bg" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/70 via-transparent to-bg/70" />
      </div>

      <CodeRain />

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/8 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full bg-accent/5 blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-24 w-full">
        <div className="max-w-3xl">
          <div ref={badgeRef} className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-accent text-xs font-medium tracking-widest uppercase">
              Solo dev · AI-first · Building in Public
            </span>
          </div>

          <h1
            ref={h1Ref}
            className="font-display font-extrabold text-5xl md:text-[68px] leading-[1.04] tracking-tight text-text mb-6"
          >
            We Build the{' '}
            <em className="font-serif not-italic text-gradient">AI Layer</em>
            <br />
            for Small Business
          </h1>

          <p
            ref={subRef}
            className="font-body text-text-2 text-lg md:text-xl leading-relaxed mb-10 max-w-[520px]"
          >
            Websites, automation, and AI agents for small businesses — the kind of work that used to require a whole team. Built on Claude AI, shipped in days, not months.
          </p>

          <div ref={ctaRef} className="flex flex-wrap items-center gap-4">
            <a
              href="mailto:madhavs.work07@gmail.com"
              className="btn-primary relative group inline-flex items-center gap-2.5 text-white font-semibold px-7 py-4 rounded-xl text-base z-10"
            >
              <span className="relative z-10">Start a Project</span>
              <ArrowRight
                size={18}
                className="relative z-10 transition-transform duration-200 group-hover:translate-x-1"
              />
            </a>
            <button
              onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 text-text-2 hover:text-text font-medium text-base transition-colors duration-200"
            >
              See the Work <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div
          ref={statsRef}
          className="mt-20 pt-8 border-t border-border/40 flex flex-wrap gap-10"
        >
          {[
            { value: 'FixIt Plumbers', label: 'First Client — Live' },
            { value: 'Claude AI',      label: 'Core Engine' },
            { value: 'Open',           label: 'Taking New Work' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="font-display font-extrabold text-2xl text-text">{value}</div>
              <div className="font-mono text-xs text-muted uppercase tracking-widest mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted pointer-events-none">
        <span className="font-mono text-xs uppercase tracking-widest">scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-muted/60 to-transparent" />
      </div>
    </section>
  )
}

// ─── Services ─────────────────────────────────────────────────────────────────
function Services() {
  const ref = useRef(null)

  useEffect(() => {
    gsap.fromTo(
      ref.current.querySelectorAll('.svc-card'),
      { opacity: 0, y: 48 },
      {
        opacity: 1, y: 0, duration: 0.65, stagger: 0.14, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 78%' },
      }
    )
  }, [])

  const SERVICES = [
    {
      icon: <Globe size={22} />,
      title: 'AI-Powered Websites',
      desc: 'Fast, modern React sites that actually convert — with AI baked in where it counts. Smart contact forms, instant visitor answers, and copy that doesn\'t read like a brochure.',
      tags: ['React', 'Claude AI', 'Tailwind'],
    },
    {
      icon: <Zap size={22} />,
      title: 'Business Automations',
      desc: 'Python and n8n workflows that handle the tedious stuff — follow-ups, scheduling, form routing, notifications. The work that eats your day, automated in days.',
      tags: ['Python', 'n8n', 'APIs'],
    },
    {
      icon: <Bot size={22} />,
      title: 'AI Agents',
      desc: 'Claude AI agents built around how your business actually runs — not a generic chatbot dropped on a page. They answer questions, qualify leads, and handle intake while you\'re busy.',
      tags: ['Claude AI', 'LangChain', 'Voice'],
    },
  ]

  return (
    <section id="services" ref={ref} className="py-28 max-w-6xl mx-auto px-6">
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-px bg-primary" />
          <span className="font-mono text-primary text-xs uppercase tracking-widest">What I Build</span>
        </div>
        <h2 className="font-display font-extrabold text-4xl md:text-5xl text-text mb-4 leading-tight">
          Three Services.{' '}
          <span className="text-gradient">No Retainers.</span>
        </h2>
        <p className="font-body text-text-2 text-lg max-w-lg">
          Pick what your business needs right now. No upselling, no packages — just the thing that actually solves the problem.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {SERVICES.map(({ icon, title, desc, tags }) => (
          <div
            key={title}
            className="svc-card card-hover bg-surface rounded-2xl p-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 group-hover:bg-primary/20 transition-colors duration-300">
              {icon}
            </div>
            <h3 className="font-display font-bold text-xl text-text mb-3">{title}</h3>
            <p className="font-body text-text-2 text-sm leading-relaxed mb-6">{desc}</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="font-mono text-xs text-accent bg-accent/8 border border-accent/20 rounded-full px-3 py-1"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── CaseStudyModal ───────────────────────────────────────────────────────────
function CaseStudyModal({ onClose }) {
  const overlayRef = useRef(null)
  const panelRef  = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' })
    gsap.fromTo(panelRef.current,   { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out', delay: 0.06 })
    return () => { document.body.style.overflow = '' }
  }, [])

  const close = () => {
    gsap.to(panelRef.current,  { y: 32, opacity: 0, duration: 0.28, ease: 'power2.in' })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.32, ease: 'power2.in', delay: 0.04, onComplete: onClose })
  }

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const buildItems = [
    'Full responsive site — designed mobile-first because that\'s where plumbing searches happen',
    'Dedicated service pages: emergency repairs, boiler servicing, bathroom installs, leak detection',
    'Contact form that routes directly to their email inbox — no third-party booking tool needed',
    'Trust signals: Gas Safe registration badge, customer review highlights, response-time promise',
    'Animated hero, smooth scroll, sub-1s load time on mobile',
    'Deployed on Vercel with a custom domain — indexed by Google within 24 hours',
  ]

  const stackItems = [
    { label: 'Claude Code', note: 'wrote and iterated the entire build' },
    { label: 'React + Vite', note: 'component-based frontend, fast HMR' },
    { label: 'Tailwind CSS', note: 'utility-first styling, no design system overhead' },
    { label: 'GSAP', note: 'scroll animations, hero entrance' },
    { label: 'Vercel', note: 'CI/CD on push, edge network delivery' },
  ]

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === e.currentTarget) close() }}
      className="fixed inset-0 z-[2000] overflow-y-auto"
      style={{ background: 'rgba(8,12,20,0.88)', backdropFilter: 'blur(10px)' }}
    >
      <div ref={panelRef} className="max-w-3xl mx-auto px-6 py-16">

        {/* Back button */}
        <button
          onClick={close}
          className="flex items-center gap-2 font-mono text-xs text-muted hover:text-text transition-colors mb-12 group"
        >
          <ChevronRight size={13} className="rotate-180 group-hover:-translate-x-0.5 transition-transform" />
          Back to portfolio
        </button>

        {/* Header */}
        <div className="mb-12">
          <p className="font-mono text-primary text-xs uppercase tracking-widest mb-3">Case Study · Client #1</p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-text leading-tight mb-4">
            FixIt Plumbers
          </h2>
          <p className="font-body text-text-2 text-lg leading-relaxed max-w-xl">
            A local plumbing company in London with no website, no online presence, and no way for new customers to find them. This is what got built, how, and in how long.
          </p>
        </div>

        {/* Pull-quote stat */}
        <div className="relative rounded-2xl border border-accent/20 bg-surface p-8 mb-14 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 pointer-events-none" />
          <p className="font-mono text-xs text-accent uppercase tracking-widest mb-3">The number that matters</p>
          <p className="font-display font-extrabold text-5xl md:text-6xl text-text leading-none mb-4">
            6 days.
          </p>
          <p className="font-display text-2xl text-text-2">Zero to live.</p>
          <p className="font-body text-text-2 text-sm mt-4 max-w-md leading-relaxed">
            From first conversation to a deployed, indexed, production website. No templates, no page builders — written from scratch and shipped.
          </p>
        </div>

        {/* 01 — The Problem */}
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-primary text-xs">01</span>
            <div className="flex-1 h-px bg-border" />
            <span className="font-mono text-muted text-xs uppercase tracking-widest">The Problem</span>
          </div>
          <p className="font-body text-text-2 leading-relaxed mb-4">
            FixIt had been running for years entirely on word-of-mouth and a basic Google Business listing — name, phone number, a handful of reviews. That was it.
          </p>
          <p className="font-body text-text-2 leading-relaxed mb-4">
            No website meant no way to show what services they actually offered. No way to display pricing context. No way to build trust before a customer picked up the phone. Every new job was a cold call to a stranger who found a number on Google.
          </p>
          <p className="font-body text-text-2 leading-relaxed">
            Competitors with even basic websites were getting chosen first. Not because they were better — just because they showed up as more credible online.
          </p>
        </div>

        {/* Before / After */}
        <div className="grid md:grid-cols-2 gap-4 mb-14">
          {/* Before */}
          <div className="rounded-xl border border-border bg-bg p-5">
            <p className="font-mono text-xs text-muted uppercase tracking-widest mb-4">Before</p>
            <div className="rounded-lg border border-border/60 bg-surface p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Globe size={14} className="text-primary/50" />
                </div>
                <div>
                  <p className="font-display font-semibold text-text text-sm">FixIt Plumbers</p>
                  <p className="font-mono text-[10px] text-muted mt-0.5">Google Business Profile</p>
                </div>
              </div>
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xs">★</span>
                ))}
                <span className="font-mono text-[10px] text-muted ml-1">12 reviews</span>
              </div>
              <p className="font-mono text-xs text-muted">📞 07700 900 123</p>
              <p className="font-mono text-xs text-muted mt-1">📍 Bermondsey, London</p>
              <div className="mt-3 pt-3 border-t border-border/40">
                <p className="font-mono text-[10px] text-muted/60 italic">No website · No service info · No booking</p>
              </div>
            </div>
          </div>
          {/* After */}
          <div className="rounded-xl border border-accent/20 bg-bg overflow-hidden">
            <p className="font-mono text-xs text-accent uppercase tracking-widest p-5 pb-3">After</p>
            <div className="relative h-44 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&q=80"
                alt="FixIt Plumbers live website"
                className="w-full h-full object-cover opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent" />
              <div className="absolute bottom-3 left-4 flex gap-2">
                <span className="font-mono text-[10px] text-accent bg-bg/80 border border-accent/30 rounded-full px-2 py-0.5">Live</span>
                <span className="font-mono text-[10px] text-text-2 bg-bg/80 border border-border rounded-full px-2 py-0.5">fixit-plumbers.vercel.app</span>
              </div>
            </div>
          </div>
        </div>

        {/* 02 — The Build */}
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-primary text-xs">02</span>
            <div className="flex-1 h-px bg-border" />
            <span className="font-mono text-muted text-xs uppercase tracking-widest">The Build</span>
          </div>
          <p className="font-body text-text-2 leading-relaxed mb-6">
            Not a template. Not a Wix site. A custom-built React application written specifically for their business, their services, and their customers.
          </p>
          <ul className="space-y-3">
            {buildItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="font-mono text-accent text-xs mt-1 flex-shrink-0">→</span>
                <span className="font-body text-text-2 text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 03 — The Approach */}
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-primary text-xs">03</span>
            <div className="flex-1 h-px bg-border" />
            <span className="font-mono text-muted text-xs uppercase tracking-widest">The Approach</span>
          </div>
          <p className="font-body text-text-2 leading-relaxed mb-6">
            The whole build ran through Claude Code — I described what I needed, iterated on the output, and pushed when it was right. That's how a solo 18-year-old ships a production site in under a week.
          </p>
          <p className="font-body text-text-2 leading-relaxed mb-8">
            No agency overhead. No project manager handoffs. One person, clear requirements, the right tools. The client got daily progress updates, saw the site take shape in real time, and signed off on a live URL six days after we started.
          </p>
          <div className="rounded-xl bg-surface border border-border overflow-hidden">
            {stackItems.map((s, i) => (
              <div key={i} className={`flex items-center justify-between px-5 py-3.5 ${i < stackItems.length - 1 ? 'border-b border-border' : ''}`}>
                <span className="font-mono text-sm text-accent">{s.label}</span>
                <span className="font-body text-text-2 text-xs text-right max-w-[55%]">{s.note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-8 border-t border-border">
          <a
            href="https://fixit-plumbers.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            View live site <ExternalLink size={13} />
          </a>
          <button
            onClick={close}
            className="font-mono text-xs text-muted hover:text-text transition-colors"
          >
            ← Back to portfolio
          </button>
        </div>

      </div>
    </div>
  )
}

// ─── Portfolio ────────────────────────────────────────────────────────────────
function Portfolio() {
  const ref = useRef(null)
  const [caseStudyOpen, setCaseStudyOpen] = useState(false)

  useEffect(() => {
    gsap.fromTo(
      ref.current.querySelectorAll('.port-card'),
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.65, stagger: 0.18, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 78%' },
      }
    )
  }, [])

  return (
    <>
      {caseStudyOpen && <CaseStudyModal onClose={() => setCaseStudyOpen(false)} />}
      <section id="portfolio" ref={ref} className="py-28 bg-surface">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-primary" />
              <span className="font-mono text-primary text-xs uppercase tracking-widest">Work</span>
            </div>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-text mb-4 leading-tight">
              First Client <span className="text-gradient">Out the Door</span>
            </h2>
            <p className="font-body text-text-2 text-lg max-w-lg">
              One live project so far. More in the pipeline. This is what Delvox actually ships.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="port-card card-hover rounded-2xl overflow-hidden bg-bg group cursor-pointer" onClick={() => setCaseStudyOpen(true)}>
              <div className="relative h-52 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&q=80"
                  alt="FixIt Plumbers website"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/95 via-bg/30 to-transparent" />
                <div className="absolute bottom-4 left-5 flex gap-2">
                  {['React', 'Vite', 'Tailwind'].map((t) => (
                    <span key={t} className="font-mono text-xs text-accent bg-bg/80 border border-accent/30 rounded-full px-2.5 py-0.5">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display font-bold text-xl text-text">FixIt Plumbers</h3>
                    <p className="font-mono text-xs text-muted mt-1">Local Plumbing Company · Client #1</p>
                  </div>
                  <a
                    href="https://fixit-plumbers.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors flex-shrink-0"
                    title="View live site"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
                <p className="font-body text-text-2 text-sm leading-relaxed mb-4">
                  My first client. A complete website for a local plumbing company — animated hero, mobile-first layout, contact form that routes straight to their inbox. Went from zero to live in 6 days.
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); setCaseStudyOpen(true) }}
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:text-text transition-colors group/link"
                >
                  View case study <ChevronRight size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            <div className="port-card card-hover rounded-2xl overflow-hidden bg-bg group">
              <div className="h-52 flex items-center justify-center bg-gradient-to-br from-surface to-bg border border-dashed border-border/50">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center mx-auto mb-3">
                    <Code2 size={22} className="text-primary/40" />
                  </div>
                  <p className="font-mono text-xs text-muted uppercase tracking-widest">Slot #2</p>
                  <p className="font-body text-text-2 text-sm mt-1.5">Open</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display font-bold text-xl text-text mb-2">Your Business Here</h3>
                <p className="font-body text-text-2 text-sm leading-relaxed">
                  I take on one or two projects at a time so nothing gets rushed. If you're interested, reach out early — slots fill up fast when you charge honest prices.
                </p>
                <a
                  href="mailto:madhavs.work07@gmail.com"
                  className="inline-flex items-center gap-1.5 text-primary text-sm font-medium mt-4 hover:text-accent transition-colors duration-200"
                >
                  Get in touch <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

// ─── Process ──────────────────────────────────────────────────────────────────
function Process() {
  const ref = useRef(null)

  useEffect(() => {
    gsap.fromTo(
      ref.current.querySelectorAll('.step-card'),
      { opacity: 0, x: -24 },
      {
        opacity: 1, x: 0, duration: 0.6, stagger: 0.18, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 78%' },
      }
    )
  }, [])

  const STEPS = [
    {
      num: '01', icon: <MessageSquare size={20} />, title: 'Consult',
      desc: "We spend 30–60 minutes figuring out what you actually need — not what sounds impressive. I'll tell you honestly if AI is the right fit, or if the simpler thing is just a better website.",
      duration: '1–2 days',
    },
    {
      num: '02', icon: <Code2 size={20} />, title: 'Build',
      desc: "I build it. You get a staging link at each milestone. If something's off, we fix it before moving forward. All code lives on GitHub from day one — no black box.",
      duration: '3–10 days',
    },
    {
      num: '03', icon: <Globe size={20} />, title: 'Deploy',
      desc: "We push it live together. I walk you through everything, document what I built, and stay reachable for two weeks after handoff. No disappearing act after the last invoice.",
      duration: '1–2 days',
    },
  ]

  return (
    <section id="process" ref={ref} className="py-28 max-w-6xl mx-auto px-6">
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-px bg-primary" />
          <span className="font-mono text-primary text-xs uppercase tracking-widest">How It Goes</span>
        </div>
        <h2 className="font-display font-extrabold text-4xl md:text-5xl text-text mb-4 leading-tight">
          How a Project <span className="text-gradient">Actually Works</span>
        </h2>
        <p className="font-body text-text-2 text-lg max-w-lg">
          Three phases. You'll know exactly where things stand at every step.
        </p>
      </div>

      <div className="relative">
        <div className="absolute top-10 left-14 right-14 h-px bg-gradient-to-r from-primary/25 via-accent/30 to-primary/25 hidden md:block" />

        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map(({ num, icon, title, desc, duration }) => (
            <div key={num} className="step-card bg-surface rounded-2xl p-8 border border-border relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary flex-shrink-0">
                  {icon}
                </div>
                <span className="font-mono text-5xl font-bold text-primary/15 leading-none">{num}</span>
              </div>
              <h3 className="font-display font-bold text-xl text-text mb-3">{title}</h3>
              <p className="font-body text-text-2 text-sm leading-relaxed mb-5">{desc}</p>
              <div className="inline-flex items-center gap-1.5 font-mono text-xs text-accent bg-accent/8 border border-accent/20 rounded-full px-3 py-1">
                <Clock size={11} />
                {duration}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── About ────────────────────────────────────────────────────────────────────
function About() {
  const ref = useRef(null)

  useEffect(() => {
    gsap.fromTo(
      ref.current.querySelectorAll('.about-el'),
      { opacity: 0, y: 28 },
      {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 78%' },
      }
    )
  }, [])

  return (
    <section id="about" ref={ref} className="py-28 bg-surface">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="about-el flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-primary" />
              <span className="font-mono text-primary text-xs uppercase tracking-widest">The Founder</span>
            </div>
            <h2 className="about-el font-display font-extrabold text-4xl md:text-5xl text-text mb-6 leading-tight">
              Why an 18-Year-Old{' '}
              <em className="font-serif not-italic text-gradient">Built This</em>
            </h2>
            <p className="about-el font-body text-text-2 text-base leading-relaxed mb-5">
              I'm Madhav. I started Delvox Labs at 18 because I wanted to build real things that solve real problems, and small businesses kept coming up as the obvious place to do that. Most of them are running on a website that hasn't changed since 2015, a Google Form, and someone manually forwarding emails.
            </p>
            <p className="about-el font-body text-text-2 text-base leading-relaxed mb-8">
              My first client was a plumbing company. I built their whole site from scratch in under a week. That proved the model: fast builds, real tooling, honest pricing. I'm doing this in public, sharing every project, every lesson, every misstep, because I think the best way to grow is to just ship things and talk about it.
            </p>
            <div className="about-el flex flex-wrap gap-2.5">
              {['Building in Public', 'Solo Founder', 'AI-First', 'Ships Fast'].map((tag) => (
                <span key={tag} className="font-mono text-xs text-text-2 bg-bg border border-border rounded-full px-3 py-1.5">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="about-el">
            <div className="glass rounded-3xl p-8 border-primary/20 border relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                {/* Avatar placeholder */}
                <div className="flex items-center gap-4 mb-7">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 select-none">
                    <span className="font-display font-extrabold text-white text-lg tracking-tight">MS</span>
                  </div>
                  <div>
                    <div className="font-display font-bold text-text text-lg">Madhav Sharma</div>
                    <div className="font-mono text-xs text-primary mt-0.5">Founder, Delvox Labs</div>
                  </div>
                </div>

                <div className="space-y-0">
                  {[
                    { label: 'Age',          value: '18 years old' },
                    { label: 'First client', value: 'FixIt Plumbers' },
                    { label: 'Stack',        value: 'React · Python · Claude AI' },
                    { label: 'Status',       value: 'Taking new clients' },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex justify-between items-center py-3 border-b border-border/40 last:border-0"
                    >
                      <span className="font-mono text-xs text-muted uppercase tracking-wider">{label}</span>
                      <span className="font-body text-sm text-text-2">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                  <span className="font-mono text-xs text-text-2">Available for new projects</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Tech Stack ───────────────────────────────────────────────────────────────
function TechStack() {
  const ref = useRef(null)

  useEffect(() => {
    gsap.fromTo(
      ref.current.querySelectorAll('.tech-badge'),
      { opacity: 0, scale: 0.85 },
      {
        opacity: 1, scale: 1, duration: 0.4, stagger: 0.07, ease: 'back.out(1.5)',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      }
    )
  }, [])

  const STACK = [
    { name: 'Claude AI',    emoji: '🧠' },
    { name: 'React',        emoji: '⚛️' },
    { name: 'Python',       emoji: '🐍' },
    { name: 'Vite',         emoji: '⚡' },
    { name: 'Tailwind CSS', emoji: '🎨' },
    { name: 'Node.js',      emoji: '🟢' },
    { name: 'n8n',          emoji: '🔗' },
    { name: 'GSAP',         emoji: '✨' },
  ]

  return (
    <section id="techstack" ref={ref} className="py-28 max-w-6xl mx-auto px-6">
      <div className="mb-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="w-8 h-px bg-primary" />
          <span className="font-mono text-primary text-xs uppercase tracking-widest">The Stack</span>
          <div className="w-8 h-px bg-primary" />
        </div>
        <h2 className="font-display font-extrabold text-4xl md:text-5xl text-text mb-4 leading-tight">
          Tools I <span className="text-gradient">Actually Use</span>
        </h2>
        <p className="font-body text-text-2 text-lg max-w-lg mx-auto">
          No bloated frameworks picked for the résumé. Every tool here earned its place in the last few months of shipping real projects.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-14">
        {STACK.map(({ name, emoji }) => (
          <div
            key={name}
            className="tech-badge glass rounded-xl px-5 py-3 flex items-center gap-3 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 cursor-default"
          >
            <span className="text-xl" role="img" aria-label={name}>{emoji}</span>
            <span className="font-display font-semibold text-text text-sm">{name}</span>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6 border-primary/20">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
          <span className="font-mono text-xs text-muted ml-3">delvox-labs — terminal</span>
        </div>
        <div className="font-mono text-sm space-y-2">
          <p className="text-text-2">
            <span className="text-primary">❯ </span>
            <span className="text-accent">node</span> scripts/ship-fixit.js
          </p>
          <p className="text-muted text-xs pl-4">✓ Building React site...</p>
          <p className="text-muted text-xs pl-4">✓ Running Claude AI on contact form logic...</p>
          <p className="text-muted text-xs pl-4">✓ Deploying to prod...</p>
          <p className="text-green-400 text-xs pl-4">✓ Done. Client got their site in 6 days.</p>
          <p className="text-text-2 pt-1">
            <span className="text-primary">❯ </span>
            <span className="cursor-blink">█</span>
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function Contact() {
  const ref = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', business: '', message: '' })
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      }
    )
  }, [])

  const set = useCallback((key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value })), [])

  const submit = (e) => {
    e.preventDefault()
    setStatus('sending')
    setTimeout(() => setStatus('sent'), 1500)
  }

  const inputClass =
    'w-full bg-bg border border-border rounded-xl px-4 py-3 text-text placeholder-muted font-body text-sm transition-colors duration-200'

  const connectLinks = [
    {
      icon: <Mail size={15} />,
      label: 'Email',
      value: 'madhavs.work07@gmail.com',
      href: 'mailto:madhavs.work07@gmail.com',
    },
    {
      icon: <LinkedinIcon />,
      label: 'LinkedIn',
      value: null,
      href: null,
    },
    {
      icon: <GithubIcon />,
      label: 'GitHub',
      value: 'madhavvsharmma7',
      href: 'https://github.com/madhavvsharmma7',
    },
    {
      icon: <XIcon />,
      label: 'X',
      value: '@madhavvsharmma',
      href: 'https://x.com/madhavvsharmma',
    },
    {
      icon: <Phone size={15} />,
      label: 'Phone',
      value: null,
      href: null,
    },
  ]

  return (
    <section id="contact" ref={ref} className="py-28 bg-surface">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-px bg-primary" />
            <span className="font-mono text-primary text-xs uppercase tracking-widest">Start Something</span>
            <div className="w-8 h-px bg-primary" />
          </div>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-text mb-4 leading-tight">
            Got a Project? <span className="text-gradient">Let's Talk.</span>
          </h2>
          <p className="font-body text-text-2 text-lg max-w-md mx-auto">
            No sales calls. Just a quick message about what you're working on — I reply the same day.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* Form */}
          <div className="lg:col-span-2 glass rounded-3xl p-8 md:p-10">
            {status === 'sent' ? (
              <div className="text-center py-14">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-5">
                  <Check size={28} className="text-green-400" />
                </div>
                <h3 className="font-display font-bold text-2xl text-text mb-2">Got it — thanks.</h3>
                <p className="font-body text-text-2">I'll reply today or first thing tomorrow.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">Your Name</label>
                    <input type="text" required value={form.name} onChange={set('name')} placeholder="Jane Smith" className={inputClass} />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">Email</label>
                    <input type="email" required value={form.email} onChange={set('email')} placeholder="you@company.com" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">Business / Project</label>
                  <input type="text" value={form.business} onChange={set('business')} placeholder="What kind of business do you run?" className={inputClass} />
                </div>
                <div>
                  <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">What do you need?</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={set('message')}
                    placeholder="Describe the problem you're trying to solve. The messier the better — I can figure out the solution."
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="btn-primary relative inline-flex items-center gap-2 text-white font-semibold px-8 py-3.5 rounded-xl z-10 disabled:opacity-60 w-full sm:w-auto justify-center"
                  >
                    <span className="relative z-10">
                      {status === 'sending' ? 'Sending…' : 'Send Message'}
                    </span>
                    <Send size={15} className="relative z-10" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Connect */}
          <div className="glass rounded-3xl p-8">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-6">Connect</p>
            <div className="space-y-1">
              {connectLinks.map(({ icon, label, value, href }) => {
                const inner = (
                  <div className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-colors duration-200 ${href ? 'hover:bg-white/5 cursor-pointer' : 'opacity-40 cursor-default'}`}>
                    <span className="text-primary flex-shrink-0 w-4 flex items-center justify-center">{icon}</span>
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] text-muted uppercase tracking-widest leading-none mb-1">{label}</p>
                      <p className="font-body text-sm text-text truncate">
                        {value ?? <span className="text-muted italic text-xs">— add later</span>}
                      </p>
                    </div>
                  </div>
                )
                return href ? (
                  <a key={label} href={href} target={href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer">
                    {inner}
                  </a>
                ) : (
                  <div key={label}>{inner}</div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-12 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <LogoMark size={24} uid="foot" />
            <span className="font-display font-bold text-text">
              Delvox <span className="text-gradient">Labs</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-xs text-muted">All systems operational</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="mailto:madhavs.work07@gmail.com" aria-label="Email" className="text-muted hover:text-text transition-colors duration-200">
              <Mail size={18} />
            </a>
            <a href="https://github.com/madhavvsharmma7" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted hover:text-text transition-colors duration-200">
              <GithubIcon />
            </a>
            <a href="https://x.com/madhavvsharmma" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter" className="text-muted hover:text-text transition-colors duration-200">
              <XIcon />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-mono text-xs text-muted">
            © {new Date().getFullYear()} Delvox Labs. Built with Claude AI &amp; React.
          </p>
          <div className="flex items-center gap-5">
            <span className="font-mono text-xs text-muted cursor-pointer hover:text-text-2 transition-colors">Privacy Policy</span>
            <span className="font-mono text-xs text-muted cursor-pointer hover:text-text-2 transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [loading, setLoading] = useState(true)
  return (
    <>
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      <div className="bg-bg text-text min-h-screen">
        <Navbar />
        <Hero />
        <Services />
        <Portfolio />
        <Process />
        <About />
        <TechStack />
        <Contact />
        <Footer />
      </div>
    </>
  )
}
