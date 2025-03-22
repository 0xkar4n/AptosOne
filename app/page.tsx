import Navbar from "@/components/landing/navbar"
import HeroSection from "@/components/landing/hero-section"
import FlowSection from "@/components/landing/flow-section"
import FeaturesSection from "@/components/landing/feature-section"
import CtaSection from "@/components/landing/cta-section"
import Footer from "@/components/landing/footer"
import RoadmapSection from "@/components/landing/roadmap"
import DiscordBotSection from "@/components/landing/discord-bot-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-purple-950/30 text-white">
      <Navbar />
      <main className="px-12">
        <HeroSection />
        <FlowSection />
        <FeaturesSection />
        <DiscordBotSection />
        <RoadmapSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}

