import { Reveal, SectionHeader } from '../lib/motion.jsx'

// ⚠ OWNER TODO: every [PLACEHOLDER] below must be replaced with a REAL quote
// from a real customer (with their permission) before this ships prominently.
// Delete any card you don't have a real quote for — one true quote beats three
// placeholders.
const QUOTES = [
  {
    quote: '[PLACEHOLDER: customer quote — one or two sentences in their own words, e.g. what changed after Delvox started answering their missed calls]',
    name: '[PLACEHOLDER: name]',
    role: '[PLACEHOLDER: business type, city]',
  },
  {
    quote: '[PLACEHOLDER: customer quote]',
    name: '[PLACEHOLDER: name]',
    role: '[PLACEHOLDER: business type, city]',
  },
  {
    quote: '[PLACEHOLDER: customer quote]',
    name: '[PLACEHOLDER: name]',
    role: '[PLACEHOLDER: business type, city]',
  },
]

export default function SocialProof() {
  return (
    <section className="py-16 md:py-24 px-6 max-w-6xl mx-auto" aria-label="Customer results">
      <SectionHeader
        eyebrow="Proof"
        title="Real results, as they happen."
        sub="We're a young company and we won't fake this part. As our first businesses go live, their words and numbers land here."
      />

      <div className="grid md:grid-cols-3 gap-6">
        {QUOTES.map(({ quote, name, role }, i) => (
          <Reveal
            key={i}
            delay={i * 80}
            as="figure"
            className="flex flex-col rounded-3xl border border-line bg-surface p-7 m-0"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-emerald/60 shrink-0" aria-hidden="true">
              <path d="M6.5 11c-.3 0-.6 0-.9.1.5-1.8 1.9-3.3 3.7-4L8.6 5C5.4 6.2 3.2 9.2 3.2 12.6c0 2.5 1.5 4.4 3.6 4.4 1.8 0 3.2-1.4 3.2-3.1 0-1.6-1.4-2.9-3.5-2.9zm9.6 0c-.3 0-.6 0-.9.1.5-1.8 1.9-3.3 3.7-4L18.2 5c-3.2 1.2-5.4 4.2-5.4 7.6 0 2.5 1.5 4.4 3.6 4.4 1.8 0 3.2-1.4 3.2-3.1 0-1.6-1.4-2.9-3.5-2.9z" />
            </svg>
            <blockquote className="text-ink-2 text-[15px] leading-relaxed mt-4 flex-1">
              {quote}
            </blockquote>
            <figcaption className="mt-6 pt-5 border-t border-line">
              <span className="block text-ink text-[14px] font-medium">{name}</span>
              <span className="block font-mono text-[11.5px] text-ink-3 mt-1">{role}</span>
            </figcaption>
          </Reveal>
        ))}
      </div>

      {/* Honest status line — true today; update the placeholder with a real early result */}
      <Reveal delay={140} as="p" className="text-center font-mono text-[12px] text-ink-3 mt-10">
        Now onboarding our first businesses &middot; [PLACEHOLDER: early result — e.g. &ldquo;12 calls recovered in the first week&rdquo;]
      </Reveal>
    </section>
  )
}
