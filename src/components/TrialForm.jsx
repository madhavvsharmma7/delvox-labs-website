import { useCallback, useEffect, useRef, useState } from 'react'
import { Reveal, SectionHeader } from '../lib/motion.jsx'

const CONTACT_EMAIL = 'info@delvoxlabs.com'
const MSG_MAX = 500

// Letters (any language) and spaces only.
const NAME_RE = /^[\p{L} ]+$/u
const looksLikeEmail = (v) => /\S+@\S+\.\S+/.test(v)
const looksLikePhone = (v) => v.replace(/\D/g, '').length >= 10

function validate(form) {
  const errors = {}
  const name = form.name.trim()
  if (!name) errors.name = 'Please enter your name'
  else if (!NAME_RE.test(name)) errors.name = 'Letters and spaces only'

  if (!form.business.trim()) errors.business = 'Please add your business type'

  const contact = form.contact.trim()
  if (!contact || !(looksLikeEmail(contact) || looksLikePhone(contact))) {
    errors.contact = 'Please enter a valid phone or email'
  }
  return errors
}

export default function TrialForm() {
  const [form, setForm] = useState({ name: '', business: '', contact: '', message: '', website: '' })
  const [errors, setErrors] = useState({})
  const [plan, setPlan] = useState('')
  const [status, setStatus] = useState('idle')
  const loadedAt = useRef(0)

  // Update a field and clear its error as the user types.
  const set = useCallback(
    (key) => (e) => {
      const value = e.target.value
      setForm((f) => ({ ...f, [key]: value }))
      setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
    },
    []
  )

  // Record load time (for the bot time-check) + listen for pricing CTAs.
  useEffect(() => {
    loadedAt.current = Date.now()
    const onPlan = (e) => setPlan(e.detail || '')
    window.addEventListener('delvox:plan', onPlan)
    return () => window.removeEventListener('delvox:plan', onPlan)
  }, [])

  const isCustom = plan === 'Custom'

  const submit = async (e) => {
    e.preventDefault()

    // Bot protection — fail silently (show success so bots learn nothing):
    // (1) honeypot filled, or (2) submitted implausibly fast for a human.
    if (form.website) return setStatus('sent')
    if (Date.now() - loadedAt.current < 3000) return setStatus('sent')

    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          business: form.business.trim(),
          contact: form.contact.trim(),
          message: form.message.trim(),
          plan: isCustom ? 'Custom' : plan,
          website: form.website,
        }),
      })
      if (res.status === 429) return setStatus('ratelimited')
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const errClass = 'text-red-600 dark:text-red-400 text-[13px] mt-1.5'

  return (
    <section id="trial" className="py-16 md:py-24 px-6">
      <div className="max-w-xl mx-auto">
        <SectionHeader
          eyebrow="Start your trial"
          title="Two weeks of never missing a call. Free."
          sub="Tell us a little about your business. We'll set up your AI receptionist and you'll see recovered calls within days."
        />

        {status === 'sent' ? (
          <Reveal className="text-center py-12">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald text-white mb-5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
                <path d="M4.5 12.5l5 5 10-11" />
              </svg>
            </span>
            <h3 className="headline text-ink text-3xl mb-3">You're in.</h3>
            <p className="lead text-lg">We'll be in touch within 24 hours to set up your free trial.</p>
          </Reveal>
        ) : status === 'ratelimited' ? (
          <Reveal className="text-center py-12">
            <h3 className="headline text-ink text-3xl mb-3">Too many attempts.</h3>
            <p className="lead text-lg mb-6">Please email us directly and we'll get right back to you:</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="link-accent text-[17px]">{CONTACT_EMAIL}&nbsp;&rsaquo;</a>
          </Reveal>
        ) : status === 'error' ? (
          <Reveal className="text-center py-12">
            <h3 className="headline text-ink text-3xl mb-3">Something went wrong.</h3>
            <p className="lead text-lg mb-6">Email us directly and we'll sort it out:</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="link-accent text-[17px]">{CONTACT_EMAIL}&nbsp;&rsaquo;</a>
            <button onClick={() => setStatus('idle')} className="block mx-auto mt-6 link-accent text-sm cursor-pointer">
              &lsaquo;&nbsp;Try again
            </button>
          </Reveal>
        ) : (
          <Reveal>
            <form onSubmit={submit} noValidate className="space-y-5">
              {plan && (
                <div className="flex items-center justify-between rounded-xl border border-emerald/30 bg-emerald/5 px-4 py-3">
                  <span className="text-[14px] text-ink">
                    {isCustom ? (
                      <>Enquiry: <strong className="font-semibold">Custom build</strong></>
                    ) : (
                      <>Selected plan: <strong className="font-semibold">{plan}</strong>, starts after your free trial</>
                    )}
                  </span>
                  <button type="button" onClick={() => setPlan('')} className="font-mono text-[11px] text-ink-2 hover:text-ink cursor-pointer" aria-label="Clear selected plan">
                    clear
                  </button>
                </div>
              )}

              {/* Honeypot — hidden from real users; bots that fill it are dropped */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={form.website}
                onChange={set('website')}
                style={{ display: 'none' }}
              />

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="t-name" className="block text-ink-2 text-sm mb-2">Your name</label>
                  <input
                    id="t-name"
                    type="text"
                    maxLength={60}
                    value={form.name}
                    onChange={set('name')}
                    placeholder="Priya Sharma"
                    className="field"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 't-name-err' : undefined}
                  />
                  {errors.name && <p id="t-name-err" className={errClass}>{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="t-business" className="block text-ink-2 text-sm mb-2">Business type</label>
                  <input
                    id="t-business"
                    type="text"
                    maxLength={80}
                    value={form.business}
                    onChange={set('business')}
                    placeholder="Clinic, salon, repair shop…"
                    className="field"
                    aria-invalid={!!errors.business}
                    aria-describedby={errors.business ? 't-business-err' : undefined}
                  />
                  {errors.business && <p id="t-business-err" className={errClass}>{errors.business}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="t-contact" className="block text-ink-2 text-sm mb-2">Phone or email</label>
                <input
                  id="t-contact"
                  type="text"
                  maxLength={100}
                  value={form.contact}
                  onChange={set('contact')}
                  placeholder="+91 98765 43210 or you@business.com"
                  className="field"
                  autoComplete="on"
                  aria-invalid={!!errors.contact}
                  aria-describedby={errors.contact ? 't-contact-err' : undefined}
                />
                {errors.contact && <p id="t-contact-err" className={errClass}>{errors.contact}</p>}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="t-message" className="block text-ink-2 text-sm">
                    What do you need? <span className="text-ink-3 font-normal">(optional)</span>
                  </label>
                  <span className="font-mono text-[11px] text-ink-3" aria-hidden="true">
                    {form.message.length}/{MSG_MAX}
                  </span>
                </div>
                <textarea
                  id="t-message"
                  rows={3}
                  maxLength={MSG_MAX}
                  value={form.message}
                  onChange={set('message')}
                  placeholder="e.g. We miss calls every evening after 8 PM…"
                  className="field resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-primary w-full py-3.5 text-[17px]"
              >
                {status === 'sending' ? 'Sending…' : isCustom ? 'Send enquiry' : 'Start my free trial'}
              </button>
              <p className="text-center font-mono text-[12px] text-ink-3">No card required. We reply within a day.</p>
            </form>
          </Reveal>
        )}

        <Reveal delay={80} className="mt-14 text-center">
          <p className="text-ink-3 text-sm">
            Prefer email?{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="link-accent">{CONTACT_EMAIL}</a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
