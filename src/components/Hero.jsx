import { Reveal, SplitReveal, useMagnetic, smoothTo } from '../lib/motion.jsx'
import PhoneDemo from './PhoneDemo.jsx'

export default function Hero() {
  const ctaRef = useMagnetic()

  return (
    <section className="min-h-screen flex items-center px-6 pt-32 pb-16 lg:pt-24">
      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-8 items-center">
        {/* Copy first in the DOM: mobile leads with the headline + CTA, and on
            lg the grid keeps it in the left column with the phone on the right */}
        <div className="text-center lg:text-left">
          <Reveal as="p" className="eyebrow mb-6">AI receptionist for Indian businesses</Reveal>

          <SplitReveal
            as="h1"
            onLoad
            text="Never miss a customer call again."
            className="display text-ink text-[clamp(2.6rem,5.5vw,4.6rem)]"
            stagger={0.07}
          />

          <Reveal as="p" delay={160} className="lead text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mt-7">
            When you can't pick up, Delvox's AI answers, texts the customer back
            on WhatsApp, and captures the lead. In seconds, day or night.
          </Reveal>

          <Reveal delay={220} className="flex flex-wrap items-center justify-center lg:justify-start gap-x-7 gap-y-4 mt-10">
            <button
              ref={ctaRef}
              onClick={() => smoothTo('trial')}
              className="btn-primary text-[16px] px-6 py-3"
            >
              Start your 14-day free trial
            </button>
            <button
              onClick={() => smoothTo('demos')}
              className="link-accent text-[16px]"
            >
              See how it works&nbsp;&rsaquo;
            </button>
          </Reveal>

          <Reveal delay={280} as="p" className="font-mono text-[12px] text-ink-3 mt-5">
            No card required.
          </Reveal>
        </div>

        {/* The signature phone */}
        <div className="flex justify-center">
          <PhoneDemo />
        </div>
      </div>
    </section>
  )
}
