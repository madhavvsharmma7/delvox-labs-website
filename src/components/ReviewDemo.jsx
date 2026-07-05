import { useEffect, useRef, useState } from 'react'
import { prefersReduced } from '../lib/motion.jsx'

// DEMO 3 — Review Management.
// A WhatsApp follow-up thread advanced by tapping: the AI checks in after a
// visit, the customer replies "Great!", gets a one-tap Google review link,
// and a Google-style widget animates to five gold stars. All scripted, no
// network; timers cleaned up on unmount; reduced motion shows states instantly.

const NAME = 'Priya'
const GOOGLE_GOLD = '#FBBC04'
const GOOGLE_GREY = '#DADCE0'

const MSG = {
  ask: { from: 'ai', text: `Hi ${NAME}, thanks for visiting Glow Salon today! How was your experience?` },
  reply: { from: 'user', text: 'Great!' },
  link: { from: 'link', text: 'So glad to hear it! Would you mind leaving us a quick Google review? It takes ten seconds.' },
  stars: { from: 'stars' },
  thanks: { from: 'ai', text: `Thank you, ${NAME}! See you next time.` },
}

function Star({ filled, delayMs }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5 transition-all duration-300"
      style={{
        fill: filled ? GOOGLE_GOLD : GOOGLE_GREY,
        transform: filled ? 'scale(1)' : 'scale(0.85)',
        transitionDelay: `${delayMs}ms`,
      }}
      aria-hidden="true"
    >
      <path d="M12 2l2.9 6.26 6.86.8-5.07 4.7 1.35 6.77L12 17.15l-6.04 3.38 1.35-6.77-5.07-4.7 6.86-.8L12 2z" />
    </svg>
  )
}

function StarWidget() {
  const [filled, setFilled] = useState(() => (prefersReduced() ? 5 : 0))
  const timersRef = useRef([])

  useEffect(() => {
    if (prefersReduced()) return
    for (let i = 1; i <= 5; i += 1) {
      timersRef.current.push(setTimeout(() => setFilled(i), 300 + i * 200))
    }
    const timers = timersRef.current
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div
      className="self-start w-[88%] rounded-xl bg-white border border-black/5 shadow-sm p-3.5"
      role="img"
      aria-label={`Google review posted: ${NAME} rated Glow Salon 5 out of 5 stars`}
    >
      <p className="font-mono text-[9.5px] uppercase tracking-wider text-[#5F6368]">Google review</p>
      <div className="flex items-center gap-1 mt-2" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} filled={i <= filled} delayMs={0} />
        ))}
        <span className="font-mono text-[12px] text-[#202124] ml-1.5">{filled}.0</span>
      </div>
      <p className="text-[11.5px] text-[#5F6368] mt-2 leading-snug">
        &ldquo;Lovely staff, quick service. Booking on WhatsApp was so easy!&rdquo;
      </p>
      <p className="font-mono text-[9.5px] text-[#5F6368] mt-1.5">{NAME} S. &middot; posted publicly</p>
    </div>
  )
}

