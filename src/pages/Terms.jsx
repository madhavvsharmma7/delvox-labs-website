import { Link } from 'react-router-dom'
import LegalLayout from '../components/LegalLayout.jsx'

const EMAIL = 'info@delvoxlabs.com'

export default function Terms() {
  return (
    <LegalLayout title="Terms of Service" updated="5 July 2026">
      <p>
        These Terms of Service ("Terms") govern your use of the Delvox Labs website and the Delvox
        AI receptionist service ("the Service"), operated by [PLACEHOLDER: legal entity name],
        registered at [PLACEHOLDER: registered address, India]. By starting a trial or using the
        Service, you agree to these Terms.
      </p>

      <h2>1. The Service</h2>
      <p>
        Delvox provides an AI-powered receptionist for businesses: when a customer call goes
        unanswered, the Service responds on your behalf, typically via WhatsApp, answers
        questions, captures lead details, and, on applicable plans, books appointments. Exact
        features depend on the plan you choose.
      </p>

      <h2>2. Free trial</h2>
      <ul>
        <li>New customers receive a 14-day free trial. No payment card is required to start it.</li>
        <li>The trial ends automatically. If you do not activate a paid plan, the Service simply stops. You will not be charged.</li>
        <li>We may reasonably limit trial usage to prevent abuse.</li>
      </ul>

      <h2>3. Billing</h2>
      <ul>
        <li>Paid plans are billed as a monthly recurring subscription at the price of your chosen plan.</li>
        <li>A one-time setup fee applies and is charged when you activate a paid plan after the trial (Starter ₹2,999; Growth ₹4,999; Pro and Custom as quoted).</li>
        <li>Prices are in Indian Rupees and exclusive of applicable taxes (such as GST) unless stated otherwise.</li>
        <li>You may cancel at any time; cancellation takes effect at the end of the current billing period. Fees already paid are non-refundable except where required by law.</li>
      </ul>

      <h2>4. Your responsibilities</h2>
      <ul>
        <li>Provide accurate business information so the AI can represent your business correctly.</li>
        <li>Only use the Service for lawful business communication. Do not use it for spam, harassment, or messages that violate WhatsApp's or your telecom provider's terms.</li>
        <li>You confirm you are authorised to have follow-up messages sent to callers on behalf of your business.</li>
      </ul>

      <h2>5. Acceptable use</h2>
      <p>
        We may suspend or terminate the Service for use that is unlawful, abusive, deceptive, or
        that threatens the integrity of our systems or third-party platforms the Service depends
        on.
      </p>

      <h2>6. AI-generated responses</h2>
      <p>
        The Service uses artificial intelligence to conduct conversations. We configure and test
        it with you, but AI responses may occasionally be imperfect. You should review captured
        leads and bookings, and tell us promptly about anything that needs correcting.
      </p>

      <h2>7. Data</h2>
      <p>
        Your business owns its leads and conversations. Our handling of personal data is described
        in the <Link to="/privacy">Privacy Policy</Link>.
      </p>

      <h2>8. Liability</h2>
      <p>
        The Service is provided on an "as is" basis. To the maximum extent permitted by law, our
        total liability for any claim arising out of the Service is limited to the amount you paid
        us in the three months preceding the claim. We are not liable for indirect or
        consequential losses, including lost business from calls or messages that were not
        recovered.
      </p>

      <h2>9. Termination</h2>
      <p>
        You may stop using the Service and cancel at any time. We may terminate with reasonable
        notice, or immediately for breach of these Terms. On termination we will, on request,
        export your data and then delete it as described in the Privacy Policy.
      </p>

      <h2>10. Changes</h2>
      <p>
        We may update these Terms from time to time. Material changes will be notified by email or
        on this page, and continued use after the change constitutes acceptance.
      </p>

      <h2>11. Governing law</h2>
      <p>
        These Terms are governed by the laws of India, and disputes are subject to the exclusive
        jurisdiction of the courts at [PLACEHOLDER: city], India.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these Terms: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
    </LegalLayout>
  )
}
