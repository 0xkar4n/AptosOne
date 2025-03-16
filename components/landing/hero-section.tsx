"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, ChevronRight } from "lucide-react"
import { EnhancedSpotlight } from "../ui/enhanced-spotlight"
import Link from "next/link"

import { useRouter } from "next/navigation"
import FloatingLogos from "./floating-logos"


export default function HeroSection() {
  const router = useRouter();
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center pt-20">
      <EnhancedSpotlight />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,50,255,0.15),transparent_50%)]"></div>

      <FloatingLogos />

      <div className="container px-4 md:px-6 relative z-10 max-w-5xl mx-auto">
        <div className="text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge className="mb-6 py-1.5 px-4 bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border-purple-500/20 backdrop-blur-sm">
              <span className="mr-1 text-purple-400">✦</span> Built with Meta-Move-Agent Kit
            </Badge>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600">
              The Gateway to Aptos
            </span>
            <br />
            <span className="text-white">Blockchain Ecosystem</span>
          </motion.h1>

          <motion.p
            className="max-w-[800px] mx-auto text-zinc-400 text-xl mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Access powerful protocols built on the Aptos blockchain through an intuitive interface. Leverage AI-powered
            tools to maximize your blockchain experience.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >

            
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg shadow-purple-900/30 group"
              onClick={() => router.push("/app/stake")}
            >
              Launch App
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-purple-700/50 text-white hover:bg-purple-950/50 backdrop-blur-sm"
              onClick={() => { window.open("https://github.com/0xkar4n/AptosOne", "_blank") }}
            >
              <a href="https://github.com/0xkar4n/AptosOne" target="_blank" rel="noopener noreferrer" />
              {/* <Link  target="_blank" ></Link> */}
              Explore Github
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        
      </div>
    </div>
  )
}

