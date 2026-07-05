import { Reveal } from '../lib/motion.jsx'

// Text wordmarks only — no downloaded logos. All true: this is the stack.
const STACK = [
  { name: 'Claude', by: 'Anthropic' },
  { name: 'Vapi' },
  { name: 'WhatsApp Business' },
  { name: 'Composio' },
  { name: 'Trigger.dev' },
]

export default function BuiltOn() {
  return (
    <Reveal as="section" className="py-10 md:py-14 px-6" aria-label="Technology Delvox is built on">
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-mono text-[11px] tracking-[0.08em] uppercase text-ink-3">
          Powered by
        </p>

        <ul className="flex flex-wrap items-center justify-center gap-2.5 mt-5">
          {STACK.map(({ name, by }) => (
            <li
              key={name}
              className="inline-flex items-baseline gap-1.5 rounded-full border border-line bg-surface px-4 py-1.5"
            >
              <span className="font-display font-semibold text-ink-2 text-[13.5px] whitespace-nowrap">{name}</span>
              {by && <span className="font-mono text-[10.5px] text-ink-3">by {by}</span>}
            </li>
          ))}
        </ul>

        <p className="text-ink-3 text-[13.5px] mt-6">
          Your leads and data are yours, DPDP-aligned. You can export or delete anytime.
        </p>
      </div>
    </Reveal>
  )
}
