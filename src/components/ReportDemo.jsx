import { useState } from 'react'

// DEMO 5 — Monthly Performance Report.
// A scripted dashboard: stat tiles, a tappable calls-by-day bar chart
// (divs only, no chart library), and a month-vs-month comparison row.
// Single series → emerald bars, honey highlight on the selected day,
// values revealed on tap/focus. All numbers are static sample data.

const STATS = [
  { label: 'Calls recovered', value: '47' },
  { label: 'Leads captured', value: '38' },
  { label: 'Appointments booked', value: '29' },
  { label: 'Est. revenue saved', value: '₹1,12,000', honey: true },
]

// Mon peak tapering to a Sun low — sums to the 47 recovered calls.
const DAYS = [
  { day: 'Mon', full: 'Monday', calls: 9 },
  { day: 'Tue', full: 'Tuesday', calls: 8 },
  { day: 'Wed', full: 'Wednesday', calls: 7 },
  { day: 'Thu', full: 'Thursday', calls: 7 },
  { day: 'Fri', full: 'Friday', calls: 6 },
  { day: 'Sat', full: 'Saturday', calls: 6 },
  { day: 'Sun', full: 'Sunday', calls: 4 },
]
const MAX_CALLS = Math.max(...DAYS.map((d) => d.calls))

const DELTAS = [
  { label: 'Calls recovered', delta: '31%', up: true },
  { label: 'Est. revenue', delta: '26%', up: true },
  { label: 'Leads lost', delta: '73%', up: false },
]

export default function ReportDemo() {
  const [selected, setSelected] = useState(0)
  const sel = DAYS[selected]

  return (
    <div className="flex flex-col h-[340px] rounded-2xl overflow-hidden border border-line bg-surface p-3.5">
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[10.5px] uppercase tracking-wider text-emerald">Monthly report</p>
        <p className="font-mono text-[10px] text-ink-3">July 2026 · Shine Auto Care</p>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-2 mt-2.5">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-paper px-3 py-2">
            <p className="font-mono text-[9.5px] text-ink-3 leading-tight">{s.label}</p>
            <p className={`headline text-[17px] mt-0.5 ${s.honey ? 'stat-honey' : 'text-ink'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Bar chart — calls by day of week */}
      <div className="flex-1 flex flex-col justify-end mt-2.5">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-[10px] text-ink-3">Calls recovered by day</p>
          <p className="font-mono text-[10px] text-ink" aria-live="polite">
            {sel.full}: <span className="stat-honey font-medium">{sel.calls} calls</span>
          </p>
        </div>
        <div className="flex items-end gap-1.5 h-[64px] mt-1.5" role="group" aria-label="Bar chart: calls recovered by day of week. Tap a bar to see its value.">
          {DAYS.map((d, i) => (
            <button
              key={d.day}
              type="button"
              onClick={() => setSelected(i)}
              aria-pressed={selected === i}
              aria-label={`${d.full}: ${d.calls} calls recovered`}
              className="flex-1 h-full flex flex-col justify-end gap-0.5 group cursor-pointer"
            >
              <span
                className={`block font-mono text-[9px] text-center leading-none transition-opacity ${
                  selected === i ? 'stat-honey opacity-100' : 'text-ink-3 opacity-0 group-hover:opacity-100'
                }`}
                aria-hidden="true"
              >
                {d.calls}
              </span>
              <span
                className={`block w-full rounded-t-[4px] transition-colors ${selected === i ? 'bg-honey' : 'bg-emerald'}`}
                style={{ height: `${(d.calls / MAX_CALLS) * 82}%` }}
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 mt-1" aria-hidden="true">
          {DAYS.map((d, i) => (
            <span key={d.day} className={`flex-1 text-center font-mono text-[9px] ${selected === i ? 'text-ink' : 'text-ink-3'}`}>
              {d.day}
            </span>
          ))}
        </div>
      </div>

      {/* This month vs last month */}
      <div className="border-t border-line mt-2.5 pt-2">
        <p className="font-mono text-[9.5px] text-ink-3">This month vs June</p>
        <div className="grid grid-cols-3 gap-2 mt-1">
          {DELTAS.map((d) => (
            <p key={d.label} className="font-mono text-[9px] text-ink-3 leading-tight">
              {d.label}
              <span className="block text-emerald text-[11px] font-medium mt-0.5 whitespace-nowrap">
                <span aria-hidden="true">{d.up ? '↑' : '↓'}</span>
                <span className="sr-only">{d.up ? 'up' : 'down'}</span> {d.delta}
              </span>
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
