import { Reveal, SectionHeader, smoothTo } from '../lib/motion.jsx'
import LeadCaptureDemo from './LeadCaptureDemo.jsx'
import BookingDemo from './BookingDemo.jsx'
import ReviewDemo from './ReviewDemo.jsx'
import MultilingualDemo from './MultilingualDemo.jsx'
import ReportDemo from './ReportDemo.jsx'

// Five live service demos — each one is a self-contained, scripted simulation
// of a system Delvox runs for local businesses. No API calls anywhere.

const SERVICES = [
  {
    title: 'WhatsApp Lead Capture',
    outcome: 'Every missed call gets an instant reply.',
    stack: 'WhatsApp Business API · Claude',
    demo: <LeadCaptureDemo />,
    hint: 'Type your name, or tap the replies.',
  },
  {
    title: 'Appointment Booking',
    outcome: 'Booked while you were busy.',
    stack: 'WhatsApp Business API · Calendar · Claude',
    demo: <BookingDemo />,
    hint: 'Pick a service, then a slot.',
  },
  {
    title: 'Review Management',
    outcome: 'Happy customers become public reviews.',
    stack: 'WhatsApp Business API · Google Business · Claude',
    demo: <ReviewDemo />,
    hint: 'Tap the replies to walk the thread.',
  },
  {
    title: 'Multilingual Support',
    outcome: "Speaks your customer's language.",
    stack: 'Vapi · Voice AI · Claude',
    demo: <MultilingualDemo />,
    hint: 'Tap play on a language.',
  },
  {
    title: 'Monthly Performance Report',
    outcome: 'You always know what Delvox recovered.',
    stack: 'Analytics · Claude',
    demo: <ReportDemo />,
    hint: 'Tap a bar to see that day.',
  },
]

export default function Projects() {
  return (
    <section id="demos" className="py-16 md:py-24 px-6 max-w-6xl mx-auto">
      <SectionHeader
        eyebrow="The services"
        title="Five systems. Try each one."
        sub="These aren't screenshots of someone else's product. They're live, tappable demos of the exact systems we run for local businesses."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map(({ title, outcome, stack, demo, hint }, i) => (
          <Reveal
            key={title}
            delay={i * 80}
            className="flex flex-col rounded-3xl border border-line bg-surface p-5"
          >
            {demo}
            <p className="font-mono text-[11px] text-ink-3 mt-3">{hint}</p>

            <h3 className="headline text-ink text-xl md:text-2xl mt-4">{title}</h3>
            <p className="lead text-[15px] mt-2">{outcome}</p>
            <p className="font-mono text-[11px] text-ink-3 mt-3">{stack}</p>

            <button
              type="button"
              onClick={() => smoothTo('trial')}
              className="link-accent text-[14.5px] mt-auto pt-5 text-left"
              aria-label={`Start your free trial of ${title}`}
            >
              Want this for your business? Start your free trial &rarr;
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
