import { useEffect, useRef, useState } from 'react'
import { prefersReduced } from '../lib/motion.jsx'

// Interactive WhatsApp-style onboarding: tap quick-reply chips to walk the
// script — greeting → language → account type → KYC → done.

const SCRIPT = [
  {
    ai: () => "Namaste! I'm SBI Mitra, I help you open a bank account by voice, in your own language. Which language would you like?",
    chips: ['हिन्दी', 'English', 'தமிழ்'],
  },
  {
    ai: (choice) => `Perfect, we'll continue in ${choice}. What type of account would you like to open?`,
    chips: ['Savings', 'Current', 'Jan Dhan (zero balance)'],
  },
  {
    ai: (choice) => `${choice} it is. To verify your identity, how would you like to complete KYC?`,
    chips: ['Aadhaar OTP', 'Video KYC'],
  },
  {
    ai: (choice) => `Done! Your ${choice} verification is queued and your account request is submitted. You'll get a WhatsApp confirmation shortly. You're all set ✓`,
    chips: [],
  },
]

export default function SbiMitraDemo() {
  const [messages, setMessages] = useState([{ from: 'ai', text: SCRIPT[0].ai() }])
  const [step, setStep] = useState(0)
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const pick = (chip) => {
    const next = step + 1
    setMessages((m) => [...m, { from: 'user', text: chip }])
    if (prefersReduced()) {
      setMessages((m) => [...m, { from: 'ai', text: SCRIPT[next].ai(chip) }])
      setStep(next)
    } else {
      setTyping(true)
      timerRef.current = setTimeout(() => {
        setTyping(false)
        setMessages((m) => [...m, { from: 'ai', text: SCRIPT[next].ai(chip) }])
        setStep(next)
      }, 650)
    }
  }

  const restart = () => {
    clearTimeout(timerRef.current)
    setTyping(false)
    setMessages([{ from: 'ai', text: SCRIPT[0].ai() }])
    setStep(0)
  }

  const chips = typing ? [] : SCRIPT[step].chips
  const finished = step === SCRIPT.length - 1

  return (
    <div className="flex flex-col h-[340px] rounded-2xl overflow-hidden border border-line bg-[#EFEAE2]">
      {/* WA header */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#F0F2F5] border-b border-black/5">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1D3F8F] text-white text-[12px] font-semibold shrink-0">SM</span>
        <span>
          <span className="block text-[13px] font-semibold text-[#111B21] leading-tight">SBI Mitra</span>
          <span className="block font-mono text-[10px] text-[#667781]">voice assistant &middot; WhatsApp</span>
        </span>
      </div>

      {/* Thread */}
      <div ref={scrollRef} data-lenis-prevent className="flex-1 overflow-y-auto flex flex-col gap-1.5 p-3" aria-live="polite">
        {messages.map((m, i) => (
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
        ))}
        {typing && (
          <div className="self-start bg-white rounded-lg rounded-tl-[3px] px-3 py-2.5 shadow-sm text-[#667781]">
            <span className="typing-dots" role="img" aria-label="SBI Mitra is typing"><span /><span /><span /></span>
          </div>
        )}
      </div>

      {/* Quick-reply chips */}
      <div className="flex flex-wrap gap-2 p-3 bg-[#F0F2F5] border-t border-black/5 min-h-[54px]">
        {chips.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => pick(chip)}
            className="rounded-full border border-[#25D366] text-[#0B6E43] bg-white px-3.5 py-1.5 text-[12.5px] font-medium hover:bg-[#D9FDD3] transition-colors cursor-pointer"
          >
            {chip}
          </button>
        ))}
        {finished && !typing && (
          <button
            type="button"
            onClick={restart}
            className="rounded-full border border-black/15 text-[#54656F] bg-white px-3.5 py-1.5 text-[12.5px] font-medium hover:bg-black/5 transition-colors cursor-pointer"
          >
            &#8635; Start over
          </button>
        )}
      </div>
    </div>
  )
}
