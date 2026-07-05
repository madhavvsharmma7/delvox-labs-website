// Generates public/og.png — the 1200×630 Open Graph share card.
// Run: node scripts/gen-og.mjs
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'public', 'og.png')

const W = 1200
const H = 630

// Brand tokens (dark theme values from src/index.css)
const PINE = '#0C1712' // deep pine background
const INK = '#EAF0EC' // light ink
const EMERALD = '#179257' // emerald (dark-theme, brightened)
const HONEY = '#F2A93B' // honey accent

// System sans stack — web fonts don't load inside sharp's SVG rasterizer.
const SANS = "Segoe UI, Arial, Helvetica, sans-serif"

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glowEmerald" cx="0.12" cy="0.05" r="0.9">
      <stop offset="0" stop-color="${EMERALD}" stop-opacity="0.22" />
      <stop offset="0.55" stop-color="${EMERALD}" stop-opacity="0.06" />
      <stop offset="1" stop-color="${EMERALD}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="glowHoney" cx="0.95" cy="1" r="0.75">
      <stop offset="0" stop-color="${HONEY}" stop-opacity="0.14" />
      <stop offset="0.6" stop-color="${HONEY}" stop-opacity="0.04" />
      <stop offset="1" stop-color="${HONEY}" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Deep pine base + soft corner glows -->
  <rect width="${W}" height="${H}" fill="${PINE}" />
  <rect width="${W}" height="${H}" fill="url(#glowEmerald)" />
  <rect width="${W}" height="${H}" fill="url(#glowHoney)" />

  <!-- Hairline frame -->
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" fill="none" stroke="${INK}" stroke-opacity="0.08" stroke-width="2" />

  <!-- Wordmark -->
  <rect x="88" y="86" width="18" height="18" rx="5" fill="${EMERALD}" />
  <text x="122" y="103" font-family="${SANS}" font-size="30" font-weight="700" fill="${INK}" letter-spacing="0.5">Delvox Labs</text>

  <!-- Emerald accent rule above the headline -->
  <rect x="90" y="222" width="72" height="5" rx="2.5" fill="${EMERALD}" />

  <!-- Headline -->
  <text x="86" y="326" font-family="${SANS}" font-size="82" font-weight="700" fill="${INK}" letter-spacing="-1.5">Never miss a</text>
  <text x="86" y="424" font-family="${SANS}" font-size="82" font-weight="700" fill="${INK}" letter-spacing="-1.5">customer call again<tspan fill="${HONEY}">.</tspan></text>

  <!-- Tagline -->
  <text x="88" y="530" font-family="${SANS}" font-size="29" font-weight="500" fill="${INK}" fill-opacity="0.72" letter-spacing="0.3">AI receptionist&#160;&#160;<tspan fill="${HONEY}" fill-opacity="1">&#183;</tspan>&#160;&#160;WhatsApp lead capture&#160;&#160;<tspan fill="${HONEY}" fill-opacity="1">&#183;</tspan>&#160;&#160;14-day free trial</text>
</svg>
`

await sharp(Buffer.from(svg)).resize(W, H).png().toFile(OUT)

const meta = await sharp(OUT).metadata()
console.log(`Wrote ${OUT} — ${meta.width}x${meta.height} (${meta.format})`)
if (meta.width !== W || meta.height !== H) {
  console.error(`ERROR: expected ${W}x${H}`)
  process.exit(1)
}
