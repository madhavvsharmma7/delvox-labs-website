import { useEffect, useRef, useState } from 'react'
import { prefersReduced } from '../lib/motion.jsx'

// Interactive missed-call → AI callback → booking flow.
// "Simulate a missed call" plays the sequence; reduced motion shows it all at once.

const EVENTS = [
  { type: 'call',       delay: 0,    label: 'Incoming call · 7:42 PM', sub: '+91 98••• ••41' },
  { type: 'missed',     delay: 1300, label: 'Missed call', sub: 'Front desk was busy' },
  { type: 'status',     delay: 2400, label: 'Delvox AI is calling back…' },
  { type: 'transcript', delay: 3600, from: 'ai',     text: "Hi! This is Smile Dental's assistant, sorry we missed your call." },
  { type: 'transcript', delay: 4600, from: 'caller', text: 'I wanted a cleaning this week.' },
  { type: 'transcript', delay: 5600, from: 'ai',     text: 'Dr. Mehta has Thursday 4:00 PM open. Shall I book it?' },
  { type: 'transcript', delay: 6500, from: 'caller', text: 'Yes, perfect.' },
  { type: 'booked',     delay: 7500, label: 'Appointment booked ✓', sub: 'Thu · 4:00 PM · Cleaning' },
]

export default function ReceptionistDemo() {
  const [visible, setVisible] = useState(0) // how many events are shown
  const [running, setRunning] = useState(false)
  const timersRef = useRef([])
  const scrollRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [visible])

  useEffect(() => () => timersRef.current.forEach(clearTimeout), [])

  const simulate = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    if (prefersReduced()) {
      setVisible(EVENTS.length)
      setRunning(false)
      return
    }
    setVisible(0)
    setRunning(true)
    EVENTS.forEach((ev, i) => {
      timersRef.current.push(
        setTimeout(() => {
          setVisible(i + 1)
          if (i === EVENTS.length - 1) setRunning(false)
        }, ev.delay)
      )
    })
  }

  const shown = EVENTS.slice(0, visible)
  const done = visible === EVENTS.length

  return (
    <div className="flex flex-col h-[340px] rounded-2xl overflow-hidden border border-line bg-surface">
      <div ref={scrollRef} data-lenis-prevent className="flex-1 overflow-y-auto p-4 space-y-2.5" aria-live="polite">
        {visible === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center gap-3">
            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald/10 text-emerald">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.9z" />
              </svg>
            </span>
            <p className="lead text-sm max-w-[220px]">See what happens when a patient calls after hours.</p>
          </div>
        )}

        {shown.map((ev, i) => {
          if (ev.type === 'call' || ev.type === 'missed') {
            const missed = ev.type === 'missed'
            return (
              <div key={i} className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 ${missed ? 'border-red-400/30 bg-red-500/5' : 'border-line bg-paper'}`}>
                <span className={`w-2 h-2 rounded-full shrink-0 ${missed ? 'bg-red-400' : 'bg-honey'}`} />
                <span>
                  <span className={`block text-[13px] font-medium ${missed ? 'text-red-500 dark:text-red-400' : 'text-ink'}`}>{ev.label}</span>
                  <span className="block font-mono text-[11px] text-ink-3 mt-0.5">{ev.sub}</span>
                </span>
              </div>
            )
          }
          if (ev.type === 'status') {
            return (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-emerald/25 bg-emerald/5 px-3.5 py-2.5">
                <span className={`w-2 h-2 rounded-full bg-emerald shrink-0 ${!done ? 'pulse-dot' : ''}`} />
                <span className="text-[13px] font-medium text-emerald">{ev.label}</span>
              </div>
            )
          }
          if (ev.type === 'transcript') {
            const ai = ev.from === 'ai'
            return (
              <div key={i} className={`max-w-[88%] rounded-xl px-3 py-2 text-[12.5px] leading-snug ${ai ? 'mr-auto bg-surface-2 text-ink' : 'ml-auto bg-emerald/10 text-ink'}`}>
                <span className="block font-mono text-[9.5px] uppercase tracking-wider text-ink-3 mb-0.5">{ai ? 'Delvox AI' : 'Caller'}</span>
                {ev.text}
              </div>
            )
          }
          // booked
          return (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-emerald/40 bg-emerald/10 px-3.5 py-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald text-white shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
                  <path d="M4.5 12.5l5 5 10-11" />
                </svg>
              </span>
              <span>
                <span className="block text-[13.5px] font-semibold text-ink">Appointment booked</span>
                <span className="block font-mono text-[11px] text-ink-2 mt-0.5">{ev.sub}</span>
              </span>
            </div>
          )
        })}
      </div>

      <div className="p-3 border-t border-line">
        <button
          type="button"
          onClick={simulate}
          disabled={running}
          className="btn-primary w-full py-2.5 text-[13.5px]"
        >
          {running ? 'Recovering the call…' : done ? '↺ Simulate another missed call' : 'Simulate a missed call'}
        </button>
      </div>
    </div>
  )
}
