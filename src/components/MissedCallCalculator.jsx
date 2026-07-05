import { useState } from 'react'
import { Reveal, SectionHeader, smoothTo } from '../lib/motion.jsx'

const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })

// One slider + synced number field. The label targets the slider; the number
// input carries its own aria-label so both are announced properly.
function SliderField({ id, label, min, max, step, value, onChange, unit, valueText, hardMax }) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
  // The number field may exceed the slider's max, but never a nonsensical hard cap
  const clamp = (n) => Math.max(0, hardMax ? Math.min(hardMax, n) : n)
  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-2">
        <label htmlFor={id} className="text-ink-2 text-sm">{label}</label>
        <span className="flex items-center gap-1.5 shrink-0">
          {unit === '₹' && <span aria-hidden="true" className="font-mono text-ink-3 text-sm">₹</span>}
          <input
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(clamp(Number(e.target.value)))}
            aria-label={label}
            className="field w-24 px-3 py-1.5 text-right font-mono text-[14px]"
          />
          {unit === '%' && <span aria-hidden="true" className="font-mono text-ink-3 text-sm">%</span>}
        </span>
      </div>
      <input
        id={id}
        type="range"
        className="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(max, Math.max(min, value))}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={valueText(value)}
        style={{ '--fill': `${pct}%` }}
      />
    </div>
  )
}

export default function MissedCallCalculator() {
  const [calls, setCalls] = useState(10) // missed calls per week
  const [value, setValue] = useState(1500) // avg customer value, ₹
  const [lostShare, setLostShare] = useState(60) // % of missed callers who never call back

  const missedPerMonth = (calls * 52) / 12
  const lostCustomers = missedPerMonth * (lostShare / 100)
  const lostPerMonth = Math.round(lostCustomers * value)
  const lostPerYear = lostPerMonth * 12

  return (
    <section id="calculator" className="py-16 md:py-24 px-6 max-w-5xl mx-auto">
      <SectionHeader
        eyebrow="The math"
        title="What do missed calls cost you?"
        sub="Slide to your numbers. Most owners underestimate this."
      />

      <div className="grid lg:grid-cols-2 gap-6 items-stretch">
        {/* Inputs */}
        <Reveal className="rounded-3xl border border-line bg-surface p-7 md:p-8 flex flex-col gap-7">
          <SliderField
            id="calc-calls"
            label="Calls you miss per week"
            min={1}
            max={80}
            step={1}
            value={calls}
            onChange={setCalls}
            valueText={(v) => `${v} missed calls per week`}
          />
          <SliderField
            id="calc-value"
            label="Average value of a customer"
            min={100}
            max={50000}
            step={100}
            value={value}
            onChange={setValue}
            unit="₹"
            valueText={(v) => `${inr.format(v)} rupees per customer`}
          />
          <SliderField
            id="calc-lost"
            label="Missed callers who never call back"
            min={10}
            max={90}
            step={5}
            value={lostShare}
            onChange={setLostShare}
            unit="%"
            hardMax={100}
            valueText={(v) => `${v} percent never call back`}
          />
          <p className="font-mono text-[11.5px] text-ink-3 mt-auto">
            &asymp; {Math.round(missedPerMonth)} missed calls a month &middot; adjust the last slider to your own estimate
          </p>
        </Reveal>

        {/* Result — the anchor */}
        <Reveal delay={90} className="rounded-3xl border border-line bg-surface p-7 md:p-8 flex flex-col">
          <p className="font-mono text-[11px] tracking-[0.08em] uppercase text-ink-3">
            Estimated revenue lost
          </p>

          <div aria-live="polite" className="mt-4">
            <p className="font-mono stat-honey text-[clamp(2.2rem,5vw,3.4rem)] font-semibold leading-none tracking-tight">
              &asymp;&nbsp;&#8377;{inr.format(lostPerMonth)}
              <span className="text-ink-3 text-lg font-normal">/mo</span>
            </p>
            <p className="font-mono text-ink-2 text-[15px] mt-3">
              &asymp; &#8377;{inr.format(lostPerYear)} a year &middot; ~{Math.round(lostCustomers)} customers lost every month
            </p>
          </div>

          <hr className="hr my-6" />

          <p className="text-ink text-[15px] leading-relaxed">
            Delvox answers those calls and recovers most of them,{' '}
            <span className="text-emerald font-medium">from &#8377;1,499/mo</span>.
          </p>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => smoothTo('trial')}
              className="btn-primary w-full sm:w-auto px-6 py-3 text-[15px]"
            >
              Stop the leak, start free
            </button>
          </div>

          <p className="font-mono text-[11.5px] text-ink-3 mt-5">
            An estimate based on your inputs, not a guarantee.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
