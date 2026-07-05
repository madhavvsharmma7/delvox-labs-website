import { Reveal, smoothTo } from '../lib/motion.jsx'

const POINTS = [
  '14-day free trial',
  'No card required',
  "If Delvox doesn't recover a call, you pay nothing",
  'Cancel anytime',
]

export default function Guarantee() {
  return (
    <section className="py-10 md:py-14 px-6" aria-label="Our guarantee">
      <Reveal className="max-w-4xl mx-auto rounded-3xl border border-emerald/25 bg-emerald/5 px-7 py-9 md:px-12 md:py-11 text-center">
        <h2 className="headline text-ink text-2xl md:text-3xl">
          Try it on your own missed calls.
        </h2>

        <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 mt-6">
          {POINTS.map((p) => (
            <li key={p} className="flex items-center gap-2 text-[14px] text-ink-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-emerald shrink-0" aria-hidden="true">
                <path d="M4.5 12.5l5 5 10-11" />
              </svg>
              {p}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => smoothTo('trial')}
          className="btn-primary px-7 py-3 text-[15px] mt-8"
        >
          Start your free trial
        </button>
      </Reveal>
    </section>
  )
}