export default function ReviewDemo() {
  // Phases: ask (chip visible) → link (tap the review link) → done
  const [messages, setMessages] = useState([MSG.ask])
  const [phase, setPhase] = useState('ask')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef(null)
  const timersRef = useRef([])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing])

  useEffect(() => () => timersRef.current.forEach(clearTimeout), [])

  // Queue messages with a typing pause, then land on the next phase.
  const queue = (msgs, nextPhase) => {
    if (prefersReduced()) {
      setMessages((m) => [...m, ...msgs])
      setPhase(nextPhase)
      return
    }
    setTyping(true)
    msgs.forEach((msg, i) => {
      timersRef.current.push(
        setTimeout(() => {
          setMessages((m) => [...m, msg])
          if (i === msgs.length - 1) {
            setTyping(false)
            setPhase(nextPhase)
          }
        }, 800 * (i + 1))
      )
    })
  }

  const replyGreat = () => {
    setMessages((m) => [...m, MSG.reply])
    setPhase('wait')
    queue([MSG.link], 'link')
  }

  const tapReviewLink = () => {
    setPhase('wait')
    setMessages((m) => [...m, MSG.stars])
    queue([MSG.thanks], 'done')
  }

  const restart = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    setTyping(false)
    setMessages([MSG.ask])
    setPhase('ask')
  }

  return (
    <div className="flex flex-col h-[340px] rounded-2xl overflow-hidden border border-line bg-[#EFEAE2]">
      {/* WA header — authentic WhatsApp chrome in both site themes */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#F0F2F5] border-b border-black/5">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0E7A48] text-white text-[12px] font-semibold shrink-0">GS</span>
        <span>
          <span className="block text-[13px] font-semibold text-[#111B21] leading-tight">Glow Salon</span>
          <span className="block font-mono text-[10px] text-[#667781]">review assistant &middot; WhatsApp</span>
        </span>
      </div>

      {/* Thread */}
      <div ref={scrollRef} data-lenis-prevent className="flex-1 overflow-y-auto flex flex-col gap-1.5 p-3" aria-live="polite">
        {messages.map((m, i) => {
          if (m.from === 'stars') return <StarWidget key={i} />
          if (m.from === 'link') {
            return (
              <div key={i} className="self-start max-w-[88%] bg-white rounded-lg rounded-tl-[3px] shadow-sm overflow-hidden">
                <p className="px-3 py-2 text-[12.5px] leading-snug text-[#111B21]">{m.text}</p>
                <button
                  type="button"
                  onClick={tapReviewLink}
                  disabled={phase !== 'link'}
                  aria-label="Open the one-tap Google review link"
                  className="block w-full border-t border-black/10 py-2 text-center text-[12.5px] font-medium text-[#027EB5] hover:bg-black/[0.03] transition-colors cursor-pointer disabled:cursor-default disabled:opacity-60"
                >
                  &#9733; Review Glow Salon on Google
                </button>
              </div>
            )
          }
          return (
            <div
              key={i}
              className={`max-w-[88%] px-3 py-2 text-[12.5px] leading-snug text-[#111B21] shadow-sm ${
                m.from === 'ai'
                  ? 'self-start bg-white rounded-lg rounded-tl-[3px]'
                  : 'self-end bg-[#D9FDD3] rounded-lg rounded-tr-[3px]'
              }`}
            >
              {m.text}
            </div>
          )
        })}
        {typing && (
          <div className="self-start bg-white rounded-lg rounded-tl-[3px] px-3 py-2.5 shadow-sm text-[#667781]">
            <span className="typing-dots" role="img" aria-label="Glow Salon is typing"><span /><span /><span /></span>
          </div>
        )}
      </div>

      {/* Customer replies */}
      <div className="flex flex-wrap gap-2 p-3 bg-[#F0F2F5] border-t border-black/5 min-h-[54px]">
        {phase === 'ask' && (
          <button
            type="button"
            onClick={replyGreat}
            aria-label="Reply: Great!"
            className="rounded-full border border-[#25D366] text-[#0B6E43] bg-white px-3.5 py-1.5 text-[12.5px] font-medium hover:bg-[#D9FDD3] transition-colors cursor-pointer"
          >
            Great!
          </button>
        )}
        {phase === 'link' && (
          <span className="font-mono text-[10.5px] text-[#54656F] self-center">Tap the review link above &uarr;</span>
        )}
        {phase === 'done' && (
          <button
            type="button"
            onClick={restart}
            aria-label="Restart the review demo"
            className="rounded-full border border-black/15 text-[#54656F] bg-white px-3.5 py-1.5 text-[12.5px] font-medium hover:bg-black/5 transition-colors cursor-pointer"
          >
            &#8635; Start over
          </button>
        )}
      </div>
    </div>
  )
}
