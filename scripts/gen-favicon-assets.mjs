import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const svgBuf = readFileSync(join(root, 'public', 'favicon.svg'))

async function run() {
  // apple-touch-icon: 180×180 PNG
  await sharp(svgBuf)
    .resize(180, 180)
    .png()
    .toFile(join(root, 'public', 'apple-touch-icon.png'))
  console.log('✓ apple-touch-icon.png (180×180)')

  // PNG frames for ICO
  const png32 = await sharp(svgBuf).resize(32, 32).png().toBuffer()
  const png16 = await sharp(svgBuf).resize(16, 16).png().toBuffer()

  // Build ICO — modern ICO embeds raw PNG bytes directly
  const count = 2
  const headerSize = 6
  const dirSize = headerSize + count * 16
  const off32 = dirSize
  const off16 = dirSize + png32.length

  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)     // reserved
  header.writeUInt16LE(1, 2)     // type: ICO
  header.writeUInt16LE(count, 4) // image count

  const e32 = Buffer.alloc(16)
  e32.writeUInt8(32, 0); e32.writeUInt8(32, 1)
  e32.writeUInt8(0, 2);  e32.writeUInt8(0, 3)
  e32.writeUInt16LE(1, 4); e32.writeUInt16LE(32, 6)
  e32.writeUInt32LE(png32.length, 8)
  e32.writeUInt32LE(off32, 12)

  const e16 = Buffer.alloc(16)
  e16.writeUInt8(16, 0); e16.writeUInt8(16, 1)
  e16.writeUInt8(0, 2);  e16.writeUInt8(0, 3)
  e16.writeUInt16LE(1, 4); e16.writeUInt16LE(32, 6)
  e16.writeUInt32LE(png16.length, 8)
  e16.writeUInt32LE(off16, 12)

  writeFileSync(join(root, 'public', 'favicon.ico'), Buffer.concat([header, e32, e16, png32, png16]))
  console.log('✓ favicon.ico (32×32 + 16×16)')
}

run().catch(e => { console.error(e); process.exit(1) })
