// Vercel serverless function — sends the trial/contact form to info@delvoxlabs.com
// via Resend, plus a best-effort confirmation to the submitter.
// RESEND_API_KEY is read from the environment; nothing is ever hardcoded.
// Node globals (process) are declared for this dir in eslint.config.js.
import { Resend } from 'resend'

const TO = process.env.CONTACT_TO || 'info@delvoxlabs.com'
const FROM = process.env.RESEND_FROM || 'Delvox Labs <onboarding@resend.dev>'

// Single-line fields: strip CR/LF/tabs (blocks header-style injection) and cap.
const cleanLine = (v, max) => String(v ?? '').replace(/[\r\n\t]+/g, ' ').trim().slice(0, max)
const cleanText = (v, max) => String(v ?? '').trim().slice(0, max)
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim())
const isPhone = (v) => String(v).replace(/\D/g, '').length >= 10
const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ))

// Best-effort in-memory rate limit: max 3 submissions per IP per hour.
// Per-instance only (Vercel serverless instances aren't shared) — a durable
// store (Vercel KV / Upstash) would make it global; this blunts casual abuse.
const RATE_WINDOW = 60 * 60 * 1000
const RATE_MAX = 3
const hits = new Map()
function rateLimited(ip) {
  const now = Date.now()
  if (hits.size > 5000) hits.clear() // crude memory guard against unbounded growth
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW)
  if (recent.length >= RATE_MAX) {
    hits.set(ip, recent)
    return true
  }
  recent.push(now)
  hits.set(ip, recent)
  return false
}

function clientIp(req) {
  const xff = req.headers['x-forwarded-for']
  if (typeof xff === 'string' && xff.length) return xff.split(',')[0].trim()
  return req.headers['x-real-ip'] || 'unknown'
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = req.body ?? {}

  // Honeypot: real users never fill "website". Pretend success, send nothing.
  if (cleanLine(body.website, 100)) {
    return res.status(200).json({ ok: true })
  }

  const name = cleanLine(body.name, 60)
  const business = cleanLine(body.business || body.business_type, 80)
  const contact = cleanLine(body.contact, 100)
  const message = cleanText(body.message, 500)
  const plan = cleanLine(body.plan, 60)

  if (!name || !business || !(isEmail(contact) || isPhone(contact))) {
    return res.status(400).json({ error: 'Missing or invalid fields' })
  }

  // Rate limit: max 3 per IP per hour.
  if (rateLimited(clientIp(req))) {
    return res.status(429).json({ error: 'Too many attempts' })
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set')
    return res.status(500).json({ error: 'Email is not configured yet.' })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const isEnquiry = /custom/i.test(plan)
  const kind = isEnquiry ? 'Enquiry' : 'Trial Request'
  const subject = `New ${kind} — ${business}`

  const rows = [
    ['Name', name],
    ['Business type', business],
    ['Phone / email', contact],
    plan ? ['Plan', plan] : null,
    message ? ['Message', message] : null,
  ].filter(Boolean)

  const html = `
    <div style="font-family:system-ui,sans-serif;font-size:15px;color:#10221C;line-height:1.6">
      <h2 style="margin:0 0 12px">New ${kind}</h2>
      <table style="border-collapse:collapse">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#6b7c74;vertical-align:top">${k}</td><td style="padding:4px 0"><strong>${escapeHtml(v)}</strong></td></tr>`
          )
          .join('')}
      </table>
      <p style="margin-top:16px;color:#9aa8a1;font-size:12px">Sent from the Delvox Labs website.</p>
    </div>`
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n')

  // 1) Notify the team. This is what determines success.
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      subject,
      html,
      text,
      replyTo: isEmail(contact) ? contact : undefined,
    })
    if (error) {
      console.error('Resend notify error:', error)
      return res.status(502).json({ error: 'Could not send the message.' })
    }
  } catch (err) {
    console.error('Resend notify threw:', err?.message)
    return res.status(502).json({ error: 'Could not send the message.' })
  }

  // 2) Best-effort confirmation to the submitter (only when they left an email
  //    and the sending domain is verified). Never fails the request.
  if (isEmail(contact)) {
    try {
      await resend.emails.send({
        from: FROM,
        to: [contact],
        subject: 'We got your request · Delvox Labs',
        html: `
          <div style="font-family:system-ui,sans-serif;font-size:15px;color:#10221C;line-height:1.6">
            <p>Hi ${escapeHtml(name)},</p>
            <p>Thanks for reaching out to Delvox Labs. We'll be in touch within 24 hours to set up your free trial and get your AI receptionist catching missed calls.</p>
            <p>Need us sooner? Just reply to this email or write to info@delvoxlabs.com.</p>
            <p style="color:#6b7c74">Delvox Labs</p>
          </div>`,
        text: `Hi ${name},\n\nThanks for reaching out to Delvox Labs. We'll be in touch within 24 hours to set up your free trial.\n\nNeed us sooner? Reply to this email or write to info@delvoxlabs.com.\n\nDelvox Labs`,
      })
    } catch (err) {
      console.error('Resend confirmation failed (non-fatal):', err?.message)
    }
  }

  return res.status(200).json({ ok: true })
}
