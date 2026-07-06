import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { prefersReduced } from '../lib/motion.jsx'

// The signature element. A phone at night: a call rings (honey glow), gets
// missed ("You were closed."), Delvox picks it up on WhatsApp, and the lead
// is captured — a ~7s GSAP sequence that plays once on load.
// Reduced motion: the final "lead captured" state renders immediately.

const HONEY = '#F2A93B'
const EMERALD_ON_DARK = '#1DA764'

const MESSAGES = [
  { from: 'ai', text: "Hi! Sorry we missed your call. This is Sunrise Clinic's assistant. How can I help?" },
  { from: 'customer', text: 'Do you have an appointment tomorrow?' },
  { from: 'ai', text: 'Yes, morning or afternoon?' },
  { from: 'customer', text: 'Morning' },
  { from: 'ai', text: 'Booked you for 10:30 AM. See you then!' },
]

function PhoneIcon({ className, slashed = false }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.9z" />
      {slashed && <path d="M3 3l18 18" />}
    </svg>
  )
}

export default function PhoneDemo() {
  const rootRef = useRef(null)
  const glowRef = useRef(null)
  const ringRef = useRef(null)
  const incomingRef = useRef(null)
  const missedRef = useRef(null)
  const badgeRef = useRef(null)
  const badgeDotRef = useRef(null)
  const chatRef = useRef(null)
  const leadRef = useRef(null)
  const bubbleRefs = useRef([])
  const tlRef = useRef(null)
  const [reduced] = useState(prefersReduced)
  const [done, setDone] = useState(reduced)

  const setInitial = useCallback(() => {
    gsap.set([incomingRef.current, missedRef.current, badgeRef.current, leadRef.current], { autoAlpha: 0 })
    gsap.set(chatRef.current, { yPercent: 104 })
    gsap.set(bubbleRefs.current, { autoAlpha: 0, y: 10 })
    gsap.set(glowRef.current, { opacity: 0, scale: 0.92 })
    gsap.set(ringRef.current, { opacity: 0 })
    gsap.set(badgeDotRef.current, { backgroundColor: HONEY })
  }, [])

  const setFinal = useCallback(() => {
    gsap.set([incomingRef.current, missedRef.current, badgeRef.current], { autoAlpha: 0 })
    gsap.set([glowRef.current, ringRef.current], { opacity: 0 })
    gsap.set(chatRef.current, { yPercent: 0 })
    gsap.set(bubbleRefs.current, { autoAlpha: 1, y: 0 })
    gsap.set(leadRef.current, { autoAlpha: 1, scale: 1, y: 0 })
  }, [])

  useEffect(() => {
    if (reduced) {
      setFinal()
      return
    }
    setInitial()
    // Built paused and started only when the phone is actually on screen, so
    // the ~8s sequence never burns frames while scrolled past (e.g. on a slow
    // load or a deep link further down the page).
    const tl = gsap.timeline({ delay: 0.7, paused: true, onComplete: () => setDone(true) })

    // 1–2. Night home screen → incoming call, honey glow pulses
    tl.to(glowRef.current, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, 0)
    tl.fromTo(incomingRef.current, { autoAlpha: 0, y: -28 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.1)
    tl.fromTo(ringRef.current, { opacity: 0 }, { opacity: 1, duration: 0.34, repeat: 4, yoyo: true, ease: 'sine.inOut' }, 0.1)
    tl.to(glowRef.current, { scale: 1.05, duration: 0.68, repeat: 2, yoyo: true, ease: 'sine.inOut' }, 0.15)

    // 3. Missed — "You were closed."
    tl.to(incomingRef.current, { autoAlpha: 0, y: -8, duration: 0.28, ease: 'power2.in' }, 2.1)
    tl.fromTo(missedRef.current, { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' }, 2.28)
    tl.to([glowRef.current, ringRef.current], { opacity: 0, duration: 0.5 }, 2.1)

    // 4. Delvox badge lights up (honey → emerald)
    tl.fromTo(badgeRef.current, { autoAlpha: 0, scale: 0.92, y: 6 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)' }, 3.1)
    tl.to(badgeDotRef.current, { backgroundColor: EMERALD_ON_DARK, duration: 0.5 }, 3.4)

    // 5. WhatsApp thread slides up
    tl.to([missedRef.current, badgeRef.current], { autoAlpha: 0, duration: 0.3 }, 4.0)
    tl.to(chatRef.current, { yPercent: 0, duration: 0.65, ease: 'power4.out' }, 4.05)
    bubbleRefs.current.forEach((b, i) => {
      tl.fromTo(b, { autoAlpha: 0, y: 10, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, ease: 'power2.out' }, 4.6 + i * 0.48)
    })

    // 6. Lead captured
    tl.fromTo(leadRef.current, { autoAlpha: 0, scale: 0.85, y: 16 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.6)' }, 7.15)

    tlRef.current = tl

    // Play once the phone enters the viewport; if it's already visible on load
    // this fires immediately. Disconnect after the first play so replay is
    // driven only by the button.
    const el = rootRef.current
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          tl.play()
          io.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    io.observe(el)

    return () => { io.disconnect(); tl.kill() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const replay = () => {
    if (!tlRef.current) return
    setDone(false)
    setInitial()
    tlRef.current.restart(true)
  }

  return (
    <div ref={rootRef} className="flex flex-col items-center">
      <div
        className="relative"
        role="img"
        aria-label="Demo: at 9:41 PM a customer call goes unanswered. Delvox AI texts the customer back on WhatsApp, books them for 10:30 AM, and captures the lead in 12 seconds."
      >
        {/* Honey glow behind the ringing phone */}
        <div ref={glowRef} className="phone-glow" aria-hidden="true" />

        <div className="phone-device w-[290px] sm:w-[320px]">
          <div ref={ringRef} className="phone-ring" aria-hidden="true" />

          <div className="phone-screen aspect-[9/19.2] select-none" aria-hidden="true">
            {/* Status bar */}
            <div className="flex items-center justify-between px-6 pt-4 font-mono text-[11px] text-white/70">
              <span>9:41 PM</span>
              <span className="flex items-center gap-1.5">
                <svg viewBox="0 0 16 12" className="w-3.5 h-2.5" fill="currentColor" aria-hidden="true">
                  <rect x="0" y="8" width="3" height="4" rx="0.8" />
                  <rect x="4.5" y="5" width="3" height="7" rx="0.8" />
                  <rect x="9" y="2" width="3" height="10" rx="0.8" />
                </svg>
                <svg viewBox="0 0 24 12" className="w-5 h-2.5" fill="none" stroke="currentColor" aria-hidden="true">
                  <rect x="1" y="1" width="18" height="10" rx="3" strokeWidth="1.4" />
                  <rect x="3.4" y="3.4" width="11" height="5.2" rx="1.4" fill="currentColor" stroke="none" />
                  <path d="M21.5 4.2v3.6" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
            </div>

            {/* Night home screen */}
            <div className="text-center mt-14">
              <div className="font-display text-[58px] leading-none text-white/95">9:41</div>
              <div className="font-mono text-[11.5px] text-white/50 mt-2">Tuesday · after hours</div>
            </div>

            {/* Dock */}
            <div className="absolute bottom-5 inset-x-0 flex justify-center gap-3">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="w-11 h-11 rounded-[14px] bg-white/[0.08] border border-white/[0.06]" />
              ))}
            </div>

            {/* Incoming call banner */}
            <div ref={incomingRef} className="absolute top-12 left-3 right-3">
              <div className="rounded-2xl bg-[#1A2C24]/95 border border-white/10 px-4 py-3 flex items-center gap-3 shadow-lg">
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#F2A93B]/20 text-[#F2A93B] shrink-0">
                  <PhoneIcon className="w-4 h-4" />
                </span>
                <span>
                  <span className="block text-[13px] font-medium text-white/95">Incoming call</span>
                  <span className="block font-mono text-[11px] text-white/55 mt-0.5">+91 98&bull;&bull;&bull; &bull;&bull;23</span>
                </span>
              </div>
            </div>

            {/* Missed call banner */}
            <div ref={missedRef} className="absolute top-12 left-3 right-3">
              <div className="rounded-2xl bg-[#1A2C24]/95 border border-white/10 px-4 py-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-red-500/20 text-red-400 shrink-0">
                    <PhoneIcon className="w-4 h-4" slashed />
                  </span>
                  <span>
                    <span className="block text-[13px] font-medium text-red-300">Missed call</span>
                    <span className="block font-mono text-[11px] text-white/55 mt-0.5">+91 98&bull;&bull;&bull; &bull;&bull;23</span>
                  </span>
                </div>
                <p className="font-mono text-[10.5px] text-white/45 mt-2.5 ml-12">You were closed.</p>
              </div>
            </div>

            {/* Delvox badge */}
            <div ref={badgeRef} className="absolute top-[42%] inset-x-0 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#132620]/95 border border-white/10 px-4 py-2 shadow-lg">
                <span ref={badgeDotRef} className="w-2 h-2 rounded-full bg-[#F2A93B]" />
                <span className="text-[12.5px] font-medium text-white/95">Delvox AI is on it</span>
              </span>
            </div>

            {/* WhatsApp thread */}
            <div ref={chatRef} className="absolute inset-x-0 bottom-0 h-[78%] rounded-t-[26px] overflow-hidden bg-[#EFEAE2] shadow-[0_-8px_30px_rgba(0,0,0,0.35)]">
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#F0F2F5] border-b border-black/5">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0E7A48] text-white text-[13px] font-semibold shrink-0">S</span>
                <span>
                  <span className="block text-[12.5px] font-semibold text-[#111B21] leading-tight">Sunrise Clinic</span>
                  <span className="block font-mono text-[9.5px] text-[#667781]">online &middot; WhatsApp</span>
                </span>
              </div>
              <div className="flex flex-col gap-1.5 p-3">
                {MESSAGES.map((m, i) => (
                  <div
                    key={i}
                    ref={(el) => { bubbleRefs.current[i] = el }}
                    className={`max-w-[85%] px-2.5 py-1.5 text-[11.5px] leading-snug text-[#111B21] shadow-sm ${
                      m.from === 'ai'
                        ? 'self-start bg-white rounded-lg rounded-tl-[3px]'
                        : 'self-end bg-[#D9FDD3] rounded-lg rounded-tr-[3px]'
                    }`}
                  >
                    {m.text}
                    <span className="block text-right font-mono text-[8.5px] text-[#8696A0] mt-0.5">
                      9:4{1 + Math.floor(i / 2)} PM{m.from === 'customer' && <span className="text-[#53BDEB]"> &#10003;&#10003;</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lead captured card */}
            <div ref={leadRef} className="absolute inset-x-4 bottom-4">
              <div className="rounded-2xl bg-white border border-black/5 shadow-xl p-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#0E7A48] text-white shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
                      <path d="M4.5 12.5l5 5 10-11" />
                    </svg>
                  </span>
                  <span className="text-[13.5px] font-semibold text-[#10221C]">Lead captured</span>
                </div>
                <dl className="font-mono text-[10.5px] text-[#4A5A52] mt-2.5 space-y-1">
                  <div className="flex justify-between"><dt>Name</dt><dd className="text-[#10221C]">Ramesh K.</dd></div>
                  <div className="flex justify-between"><dt>Need</dt><dd className="text-[#10221C]">Appointment</dd></div>
                  <div className="flex justify-between"><dt>Time</dt><dd className="text-[#10221C]">Tomorrow &middot; 10:30 AM</dd></div>
                </dl>
                <p className="font-mono text-[10px] text-[#9A6A1C] mt-2.5">Recovered in 12 seconds.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!reduced && (
        <button
          type="button"
          onClick={replay}
          tabIndex={done ? 0 : -1}
          aria-hidden={!done}
          className={`btn-ghost text-[13px] px-4 py-1.5 mt-6 transition-opacity duration-300 ${done ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-label="Replay the phone demo"
        >
          &#8635;&nbsp;Watch again
        </button>
      )}
    </div>
  )
}
