import { useEffect, useRef, useState } from 'react'
import { prefersReduced } from '../lib/motion.jsx'

// DEMO 1 — WhatsApp Lead Capture.
// Type your name (or tap the sample chip), pick a need and a time; the
// scripted AI walks the missed-call recovery and lands on a "Lead captured"
// card. Fully self-contained: every reply is scripted, no network calls,
// timers cleaned up on unmount. Reduced motion skips the typing delays.

const GREETING = {
  from: 'ai',
  text: "Hi! Sorry we missed your call. I'm Shine Auto Care's AI assistant. Can I get your name?",
}
const NAME_CHIPS = ['Rahul S.']
const NEED_CHIPS = ['AC service', 'General repair', 'Just a quote']
const TIME_CHIPS = ['10:30 AM works', 'Evening is better']

function CheckIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4.5 12.5l5 5 10-11" />
    </svg>
  )
}

export default function LeadCaptureDemo() {
  const [messages, setMessages] = useState([GREETING])
  const [stage, setStage] = useState('name') // name → need → time → done
  const [typing, setTyping] = useState(false)
  const [lead, setLead] = useState({ name: '', need: '', time: '' })
  const [input, setInput] = useState('')
  const scrollRef = useRef(null)
  const timersRef = useRef([])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing])

  useEffect(() => () => timersRef.current.forEach(clearTimeout), [])

  // Queue one or more AI messages with a typing pause between each.
  const queueAi = (msgs) => {
    if (prefersReduced()) {
      setMessages((m) => [...m, ...msgs])
      return
    }
    setTyping(true)
    msgs.forEach((msg, i) => {
      timersRef.current.push(
        setTimeout(() => {
          setMessages((m) => [...m, msg])
          if (i === msgs.length - 1) setTyping(false)
        }, 750 * (i + 1))
      )
    })
  }

  const answer = (text) => {
    if (typing) return
    setMessages((m) => [...m, { from: 'user', text }])
    if (stage === 'name') {
      setLead((l) => ({ ...l, name: text }))
      setStage('need')
      queueAi([{ from: 'ai', text: `Nice to meet you, ${text}. What do you need help with?` }])
    } else if (stage === 'need') {
      setLead((l) => ({ ...l, need: text }))
      setStage('time')
      queueAi([
        { from: 'ai', text: `Got it, ${text.toLowerCase()}. The next open slot is tomorrow at 10:30 AM. Does that work?` },
      ])
    } else if (stage === 'time') {
      const time = text === TIME_CHIPS[1] ? 'Tomorrow · 6:00 PM' : 'Tomorrow · 10:30 AM'
      setLead((l) => ({ ...l, time }))
      setStage('done')
      queueAi([
        { from: 'ai', text: 'Locked in. The owner already has your details. See you then!' },
        { from: 'lead' },
      ])
    }
  }

  const submit = (e) => {
    e.preventDefault()
    const v = input.trim()
    if (!v) return
    setInput('')
    answer(v)
  }

  const restart = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    setTyping(false)
    setMessages([GREETING])
    setStage('name')
    setLead({ name: '', need: '', time: '' })
    setInput('')
  }

  const chips = typing
    ? []
    : stage === 'name'
      ? NAME_CHIPS
      : stage === 'need'
        ? NEED_CHIPS
        : stage === 'time'
          ? TIME_CHIPS
          : []
  const showInput = !typing && (stage === 'name' || stage === 'need')

  return (
    <div className="flex flex-col h-[340px] rounded-2xl overflow-hidden border border-line bg-[#EFEAE2]">
      {/* WA header — authentic WhatsApp chrome in both site themes */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#F0F2F5] border-b border-black/5">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0E7A48] text-white text-[12px] font-semibold shrink-0">SA</span>
        <span>
          <span className="block text-[13px] font-semibold text-[#111B21] leading-tight">Shine Auto Care</span>
          <span className="block font-mono text-[10px] text-[#667781]">AI assistant &middot; WhatsApp</span>
        </span>
      </div>

      {/* Thread */}
      <div ref={scrollRef} data-lenis-prevent className="flex-1 overflow-y-auto flex flex-col gap-1.5 p-3" aria-live="polite">
        {messages.map((m, i) => {
          if (m.from === 'lead') {
            return (
              <div key={i} className="self-start w-[88%] rounded-xl bg-white border border-black/5 shadow-sm p-3.5">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0E7A48] text-white shrink-0">
                    <CheckIcon className="w-3 h-3" />
                  </span>
                  <span className="text-[13px] font-semibold text-[#10221C]">Lead captured</span>
                </div>
                <dl className="font-mono text-[10.5px] text-[#4A5A52] mt-2 space-y-1">
                  <div className="flex justify-between gap-3"><dt>Name</dt><dd className="text-[#10221C] text-right">{lead.name}</dd></div>
                  <div className="flex justify-between gap-3"><dt>Need</dt><dd className="text-[#10221C] text-right">{lead.need}</dd></div>
                  <div className="flex justify-between gap-3"><dt>Suggested time</dt><dd className="text-[#10221C] text-right">{lead.time}</dd></div>
                </dl>
                <p className="font-mono text-[10px] text-[#9A6A1C] mt-2">Recovered in 11 seconds.</p>
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
            <span className="typing-dots" role="img" aria-label="Shine Auto Care is typing"><span /><span /><span /></span>
          </div>
        )}
      </div>

      {/* Chips + free-text input */}
      <div className="bg-[#F0F2F5] border-t border-black/5">
        <div className="flex flex-wrap gap-2 px-3 pt-2.5 pb-2 min-h-[44px]">
          {chips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => answer(chip)}
              className="rounded-full border border-[#25D366] text-[#0B6E43] bg-white px-3.5 py-1.5 text-[12.5px] font-medium hover:bg-[#D9FDD3] transition-colors cursor-pointer"
            >
              {chip}
            </button>
          ))}
          {stage === 'done' && !typing && (
            <button
              type="button"
              onClick={restart}
              className="rounded-full border border-black/15 text-[#54656F] bg-white px-3.5 py-1.5 text-[12.5px] font-medium hover:bg-black/5 transition-colors cursor-pointer"
            >
              &#8635; Start over
            </button>
          )}
        </div>
        {showInput && (
          <form onSubmit={submit} className="flex items-center gap-2 px-3 pb-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label={stage === 'name' ? 'Type your name' : 'Type what you need'}
              placeholder={stage === 'name' ? 'Type your name…' : 'Or type what you need…'}
              className="flex-1 min-w-0 rounded-full bg-white border border-black/10 px-3.5 py-2 text-[12.5px] text-[#111B21] placeholder-[#8696A0] focus:outline-none focus:border-[#0E7A48]"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-[#0E7A48] text-white shrink-0 hover:bg-[#0C6A3F] transition-colors cursor-pointer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 translate-x-[1px]" aria-hidden="true">
                <path d="M3.4 20.4l17.45-7.48a1 1 0 0 0 0-1.84L3.4 3.6a.993.993 0 0 0-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z" />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
