import { useCallback, useEffect, useState } from 'react'
import { Reveal, SectionHeader } from '../lib/motion.jsx'

const FORMSPREE_URL = 'https://formspree.io/f/mgobnbrg'
const CONTACT_EMAIL = 'info@delvoxlabs.com'

export default function TrialForm() {
  const [form, setForm] = useState({ name: '', business: '', contact: '', message: '' })
  const [plan, setPlan] = useState('')
  const [status, setStatus] = useState('idle')

  const set = useCallback((key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value })), [])

  // Pricing CTAs dispatch the chosen plan before scrolling here.
  useEffect(() => {
    const onPlan = (e) => setPlan(e.detail || '')
    window.addEventListener('delvox:plan', onPlan)
    return () => window.removeEventListener('delvox:plan', onPlan)
  }, [])

  const isCustom = plan === 'Custom'

  const submit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    const looksLikeEmail = form.contact.includes('@')
    const payload = {
      name: form.name,
      business_type: form.business,
      contact: form.contact,
      message: form.message,
      plan: plan || 'Not selected',
      _subject: isCustom
        ? `Custom enquiry · ${form.name} (Delvox Labs)`
        : `Trial request · ${plan || 'General'} · ${form.name} (Delvox Labs)`,
    }
    if (looksLikeEmail) payload._replyto = form.contact
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

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
            <p className="lead text-lg">We'll reach out within a day to set up your trial. Keep an eye on your phone, fittingly.</p>
          </Reveal>
        ) : status === 'error' ? (
          <Reveal className="text-center py-12">
            <h3 className="headline text-ink text-3xl mb-3">Something went wrong.</h3>
            <p className="lead text-lg mb-6">The form couldn't send. Email us directly instead:</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="link-accent text-[17px]">{CONTACT_EMAIL}&nbsp;&rsaquo;</a>
            <button onClick={() => setStatus('idle')} className="block mx-auto mt-6 link-accent text-sm cursor-pointer">
              &lsaquo;&nbsp;Try again
            </button>
          </Reveal>
        ) : (
          <Reveal>
            <form onSubmit={submit} className="space-y-5">
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

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="t-name" className="block text-ink-2 text-sm mb-2">Your name</label>
                  <input id="t-name" type="text" required value={form.name} onChange={set('name')} placeholder="Priya Sharma" className="field" autoComplete="name" />
                </div>
                <div>
                  <label htmlFor="t-business" className="block text-ink-2 text-sm mb-2">Business type</label>
                  <input id="t-business" type="text" required value={form.business} onChange={set('business')} placeholder="Clinic, salon, repair shop…" className="field" />
                </div>
              </div>
              <div>
                <label htmlFor="t-contact" className="block text-ink-2 text-sm mb-2">Phone or email</label>
                <input id="t-contact" type="text" required value={form.contact} onChange={set('contact')} placeholder="+91 98765 43210 or you@business.com" className="field" autoComplete="on" />
              </div>
              <div>
                <label htmlFor="t-message" className="block text-ink-2 text-sm mb-2">What do you need? <span className="text-ink-3 font-normal">(optional)</span></label>
                <textarea
                  id="t-message"
                  rows={3}
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
