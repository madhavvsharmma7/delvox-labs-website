import { Reveal, SectionHeader } from '../lib/motion.jsx'
import SbiMitraDemo from './SbiMitraDemo.jsx'
import ReceptionistDemo from './ReceptionistDemo.jsx'
import InvoiceDemo from './InvoiceDemo.jsx'

const PROJECTS = [
  {
    title: 'SBI Mitra',
    outcome: 'Onboard banking customers in their own language.',
    stack: ['Agentic AI', 'Voice', 'WhatsApp'],
    demo: <SbiMitraDemo />,
    hint: 'Tap the replies to walk the onboarding.',
  },
  {
    title: 'AI Voice Receptionist',
    outcome: 'Never miss a patient call again.',
    stack: ['Vapi', 'Voice AI', 'Scheduling'],
    demo: <ReceptionistDemo />,
    hint: 'Simulate a missed call and watch the recovery.',
  },
  {
    title: 'Invoice Automation',
    outcome: 'Invoices out the door without anyone touching them.',
    stack: ['Claude API', 'Composio', 'Trigger.dev', 'Gmail'],
    demo: <InvoiceDemo />,
    hint: 'Step through the pipeline.',
    href: 'https://github.com/madhavvsharmma7/delvox_workspace',
    linkLabel: 'View on GitHub',
  },
]

export default function Projects() {
  return (
    <section id="demos" className="py-16 md:py-24 px-6 max-w-6xl mx-auto">
      <SectionHeader
        eyebrow="The work"
        title="Real systems. Try them."
        sub="These aren't screenshots of someone else's product. They're live, clickable demos of what we build."
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROJECTS.map(({ title, outcome, stack, demo, hint, href, linkLabel }, i) => (
          <Reveal
            key={title}
            delay={i * 80}
            className="flex flex-col rounded-3xl border border-line bg-surface p-5"
          >
            {demo}
            <p className="font-mono text-[11px] text-ink-3 mt-3">{hint}</p>

            <h3 className="headline text-ink text-xl md:text-2xl mt-4">{title}</h3>
            <p className="lead text-[15px] mt-2">{outcome}</p>

            <div className="flex flex-wrap gap-2 mt-4">
              {stack.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center rounded-full border border-line bg-paper px-2.5 py-1 font-mono text-[11px] text-ink-2 whitespace-nowrap"
                >
                  {s}
                </span>
              ))}
            </div>

            {href && (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-accent text-[14.5px] mt-auto pt-5 inline-block"
              >
                {linkLabel}&nbsp;&rsaquo;
              </a>
            )}
          </Reveal>
        ))}
      </div>
    </section>
  )
}
