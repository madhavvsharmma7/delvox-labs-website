import { Reveal } from '../lib/motion.jsx'

const ITEMS = [
  'Answers in seconds',
  'Works 24/7',
  'Replies on WhatsApp',
  'You own your data',
]

export default function TrustStrip() {
  return (
    <Reveal as="section" className="px-6" aria-label="Why businesses trust Delvox">
      <ul className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-2 border-y border-line py-5">
        {ITEMS.map((item, i) => (
          <li key={item} className="flex items-center gap-8 font-mono text-[12.5px] text-ink-2">
            {i > 0 && <span aria-hidden="true" className="hidden sm:inline text-ink-3">&middot;</span>}
            {item}
          </li>
        ))}
      </ul>
    </Reveal>
  )
}
