import { useEffect, useRef, useState } from 'react'
import { prefersReduced } from '../lib/motion.jsx'

// DEMO 2 — Appointment Booking.
// Three tappable steps: pick a service → pick a slot on a mini calendar →
// WhatsApp-style confirmation with a green check. Back works at every step.
// Self-contained and scripted; the confirmation "typing" delay is skipped
// under prefers-reduced-motion.

const SERVICES = [
  { name: 'Consultation', length: '30 min' },
  { name: 'Follow-up', length: '15 min' },
  { name: 'Emergency', length: 'seen first' },
]
const DAYS = [
  { day: 'Mon', date: '6 Jul' },
  { day: 'Tue', date: '7 Jul' },
  { day: 'Wed', date: '8 Jul' },
]
const SLOTS = ['10:00 AM', '11:30 AM', '4:00 PM', '5:30 PM']
// Slots already taken — shown disabled for realism.
const TAKEN = new Set(['Mon 11:30 AM', 'Wed 10:00 AM'])

const STEP_LABELS = ['Service', 'Time', 'Confirmed']

function CheckIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4.5 12.5l5 5 10-11" />
    </svg>
  )
}

export default function BookingDemo() {
  const [step, setStep] = useState(0)
  const [service, setService] = useState(null)
  const [slot, setSlot] = useState(null) // { day, date, time }
  const [confirmed, setConfirmed] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const pickService = (s) => {
    setService(s)
    setStep(1)
  }

  const pickSlot = (day, date, time) => {
    setSlot({ day, date, time })
    setStep(2)
    if (prefersReduced()) {
      setConfirmed(true)
    } else {
      setConfirmed(false)
      timerRef.current = setTimeout(() => setConfirmed(true), 800)
    }
  }

  const back = () => {
    clearTimeout(timerRef.current)
    setConfirmed(false)
    setStep((s) => Math.max(0, s - 1))
  }

  const restart = () => {
    clearTimeout(timerRef.current)
    setConfirmed(false)
    setService(null)
    setSlot(null)
    setStep(0)
  }

  return (
    <div className="flex flex-col h-[340px] rounded-2xl overflow-hidden border border-line bg-surface">
      {/* Step indicator */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-line font-mono text-[10.5px]" aria-label={`Step ${step + 1} of 3: ${STEP_LABELS[step]}`}>
        {STEP_LABELS.map((label, i) => (
          <span key={label} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-ink-3" aria-hidden="true">&rsaquo;</span>}
            <span className={i === step ? 'text-emerald font-medium' : i < step ? 'text-ink-2' : 'text-ink-3'}>
              {i + 1}&nbsp;{label}
            </span>
          </span>
        ))}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto" data-lenis-prevent aria-live="polite">
        {step === 0 && (
          <div className="p-4 space-y-2.5">
            <p className="text-[13px] text-ink-2">What would you like to book?</p>
            {SERVICES.map((s) => (
              <button
                key={s.name}
                type="button"
                onClick={() => pickService(s.name)}
                aria-label={`Book a ${s.name}`}
                className="flex items-center justify-between w-full rounded-xl border border-line bg-paper px-4 py-3 text-left hover:border-emerald hover:bg-emerald/5 transition-colors cursor-pointer"
              >
                <span className="text-[13.5px] font-medium text-ink">{s.name}</span>
                <span className="font-mono text-[11px] text-ink-3">{s.length}&nbsp;&rsaquo;</span>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="p-4">
            <p className="text-[13px] text-ink-2 mb-3">
              Pick a time for your <span className="font-medium text-ink">{service?.toLowerCase()}</span>:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {DAYS.map(({ day, date }) => (
                <div key={day} className="flex flex-col gap-1.5">
                  <div className="text-center rounded-lg bg-surface-2 py-1.5">
                    <span className="block text-[12px] font-semibold text-ink">{day}</span>
                    <span className="block font-mono text-[9.5px] text-ink-3">{date}</span>
                  </div>
                  {SLOTS.map((time) => {
                    const taken = TAKEN.has(`${day} ${time}`)
                    return (
                      <button
                        key={time}
                        type="button"
                        disabled={taken}
                        onClick={() => pickSlot(day, date, time)}
                        aria-label={taken ? `${day} ${time}, already booked` : `Book ${day} ${date} at ${time}`}
                        className={`rounded-lg border px-1 py-1.5 font-mono text-[10.5px] transition-colors ${
                          taken
                            ? 'border-line text-ink-3 line-through cursor-default opacity-60'
                            : 'border-line bg-paper text-ink hover:border-emerald hover:bg-emerald/10 cursor-pointer'
                        }`}
                      >
                        {time}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col h-full bg-[#EFEAE2]">
            {/* WA header — authentic WhatsApp chrome in both site themes */}
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#F0F2F5] border-b border-black/5">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0E7A48] text-white text-[12px] font-semibold shrink-0">SC</span>
              <span>
                <span className="block text-[13px] font-semibold text-[#111B21] leading-tight">Sunrise Clinic</span>
                <span className="block font-mono text-[10px] text-[#667781]">booking assistant &middot; WhatsApp</span>
              </span>
            </div>
            <div className="flex-1 p-3">
              {!confirmed ? (
                <div className="inline-block bg-white rounded-lg rounded-tl-[3px] px-3 py-2.5 shadow-sm text-[#667781]">
                  <span className="typing-dots" role="img" aria-label="Sunrise Clinic is typing"><span /><span /><span /></span>
                </div>
              ) : (
                <div className="max-w-[92%] bg-white rounded-lg rounded-tl-[3px] px-3.5 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0E7A48] text-white shrink-0">
                      <CheckIcon className="w-3 h-3" />
                    </span>
                    <span className="text-[13px] font-semibold text-[#10221C]">You&rsquo;re booked!</span>
                  </div>
                  <dl className="font-mono text-[10.5px] text-[#4A5A52] mt-2 space-y-1">
                    <div className="flex justify-between gap-3"><dt>Service</dt><dd className="text-[#10221C] text-right">{service}</dd></div>
                    <div className="flex justify-between gap-3"><dt>Day</dt><dd className="text-[#10221C] text-right">{slot?.day} · {slot?.date}</dd></div>
                    <div className="flex justify-between gap-3"><dt>Time</dt><dd className="text-[#10221C] text-right">{slot?.time}</dd></div>
                  </dl>
                  <p className="text-[11.5px] text-[#4A5A52] mt-2 leading-snug">
                    It&rsquo;s on the clinic&rsquo;s calendar. Reply CHANGE any time to reschedule.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-2 p-3 border-t border-line">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          aria-label="Go back one step"
          className="btn-ghost flex-1 py-2 text-[13px] disabled:opacity-40 disabled:cursor-default"
        >
          &lsaquo; Back
        </button>
        <button
          type="button"
          onClick={restart}
          disabled={step === 0 && !service}
          aria-label="Start the booking over"
          className="btn-primary flex-1 py-2 text-[13px]"
        >
          &#8635; Book another
        </button>
      </div>
    </div>
  )
}
