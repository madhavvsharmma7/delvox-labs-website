import Nav from '../components/Nav.jsx'
import Hero from '../components/Hero.jsx'
import TrustStrip from '../components/TrustStrip.jsx'
import Projects from '../components/Projects.jsx'
import MissedCallCalculator from '../components/MissedCallCalculator.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import Comparison from '../components/Comparison.jsx'
import BuiltOn from '../components/BuiltOn.jsx'
import Pricing from '../components/Pricing.jsx'
import Guarantee from '../components/Guarantee.jsx'
import FAQ from '../components/FAQ.jsx'
import TrialForm from '../components/TrialForm.jsx'
import Footer from '../components/Footer.jsx'
import MobileCTA from '../components/MobileCTA.jsx'

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />
        <TrustStrip />
        <Projects />
        <MissedCallCalculator />
        <HowItWorks />
        <Comparison />
        {/* SocialProof intentionally unwired until real testimonials exist — see SocialProof.jsx */}
        <BuiltOn />
        <Pricing />
        <Guarantee />
        <FAQ />
        <TrialForm />
      </main>
      <Footer />
      <MobileCTA />
    </>
  )
}
