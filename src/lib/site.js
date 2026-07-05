// ── Shared contact details ───────────────────────────────────────────
// Single source of truth for email / phone / WhatsApp across the site.
// [PLACEHOLDER] values MUST be replaced with real numbers before launch.
export const CONTACT = {
  email: 'info@delvoxlabs.com',
  // Digits only, country code first (e.g. '919876543210') — used in wa.me links
  whatsapp: '[PLACEHOLDER: 91XXXXXXXXXX]',
  // Human-readable version shown in the UI
  whatsappDisplay: '[PLACEHOLDER: +91 …]',
  phone: '[PLACEHOLDER: +91 …]',
}

// True once a real WhatsApp number is set (i.e. the placeholder is replaced).
// UI can hide the WhatsApp link until then so a broken wa.me link never ships.
export const hasWhatsapp = !CONTACT.whatsapp.includes('[')

// wa.me deep link with an optional prefilled message
export function waLink(text = '') {
  const base = `https://wa.me/${CONTACT.whatsapp}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}
