import { Reveal, SectionHeader } from '../lib/motion.jsx'

// Cell values: true = yes, false = no, string = plain text
const ROWS = [
  { label: 'Monthly cost', delvox: 'From ₹4,999', human: '₹15,000–25,000 approx.', none: 'Free' },
  { label: 'Available 24/7', delvox: true, human: false, none: true },
  { label: 'Answers in seconds', delvox: true, human: true, none: false },
  { label: 'Replies on WhatsApp', delvox: true, human: false, none: false },
  { label: 'Books appointments', delvox: true, human: true, none: false },
  { label: 'Captures lead details', delvox: true, human: true, none: 'Only if they leave a message' },
  { label: "Works when you're closed or busy", delvox: true, human: false, none: 'Takes messages' },
  { label: 'Setup time', delvox: 'Days', human: 'Weeks of hiring & training', none: 'Minutes' },
]

function Cell({ value }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-emerald" aria-hidden="true">
          <path d="M4.5 12.5l5 5 10-11" />
        </svg>
        <span className="sr-only">Yes</span>
      </span>
    )
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 text-ink-3" aria-hidden="true">
          <path d="M6 12h12" />
        </svg>
        <span className="sr-only">No</span>
      </span>
    )
  }
  return <span className="text-ink-2">{value}</span>
}

export default function Comparison() {
  return (
    <section className="py-16 md:py-24 px-6 max-w-5xl mx-auto" aria-label="Delvox compared with the alternatives">
      <SectionHeader
        eyebrow="Compare"
        title="Your options, honestly."
        sub="What it actually takes to stop missing calls, trade-offs included."
      />

      <Reveal
        className="overflow-x-auto rounded-3xl border border-line bg-surface"
        // contain: layout isolates the table's internal layout so its reveal
        // (and horizontal scroll) can't trigger layout recalcs on the rest of
        // the page. will-change: transform pre-promotes it to its own GPU layer
        // so the fade/slide-in composites smoothly as the section scrolls in.
        // (This is a single, bounded element — the correct scoped use of
        // will-change, unlike a blanket rule on every .reveal.)
        style={{ contain: 'layout', willChange: 'transform' }}
        tabIndex={0}
        role="region"
        aria-label="Comparison table, scrolls horizontally on small screens"
        data-lenis-prevent
      >
        <table className="w-full min-w-[600px] border-separate border-spacing-0 text-[14px]">
          <caption className="sr-only">
            Comparison of Delvox, a human receptionist, and voicemail or nothing
          </caption>
          <thead>
            <tr>
              <th scope="col" className="text-left px-6 py-4 border-b border-line w-[32%]">
                <span className="sr-only">Feature</span>
              </th>
              <th scope="col" className="px-4 py-4 border-b-2 border-emerald bg-emerald/5 text-emerald font-semibold text-[14px] whitespace-nowrap">
                Delvox
              </th>
              <th scope="col" className="px-4 py-4 border-b border-line text-ink-2 font-medium whitespace-nowrap">
                Human receptionist
              </th>
              <th scope="col" className="px-4 py-4 border-b border-line text-ink-2 font-medium whitespace-nowrap">
                Voicemail / nothing
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(({ label, delvox, human, none }, i) => {
              const last = i === ROWS.length - 1
              const rowBorder = last ? '' : 'border-b border-line'
              return (
                <tr key={label}>
                  <th scope="row" className={`text-left px-6 py-4 font-medium text-ink ${rowBorder}`}>
                    {label}
                  </th>
                  <td className={`px-4 py-4 text-center bg-emerald/5 font-medium text-ink ${rowBorder}`}>
                    <Cell value={delvox} />
                  </td>
                  <td className={`px-4 py-4 text-center ${rowBorder}`}>
                    <Cell value={human} />
                  </td>
                  <td className={`px-4 py-4 text-center ${rowBorder}`}>
                    <Cell value={none} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Reveal>

      <Reveal delay={100} as="p" className="text-center font-mono text-[12px] text-ink-3 mt-6">
        Receptionist cost is an approximate urban-India salary range. It varies by city and role.
      </Reveal>
    </section>
  )
}
