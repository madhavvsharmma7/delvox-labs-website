import { Link } from 'react-router-dom'
import { Wordmark } from './LogoMark.jsx'
import { CONTACT, waLink, hasWhatsapp } from '../lib/site.js'

export default function Footer() {
  return (
    <footer className="border-t border-line py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <Wordmark className="text-[15px]" />
          <p className="font-mono text-ink-3 text-xs">Awake when you're not.</p>
          <div className="flex items-center gap-6">
            <a href={`mailto:${CONTACT.email}`} className="text-ink-2 text-xs hover:text-ink transition-colors duration-200">
              {CONTACT.email}
            </a>
            {hasWhatsapp && (
              <a href={waLink('Hi Delvox, I have a question about the AI receptionist.')} target="_blank" rel="noopener noreferrer" className="text-ink-2 text-xs hover:text-ink transition-colors duration-200">
                WhatsApp
              </a>
            )}
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-line flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-ink-3 text-xs">
            &copy; {new Date().getFullYear()} Delvox Labs. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-ink-2 text-xs hover:text-ink transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-ink-2 text-xs hover:text-ink transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
