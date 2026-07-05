import { Reveal, SectionHeader } from '../lib/motion.jsx'

const STEPS = [
  {
    num: '01',
    title: 'A customer calls',
    desc: "It's 9:41 PM. You're closed, driving, or with another customer.",
  },
  {
    num: '02',
    title: 'The call goes unanswered',
    desc: "Normally that lead is gone. Most callers won't try twice.",
  },
  {
    num: '03',
    title: 'Delvox answers in seconds',
    desc: 'The AI texts them back on WhatsApp, answers their questions, and offers a time.',
  },
  {
    num: '04',
    title: 'Lead captured & booked',
    desc: 'Name, need, and time land in your inbox. Nothing for you to chase.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="py-16 md:py-24 px-6 max-w-5xl mx-auto">
      <SectionHeader
        eyebrow="How it works"
        title="From missed call to booked customer"
        sub="The whole recovery takes seconds, and it runs every hour you can't."
      />

      <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line rounded-3xl overflow-hidden">
        {STEPS.map(({ num, title, desc }, i) => (
          <Reveal as="li" key={num} delay={i * 80} className="bg-paper p-8 md:p-9 h-full">
            <div className="font-mono text-emerald text-sm tracking-widest">{num}</div>
            <h3 className="headline text-ink text-xl md:text-2xl mt-5">{title}</h3>
            <p className="lead text-[15px] mt-3">{desc}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}
