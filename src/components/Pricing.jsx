import { Reveal, SectionHeader, smoothTo } from '../lib/motion.jsx'

const PLANS = [
  {
    name: 'Starter',
    popular: true,
    price: '₹4,999',
    period: '/mo',
    setup: '+ ₹2,499 one-time setup',
    features: [
      'AI receptionist',
      'Missed-call recovery',
      'WhatsApp follow-up',
      'Lead capture',
      'Appointment booking',
    ],
    cta: 'Start free trial',
  },
  {
    name: 'Pro',
    price: '₹9,999',
    period: '/mo',
    setup: '+ ₹4,499 setup',
    features: [
      'Everything in Starter',
      'Review requests',
      'Custom automations',
      'Monthly performance report',
      'Priority support',
      'Multi-location',
    ],
    cta: 'Start free trial',
  },
  {
    name: 'Custom',
    price: 'Starting from ₹14,999',
    period: '/mo',
    setup: '+ ₹4,999 one-time setup',
    features: [
      'Extra AI agents',
      'More services & channels',
      'Bespoke integrations',
      'Dedicated build',
    ],
    cta: "Let's talk",
  },
]

function choosePlan(plan) {
  window.dispatchEvent(new CustomEvent('delvox:plan', { detail: plan }))
  smoothTo('trial')
}

export default function Pricing() {
  return (
    <section id="pricing" className="py-16 md:py-24 px-6 max-w-6xl mx-auto">
      <SectionHeader
        eyebrow="Pricing"
        title="14-day free trial. No card required."
        sub="Try Delvox on your real missed calls. Pick a plan only once it's earning its keep."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
        {PLANS.map(({ name, popular, price, period, setup, features, cta }, i) => (
          <Reveal
            key={name}
            delay={i * 70}
            className={`relative flex flex-col rounded-3xl p-7 h-full ${
              popular
                ? 'border-2 border-emerald bg-surface shadow-[0_18px_50px_-20px_rgba(14,122,72,0.35)]'
                : 'border border-line bg-surface'
            }`}
          >
            {popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald text-white font-mono text-[10px] tracking-widest uppercase px-3 py-1 whitespace-nowrap">
                Recommended
              </span>
            )}

            <h3 className="headline text-ink text-xl">{name}</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="headline text-ink text-3xl">{price}</span>
              {period && <span className="text-ink-3 text-sm">{period}</span>}
            </div>
            {setup && <p className="font-mono text-[11.5px] text-ink-3 mt-1.5">{setup}</p>}

            <ul className="mt-6 space-y-2.5 flex-1">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[14px] text-ink-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-emerald mt-1 shrink-0" aria-hidden="true">
                    <path d="M4.5 12.5l5 5 10-11" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => choosePlan(name)}
              className={`${popular ? 'btn-primary' : 'btn-ghost'} w-full py-2.5 text-[14px] mt-7`}
            >
              {cta}
            </button>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120} as="p" className="text-center font-mono text-[12px] text-ink-3 mt-8">
        Setup fee is charged once, when you activate after the trial. Cancel anytime.
      </Reveal>
    </section>
  )
}
