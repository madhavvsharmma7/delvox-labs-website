import { useEffect, useRef, useState } from 'react'
import { smoothTo } from '../lib/motion.jsx'

// Lead-qualifying chat widget. All Anthropic calls happen server-side in
// /api/chat — this component only ever POSTs the running message history.
// Messages flagged `local` (the seeded greeting, fallback bubbles) are for
// display only and are never sent to the API.

const GREETING = {
  role: 'assistant',
  local: true,
  content:
    "Hi, I'm the Delvox assistant. We help businesses never miss a customer call. What kind of business do you run?",
}

const MAX_INPUT = 2000

function ChatIcon({ open }) {
  return open ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.3c-1.3 0-2.6-.3-3.7-.8L3 20.5l1.5-4.4a8 8 0 0 1-1-4A8.4 8.4 0 0 1 12 3.7a8.4 8.4 0 0 1 9 7.8z" />
      <path d="M8.5 10.5h7M8.5 13.5h4.5" />
    </svg>
  )
}

// Rendered when /api/chat is unreachable (plain `vite dev`, key not set,
// upstream error). Points at the two paths that always work.
function FallbackBubble({ onClose }) {
  return (
    <div className="mr-auto max-w-[85%] rounded-2xl rounded-bl-md bg-surface-2 px-3.5 py-2.5 text-[14px] leading-relaxed text-ink">
      Our assistant is having a moment. Email us at{' '}
      <a href="mailto:info@delvoxlabs.com" className="link-accent">
        info@delvoxlabs.com
      </a>{' '}
      or{' '}
      <button
        type="button"
        className="link-accent"
        onClick={() => {
          onClose()
          smoothTo('trial')
        }}
      >
        start your free trial
      </button>
      .
    </div>
  )
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([GREETING])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const [leadSent, setLeadSent] = useState(false)

  const launcherRef = useRef(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  // Keep the newest message in view
  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages, pending, open])

  // Focus the input only when the user actively opens the panel, not on the
  // initial auto-open (avoids yanking focus / popping the mobile keyboard).
  // Comparing against the previous value is also StrictMode-safe.
  const prevOpen = useRef(open)
  useEffect(() => {
    if (open && !prevOpen.current) inputRef.current?.focus()
    prevOpen.current = open
  }, [open])

  const close = () => {
    setOpen(false)
    launcherRef.current?.focus()
  }

  // Global Escape closes the panel even when focus isn't inside it (it opens
  // on load without stealing focus, so a scoped handler wouldn't catch it).
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        launcherRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  async function send(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || pending) return

    const next = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setPending(true)

    try {
      // Strip display-only messages, cap history, and make sure the payload
      // still starts with a user turn after capping.
      const payload = next
        .filter((m) => !m.local)
        .map(({ role, content }) => ({ role, content }))
        .slice(-40)
      while (payload.length && payload[0].role !== 'user') payload.shift()

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: payload }),
      })
      if (!res.ok) throw new Error(`status ${res.status}`)
      const data = await res.json()
      if (typeof data.reply !== 'string') throw new Error('bad payload')

      setMessages((m) => [...m, { role: 'assistant', content: data.reply }])
      if (data.leadCaptured) setLeadSent(true)
    } catch {
      // Never crash the page — degrade to a helpful bubble.
      setMessages((m) => [...m, { role: 'assistant', local: true, fallback: true }])
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label="Chat with Delvox Labs"
          className="chat-panel-in nav-glass fixed z-50 right-4 bottom-[9.25rem] md:right-6 md:bottom-[5.75rem] flex flex-col w-[min(24rem,calc(100vw-2rem))] h-[min(30rem,calc(100dvh-12rem))] rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-line shrink-0">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald text-white shrink-0" aria-hidden="true">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.3c-1.3 0-2.6-.3-3.7-.8L3 20.5l1.5-4.4a8 8 0 0 1-1-4A8.4 8.4 0 0 1 12 3.7a8.4 8.4 0 0 1 9 7.8z" />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="text-[15px] font-medium text-ink leading-tight">Delvox assistant</p>
              <p className="font-mono text-[10.5px] tracking-[0.08em] uppercase text-ink-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald pulse-dot" aria-hidden="true" />
                Online · replies in seconds
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close chat"
              className="ml-auto flex items-center justify-center w-8 h-8 rounded-full text-ink-2 hover:bg-surface-2 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            data-lenis-prevent
            aria-live="polite"
            className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 flex flex-col gap-2.5 bg-paper/40"
          >
            {messages.map((m, i) =>
              m.fallback ? (
                <FallbackBubble key={i} onClose={close} />
              ) : (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'ml-auto rounded-br-md bg-emerald/10 text-ink'
                      : 'mr-auto rounded-bl-md bg-surface-2 text-ink'
                  }`}
                >
                  {m.content}
                </div>
              )
            )}
            {leadSent && (
              <p className="font-mono text-[10.5px] tracking-[0.08em] uppercase text-ink-2 text-center py-1">
                <span className="text-honey" aria-hidden="true">✓ </span>
                Lead sent · we&rsquo;ll reach out within a day
              </p>
            )}
            {pending && (
              <div className="mr-auto rounded-2xl rounded-bl-md bg-surface-2 px-3.5 py-3 text-ink-2">
                <span className="typing-dots" aria-label="Assistant is typing">
                  <span /><span /><span />
                </span>
              </div>
            )}
          </div>

          {/* Composer */}
          <form onSubmit={send} className="flex items-center gap-2 px-3 py-3 border-t border-line shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={MAX_INPUT}
              placeholder="Ask about missed calls, pricing…"
              aria-label="Message the Delvox assistant"
              className="flex-1 min-w-0 bg-surface border border-line rounded-full px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-3"
            />
            <button
              type="submit"
              disabled={pending || !input.trim()}
              aria-label="Send message"
              className="btn-primary w-10 h-10 shrink-0"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 19V5M5.5 11.5L12 5l6.5 6.5" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Launcher — raised above the mobile CTA bar (bottom-4) on small screens */}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close chat' : 'Chat with Delvox Labs'}
        className="nav-glass fixed z-50 right-4 bottom-20 md:right-6 md:bottom-6 flex items-center justify-center w-14 h-14 rounded-full text-emerald hover:scale-105 active:scale-95 transition-transform"
      >
        <ChatIcon open={open} />
      </button>
    </>
  )
}
