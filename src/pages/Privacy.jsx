import LegalLayout from '../components/LegalLayout.jsx'

const EMAIL = 'info@delvoxlabs.com'

export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" updated="5 July 2026">
      <p>
        This Privacy Policy explains how Delvox Labs ("Delvox", "we", "us"), operated by
        [PLACEHOLDER: legal entity name], with its registered address at [PLACEHOLDER: registered
        address, India], collects, uses, and protects your information when you use our website
        and our AI receptionist service.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Website forms.</strong> When you request a trial or contact us, we collect the
          details you submit: your name, business type, phone number and/or email address, and
          anything you write in the message field.
        </li>
        <li>
          <strong>Service data.</strong> When the Delvox service is active for your business, we
          process call events (for example, that a call was missed and when), WhatsApp
          conversations conducted by the AI assistant on your behalf, and the lead details
          captured in those conversations (such as a caller's name, need, and preferred time).
        </li>
        <li>
          <strong>Basic technical data.</strong> Standard server logs (IP address, browser type,
          pages visited) generated when you browse this website.
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To respond to your trial request or enquiry and set up your service.</li>
        <li>To operate the AI receptionist for your business: answering missed calls, replying on WhatsApp, and delivering captured leads to you.</li>
        <li>To improve the reliability and quality of the service.</li>
        <li>To send you service-related communication. We do not sell your data, and we do not use your customers' conversations to market to them.</li>
      </ul>

      <h2>Form submissions</h2>
      <p>
        Form submissions are delivered to our inbox by email through Resend, a third-party email
        service. If you provide an email address, we also send you a confirmation. Resend's own
        privacy policy applies to that processing.
      </p>

      <h2>Cookies and analytics</h2>
      <p>
        This website stores a single preference in your browser's local storage: your chosen
        light/dark theme. We do not set advertising cookies. We use Vercel Web Analytics to
        understand how the site is used, for example, which pages are visited and roughly where
        visitors come from. It is cookieless: it does not set cookies, does not build a profile of
        you, and does not use your personal data to track you across other sites.
      </p>

      <h2>WhatsApp and communication consent</h2>
      <p>
        The Delvox service sends WhatsApp messages to callers on behalf of your business, in
        response to their call. By using the service, you confirm you are authorised to have such
        follow-up messages sent for your business. Callers may opt out of further messages at any
        time by replying to the conversation, and we honour such requests.
      </p>

      <h2>Who owns the data</h2>
      <p>
        Your business owns its leads and conversations. If you stop using Delvox, you may request
        an export of your data and/or its deletion, and we will comply within a reasonable period.
      </p>

      <h2>Your rights</h2>
      <p>
        Subject to applicable Indian law, including the Digital Personal Data Protection Act,
        2023, you may request access to, correction of, or deletion of your personal data, and you
        may withdraw consent to processing. To exercise any of these rights, email{' '}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>

      <h2>Data security and retention</h2>
      <p>
        We use reputable infrastructure providers and restrict access to personal data to what is
        needed to run the service. We retain form submissions and service data only as long as
        needed for the purposes above, or as required by law.
      </p>

      <h2>Governing law</h2>
      <p>
        This policy is governed by the laws of India. Any disputes are subject to the exclusive
        jurisdiction of the courts at [PLACEHOLDER: city], India.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy or your data: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
    </LegalLayout>
  )
}
