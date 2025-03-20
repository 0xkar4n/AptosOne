import Navbar from "@/components/landing/navbar"
import HeroSection from "@/components/landing/hero-section"
import FlowSection from "@/components/landing/flow-section"
import FeaturesSection from "@/components/landing/feature-section"
import CtaSection from "@/components/landing/cta-section"
import Footer from "@/components/landing/footer"
import RoadmapSection from "@/components/landing/roadmap"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-purple-950/30 text-white">
      <Navbar />
      <main>
        <HeroSection />
        <FlowSection />
        <FeaturesSection />
        <RoadmapSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}

