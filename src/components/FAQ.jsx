import { useState } from 'react'
import { Reveal, SectionHeader } from '../lib/motion.jsx'

// Keep in sync with the FAQPage JSON-LD in index.html.
const FAQS = [
  {
    q: 'How does Delvox answer calls I miss?',
    a: "When a call goes unanswered, Delvox's AI responds within seconds. It texts the caller back on WhatsApp, answers their questions, and captures their details as a lead. If they want an appointment, it books one.",
  },
  {
    q: 'Do I need a new phone number or hardware?',
    a: 'No. Delvox works with your existing business number. Setup happens remotely. There is nothing to install at your shop or clinic.',
  },
  {
    q: 'What happens after the 14-day free trial?',
    a: "If it's working for you, you pick a plan and the monthly subscription plus a one-time setup fee begins. If not, you walk away. No card is required for the trial, so there is nothing to cancel.",
  },
  {
    q: "Does it speak Hindi or my customers' language?",
    a: 'Yes. Delvox handles conversations in English, Hindi, and other Indian languages, so customers can reply in whatever language they are comfortable with.',
  },
  {
    q: 'Who owns the leads and the data?',
    a: 'You do. Every lead, message, and conversation belongs to your business. If you ever leave, your data goes with you.',
  },
  {
    q: 'How long does setup take?',
    a: 'Most businesses are live within a few days. We configure the AI around your services, hours, and common questions, test it with you, and switch it on.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <section id="faq" className="py-16 md:py-24 px-6 max-w-3xl mx-auto">
      <SectionHeader
        eyebrow="Questions"
        title="Answers, up front"
        sub="The things owners usually ask before switching Delvox on."
      />

      <Reveal className="border-t border-line">
        {FAQS.map((item, i) => {
          const isOpen = open === i
          return (
            <div key={i} className="border-b border-line">
              <button
                type="button"
                id={`faq-q-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-a-${i}`}
                className="w-full flex items-center justify-between gap-6 text-left py-6 cursor-pointer group"
              >
                <span className="text-ink text-lg md:text-xl">{item.q}</span>
                <span className={`faq-plus ${isOpen ? 'open' : ''}`} aria-hidden="true" />
              </button>
              <div id={`faq-a-${i}`} className={`faq-answer ${isOpen ? 'open' : ''}`} role="region" aria-labelledby={`faq-q-${i}`}>
                <div>
                  <p className="lead text-base md:text-lg pb-6 max-w-2xl">{item.a}</p>
                </div>
              </div>
            </div>
          )
        })}
      </Reveal>
    </section>
  )
}
