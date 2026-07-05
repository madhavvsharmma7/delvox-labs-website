import { useEffect, useRef, useState } from 'react'

// DEMO 4 — Multilingual Support.
// Three language cards, each plays a ~15s clip of the AI receptionist handling
// a missed call in that language. Audio files live in public/ and are served
// from the site root:
//   public/hindi-demo.mp3    → /hindi-demo.mp3    (Hindi,   lang="hi")
//   public/tamil-demo.mp3    → /tamil-demo.mp3    (Tamil,   lang="ta")
//   public/marathi-demo.mp3  → /marathi-demo.mp3  (Marathi, lang="mr")
const LANGS = [
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', src: '/hindi-demo.mp3', scene: 'Missed call · Jaipur salon' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', src: '/tamil-demo.mp3', scene: 'Missed call · Chennai clinic' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', src: '/marathi-demo.mp3', scene: 'Missed call · Pune garage' },
]

export default function MultilingualDemo() {
  // status per language: 'idle' | 'playing'
  const [status, setStatus] = useState({})
  const [active, setActive] = useState(null)
  const audioRef = useRef(null)

  useEffect(() => () => audioRef.current?.pause(), [])

  const play = (lang) => {
    audioRef.current?.pause() // stop whatever is playing first
    setActive(lang.code)
    setStatus((s) => {
      const next = {}
      for (const k of Object.keys(s)) next[k] = s[k] === 'playing' ? 'idle' : s[k]
      return next
    })

    const audio = new Audio(lang.src)
    audioRef.current = audio
    audio.addEventListener('ended', () => {
      setStatus((s) => ({ ...s, [lang.code]: 'idle' }))
    })
    audio
      .play()
      .then(() => setStatus((s) => ({ ...s, [lang.code]: 'playing' })))
      .catch(() => setStatus((s) => ({ ...s, [lang.code]: 'idle' })))
  }

  const stop = (code) => {
    audioRef.current?.pause()
    setStatus((s) => ({ ...s, [code]: 'idle' }))
  }

  return (
    <div className="flex flex-col h-[340px] rounded-2xl overflow-hidden border border-line bg-surface">
      <div className="px-4 pt-3.5 pb-2.5 border-b border-line">
        <p className="font-mono text-[10.5px] uppercase tracking-wider text-emerald">Voice receptionist</p>
        <p className="text-[12.5px] text-ink-2 mt-1 leading-snug">Real AI voice answering a missed call, in your customer&rsquo;s language.</p>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-2.5 p-3.5">
        {LANGS.map((lang) => {
          const st = status[lang.code] || 'idle'
          const isActive = active === lang.code
          const playing = st === 'playing'
          return (
            <div
              key={lang.code}
              lang={lang.code}
              className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 transition-colors ${
                isActive ? 'border-emerald/40 bg-emerald/5' : 'border-line bg-paper'
              }`}
            >
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-2">
                  <span className="headline text-ink text-[17px]">{lang.native}</span>
                  <span lang="en" className="font-mono text-[10px] text-ink-3">{lang.name}</span>
                </span>
                <span lang="en" className="block font-mono text-[10px] text-ink-3 mt-0.5 truncate">{lang.scene}</span>
              </span>

              {/* Equalizer bars — alive on the playing card */}
              <span className={`eq-bars shrink-0 ${playing ? 'live' : ''} ${isActive ? 'text-emerald' : 'text-ink-3'}`} aria-hidden="true">
                <span /><span /><span /><span /><span />
              </span>

              {playing ? (
                <button
                  type="button"
                  onClick={() => stop(lang.code)}
                  aria-label={`Stop the ${lang.name} sample`}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald text-white shrink-0 hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3" aria-hidden="true">
                    <rect x="6" y="6" width="12" height="12" rx="1.5" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => play(lang)}
                  aria-label={`Play the ${lang.name} receptionist sample`}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald text-white shrink-0 hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 translate-x-[1px]" aria-hidden="true">
                    <path d="M8 5.14v13.72a1 1 0 0 0 1.52.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z" />
                  </svg>
                </button>
              )}
            </div>
          )
        })}
      </div>

      <p lang="en" className="px-4 pb-3 font-mono text-[10px] text-ink-3" aria-live="polite">
        Tap play to hear the AI answer in each language.
      </p>
    </div>
  )
}
