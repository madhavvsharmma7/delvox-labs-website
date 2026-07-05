import { useState } from 'react'

// Clickable stepper through the invoice pipeline:
// email arrives → AI extracts → branded PDF → sent automatically.

const STEPS = [
  { title: 'Invoice email arrives', short: 'Email' },
  { title: 'AI extracts the data', short: 'Extract' },
  { title: 'Branded PDF generated', short: 'PDF' },
  { title: 'Sent automatically', short: 'Sent' },
]

function StepVisual({ step }) {
  if (step === 0) {
    return (
      <div className="w-full max-w-[260px] rounded-xl border border-line bg-paper p-4 text-left">
        <p className="font-mono text-[10.5px] text-ink-3">From</p>
        <p className="text-[13px] text-ink font-medium">accounts@acmesupplies.in</p>
        <p className="font-mono text-[10.5px] text-ink-3 mt-2.5">Subject</p>
        <p className="text-[13px] text-ink font-medium">Invoice #1042: July supplies</p>
        <p className="font-mono text-[10.5px] text-ink-3 mt-2.5 flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3 h-3" aria-hidden="true"><path d="M21.4 11.05l-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 1 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.5-8.49" /></svg>
          invoice_1042.pdf
        </p>
      </div>
    )
  }
  if (step === 1) {
    return (
      <div className="w-full max-w-[260px] rounded-xl border border-line bg-paper p-4">
        <p className="font-mono text-[10px] uppercase tracking-wider text-emerald mb-2.5">Claude extracted</p>
        <dl className="font-mono text-[11.5px] space-y-1.5">
          <div className="flex justify-between gap-4"><dt className="text-ink-3">vendor</dt><dd className="text-ink">Acme Supplies</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-ink-3">amount</dt><dd className="text-ink">₹18,400</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-ink-3">due</dt><dd className="text-ink">15 Jul 2026</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-ink-3">gstin</dt><dd className="text-emerald">valid ✓</dd></div>
        </dl>
      </div>
    )
  }
  if (step === 2) {
    return (
      <div className="w-full max-w-[200px] rounded-lg border border-line bg-white shadow-sm overflow-hidden" role="img" aria-label="Branded PDF preview">
        <div className="h-9 bg-[#0E7A48] flex items-center px-3">
          <span className="font-display text-white text-[11px] font-semibold tracking-tight">INVOICE · #1042</span>
        </div>
        <div className="p-3 space-y-1.5">
          <div className="h-1.5 w-3/4 rounded bg-black/15" />
          <div className="h-1.5 w-1/2 rounded bg-black/10" />
          <div className="h-1.5 w-2/3 rounded bg-black/10" />
          <div className="h-px bg-black/10 my-2" />
          <div className="flex justify-between items-center">
            <div className="h-1.5 w-1/3 rounded bg-black/10" />
            <span className="font-mono text-[10px] text-[#10221C]">₹18,400</span>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="w-full max-w-[260px] rounded-xl border border-emerald/40 bg-emerald/10 p-4 text-center">
      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald text-white mb-2">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
          <path d="M4.5 12.5l5 5 10-11" />
        </svg>
      </span>
      <p className="text-[13.5px] font-semibold text-ink">Sent via Gmail</p>
      <p className="font-mono text-[11px] text-ink-2 mt-1">09:02 AM · logged &amp; archived</p>
      <p className="font-mono text-[10.5px] text-ink-3 mt-2">Nobody touched it.</p>
    </div>
  )
}

export default function InvoiceDemo() {
  const [step, setStep] = useState(0)

  return (
    <div className="flex flex-col h-[340px] rounded-2xl overflow-hidden border border-line bg-surface">
      {/* Stepper */}
      <div className="flex items-center gap-1 p-3 border-b border-line" role="group" aria-label="Invoice pipeline steps">
        {STEPS.map((s, i) => (
          <button
            key={s.short}
            type="button"
            aria-current={step === i ? 'step' : undefined}
            aria-label={`Step ${i + 1}: ${s.title}`}
            onClick={() => setStep(i)}
            className={`flex-1 flex flex-col items-center gap-1 rounded-lg py-2 transition-colors cursor-pointer ${
              step === i ? 'bg-emerald/10' : 'hover:bg-surface-2'
            }`}
          >
            <span className={`flex items-center justify-center w-6 h-6 rounded-full font-mono text-[11px] ${
              step >= i ? 'bg-emerald text-white' : 'bg-surface-2 text-ink-3'
            }`}>
              {i + 1}
            </span>
            <span className={`text-[10.5px] font-medium ${step === i ? 'text-ink' : 'text-ink-3'}`}>{s.short}</span>
          </button>
        ))}
      </div>

      {/* Visual */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-4">
        <StepVisual step={step} />
        <p className="text-[13px] text-ink-2 text-center font-medium">{STEPS[step].title}</p>
      </div>

      {/* Controls */}
      <div className="flex gap-2 p-3 border-t border-line">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="btn-ghost flex-1 py-2 text-[13px] disabled:opacity-40 disabled:cursor-default"
        >
          &lsaquo; Back
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => (s + 1) % STEPS.length)}
          className="btn-primary flex-1 py-2 text-[13px]"
        >
          {step === STEPS.length - 1 ? '↺ Replay' : 'Next ›'}
        </button>
      </div>
    </div>
  )
}
