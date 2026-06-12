import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Globe, Zap, Bot, ArrowRight, Mail,
  Code2, Terminal, ExternalLink, Menu, X,
  ChevronRight, Clock, Send, MessageSquare,
  Cpu, Layers, Check,
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
import './index.css'

gsap.registerPlugin(ScrollTrigger)

// ─── Signature Animation: Code Rain (Tech/SaaS theme) ───────────────────────
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
    const draw = () => {
      ctx.fillStyle = 'rgba(8, 12, 20, 0.06)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${FONT_SIZE}px "JetBrains Mono", monospace`

      cols = Math.floor(canvas.width / FONT_SIZE)
      while (drops.length < cols) drops.push(0)

      drops.forEach((y, i) => {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)]
        const progress = y / canvas.height
        if (progress < 0.2) ctx.fillStyle = '#38BDF8'
        else if (progress < 0.6) ctx.fillStyle = '#2563EB'
        else ctx.fillStyle = 'rgba(37,99,235,0.25)'

        ctx.fillText(char, i * FONT_SIZE, y)

        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i] += FONT_SIZE * 0.65
      })

      raf = requestAnimationFrame(draw)
    }

    let lastFrame = 0
    const throttledDraw = (ts) => {
      raf = requestAnimationFrame(throttledDraw)
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

    raf = requestAnimationFrame(throttledDraw)

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

// ─── Navbar ──────────────────────────────────────────────────────────────────
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
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5"
        >
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Terminal size={13} className="text-white" />
          </div>
          <span className="font-display font-bold text-text text-lg tracking-tight">
            Delvox <span className="text-gradient">Labs</span>
          </span>
        </button>

        {/* Desktop links */}
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

      {/* Mobile drawer */}
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
  const badgeRef = useRef(null)
  const h1Ref   = useRef(null)
  const subRef  = useRef(null)
  const ctaRef  = useRef(null)
  const statsRef = useRef(null)

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
      {/* BG image + overlays */}
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

      {/* Signature code rain */}
      <CodeRain />

      {/* Glow orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/8 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full bg-accent/5 blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-24 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div ref={badgeRef} className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-accent text-xs font-medium tracking-widest uppercase">
              AI-Powered Development Studio
            </span>
          </div>

          {/* Headline */}
          <h1
            ref={h1Ref}
            className="font-display font-extrabold text-5xl md:text-[68px] leading-[1.04] tracking-tight text-text mb-6"
          >
            We Build the{' '}
            <em className="font-serif not-italic text-gradient">AI Layer</em>
            <br />
            for Small Business
          </h1>

          {/* Sub */}
          <p
            ref={subRef}
            className="font-body text-text-2 text-lg md:text-xl leading-relaxed mb-10 max-w-[520px]"
          >
            Delvox Labs crafts AI-powered websites and automation systems that
            turn small businesses into lean, 24/7 digital operations — built on Claude AI.
          </p>

          {/* CTA buttons */}
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
              See Our Work <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div
          ref={statsRef}
          className="mt-20 pt-8 border-t border-border/40 flex flex-wrap gap-10"
        >
          {[
            { value: '7 Days',     label: 'Avg Delivery' },
            { value: 'Claude AI',  label: 'Core Engine' },
            { value: 'React + Py', label: 'Primary Stack' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="font-display font-extrabold text-2xl text-text">{value}</div>
              <div className="font-mono text-xs text-muted uppercase tracking-widest mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
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
      desc: 'Premium, conversion-optimised websites built with React and infused with AI — chatbots, smart forms, and personalisation baked in from day one.',
      tags: ['React', 'Claude AI', 'Tailwind'],
    },
    {
      icon: <Zap size={22} />,
      title: 'Business Automations',
      desc: 'Eliminate repetitive work with custom automation pipelines. From lead follow-up to invoice generation — we automate the bottlenecks holding you back.',
      tags: ['Python', 'n8n', 'APIs'],
    },
    {
      icon: <Bot size={22} />,
      title: 'AI Agents',
      desc: 'Deploy intelligent AI agents that handle customer inquiries, qualify leads, and run workflows 24/7 — without you lifting a finger.',
      tags: ['Claude AI', 'LangChain', 'Voice'],
    },
  ]

  return (
    <section id="services" ref={ref} className="py-28 max-w-6xl mx-auto px-6">
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-px bg-primary" />
          <span className="font-mono text-primary text-xs uppercase tracking-widest">What We Build</span>
        </div>
        <h2 className="font-display font-extrabold text-4xl md:text-5xl text-text mb-4 leading-tight">
          Three Ways We{' '}
          <span className="text-gradient">Upgrade</span> Your Business
        </h2>
        <p className="font-body text-text-2 text-lg max-w-lg">
          Every service compounds — a website that learns, automations that scale, agents that grow.
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

// ─── Portfolio ────────────────────────────────────────────────────────────────
function Portfolio() {
  const ref = useRef(null)

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
    <section id="portfolio" ref={ref} className="py-28 bg-surface">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-primary" />
            <span className="font-mono text-primary text-xs uppercase tracking-widest">Live Projects</span>
          </div>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-text mb-4 leading-tight">
            Built &amp; <span className="text-gradient">Shipped</span>
          </h2>
          <p className="font-body text-text-2 text-lg max-w-lg">
            Real projects for real businesses. Every line of code built to perform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* FixIt Plumbers */}
          <div className="port-card card-hover rounded-2xl overflow-hidden bg-bg group">
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
                  <p className="font-mono text-xs text-muted mt-1">Local Service Business</p>
                </div>
                <a
                  href="http://localhost:5173"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors flex-shrink-0"
                  title="View project"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
              <p className="font-body text-text-2 text-sm leading-relaxed">
                Premium plumbing service website with animated sections, contact automation, and local SEO — built and deployed in under a week using the Delvox stack.
              </p>
            </div>
          </div>

          {/* Coming soon */}
          <div className="port-card card-hover rounded-2xl overflow-hidden bg-bg group">
            <div className="h-52 flex items-center justify-center border border-dashed border-border/50 m-0 bg-gradient-to-br from-surface to-bg">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center mx-auto mb-3">
                  <Code2 size={22} className="text-primary/40" />
                </div>
                <p className="font-mono text-xs text-muted uppercase tracking-widest">Next Project</p>
                <p className="font-body text-text-2 text-sm mt-1.5">Currently In Build</p>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-display font-bold text-xl text-text mb-2">Your Business Here</h3>
              <p className="font-body text-text-2 text-sm leading-relaxed">
                We're taking on new clients. Let's build something that makes your competitors nervous — fast.
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
      desc: "We start with a deep-dive into your business — goals, bottlenecks, current tools. No cookie-cutter proposals. Just honest strategy.",
      duration: '1–2 days',
    },
    {
      num: '02', icon: <Code2 size={20} />, title: 'Build',
      desc: "We engineer your solution from scratch using modern, AI-first tooling. You get daily updates, GitHub access, and zero surprises.",
      duration: '3–10 days',
    },
    {
      num: '03', icon: <Globe size={20} />, title: 'Deploy',
      desc: "We launch, test, and hand you the keys. Full documentation, live training, and ongoing support — we don't disappear post-delivery.",
      duration: '1–2 days',
    },
  ]

  return (
    <section id="process" ref={ref} className="py-28 max-w-6xl mx-auto px-6">
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-px bg-primary" />
          <span className="font-mono text-primary text-xs uppercase tracking-widest">How It Works</span>
        </div>
        <h2 className="font-display font-extrabold text-4xl md:text-5xl text-text mb-4 leading-tight">
          From Idea to <span className="text-gradient">Live</span> in Days
        </h2>
        <p className="font-body text-text-2 text-lg max-w-lg">
          A tight, three-phase process built to ship fast without cutting corners on quality.
        </p>
      </div>

      <div className="relative">
        {/* Connector line (desktop) */}
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
          {/* Text */}
          <div>
            <div className="about-el flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-primary" />
              <span className="font-mono text-primary text-xs uppercase tracking-widest">The Founder</span>
            </div>
            <h2 className="about-el font-display font-extrabold text-4xl md:text-5xl text-text mb-6 leading-tight">
              Building the Future of{' '}
              <em className="font-serif not-italic text-gradient">Small Business AI</em>
            </h2>
            <p className="about-el font-body text-text-2 text-base leading-relaxed mb-5">
              I'm Madhav — 18 years old and building Delvox Labs entirely in public. I started this studio because I saw a clear gap: enterprise companies were getting AI-supercharged tooling while small businesses were stuck with outdated websites and manual workflows.
            </p>
            <p className="about-el font-body text-text-2 text-base leading-relaxed mb-8">
              Every project I take on is proof that small businesses deserve the same quality of AI infrastructure as Fortune 500 companies — built by someone who actually cares about the outcome, not just the invoice.
            </p>
            <div className="about-el flex flex-wrap gap-2.5">
              {['Building in Public', 'AI-First', 'Results-Driven', 'Claude AI Partner'].map((tag) => (
                <span key={tag} className="font-mono text-xs text-text-2 bg-bg border border-border rounded-full px-3 py-1.5">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Card */}
          <div className="about-el">
            <div className="glass rounded-3xl p-8 border-primary/20 border relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-7">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-display font-extrabold text-white flex-shrink-0">
                    M
                  </div>
                  <div>
                    <div className="font-display font-bold text-text text-lg">Madhav Sharma</div>
                    <div className="font-mono text-xs text-primary mt-0.5">Founder, Delvox Labs</div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-0">
                  {[
                    { label: 'Age',    value: '18 years old' },
                    { label: 'Stack',  value: 'React · Python · Claude AI' },
                    { label: 'Model',  value: 'Building in Public' },
                    { label: 'Status', value: 'Open for clients' },
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
    { name: 'Claude AI',     emoji: '🧠' },
    { name: 'React',         emoji: '⚛️' },
    { name: 'Python',        emoji: '🐍' },
    { name: 'Vite',          emoji: '⚡' },
    { name: 'Tailwind CSS',  emoji: '🎨' },
    { name: 'Node.js',       emoji: '🟢' },
    { name: 'n8n',           emoji: '🔗' },
    { name: 'GSAP',          emoji: '✨' },
  ]

  const TERMINAL_LINES = [
    { prefix: '❯', cmd: 'npm', rest: ' run build:ai-agent', delay: 0 },
  ]

  return (
    <section id="techstack" ref={ref} className="py-28 max-w-6xl mx-auto px-6">
      <div className="mb-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="w-8 h-px bg-primary" />
          <span className="font-mono text-primary text-xs uppercase tracking-widest">Our Toolkit</span>
          <div className="w-8 h-px bg-primary" />
        </div>
        <h2 className="font-display font-extrabold text-4xl md:text-5xl text-text mb-4 leading-tight">
          Powered by the <span className="text-gradient">Best Tools</span>
        </h2>
        <p className="font-body text-text-2 text-lg max-w-lg mx-auto">
          We pick tools on merit, not trend. Modern stack, built for production.
        </p>
      </div>

      {/* Badge grid */}
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

      {/* Terminal window */}
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
            <span className="text-accent">npm</span> run build:ai-agent
          </p>
          <p className="text-muted text-xs pl-4">✓ Compiling React components...</p>
          <p className="text-muted text-xs pl-4">✓ Connecting Claude AI endpoints...</p>
          <p className="text-muted text-xs pl-4">✓ Deploying automation workflows...</p>
          <p className="text-green-400 text-xs pl-4">✓ Build complete. Your business just got smarter.</p>
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

  return (
    <section id="contact" ref={ref} className="py-28 bg-surface">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-px bg-primary" />
            <span className="font-mono text-primary text-xs uppercase tracking-widest">Get In Touch</span>
            <div className="w-8 h-px bg-primary" />
          </div>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-text mb-4 leading-tight">
            Let's Build Something <span className="text-gradient">Together</span>
          </h2>
          <p className="font-body text-text-2 text-lg max-w-md mx-auto">
            Tell us about your business and what you need. We'll reply within 24 hours.
          </p>
        </div>

        <div className="glass rounded-3xl p-8 md:p-12">
          {status === 'sent' ? (
            <div className="text-center py-14">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-5">
                <Check size={28} className="text-green-400" />
              </div>
              <h3 className="font-display font-bold text-2xl text-text mb-2">Message Sent!</h3>
              <p className="font-body text-text-2">We'll get back to you within 24 hours.</p>
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
                <input type="text" value={form.business} onChange={set('business')} placeholder="Tell us about your business" className={inputClass} />
              </div>
              <div>
                <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={set('message')}
                  placeholder="What do you need built? What problems are you trying to solve?"
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-2.5 text-text-2 text-sm">
                  <Mail size={16} className="text-primary flex-shrink-0" />
                  <span className="font-body">madhavs.work07@gmail.com</span>
                </div>
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
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
              <Terminal size={12} className="text-white" />
            </div>
            <span className="font-display font-bold text-text">
              Delvox <span className="text-gradient">Labs</span>
            </span>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-xs text-muted">All systems operational</span>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-4">
            <a href="mailto:madhavs.work07@gmail.com" aria-label="Email" className="text-muted hover:text-text transition-colors duration-200">
              <Mail size={18} />
            </a>
            <a href="https://github.com/madhav-sharma" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted hover:text-text transition-colors duration-200">
              <GithubIcon />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter/X" className="text-muted hover:text-text transition-colors duration-200">
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
  return (
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
  )
}
