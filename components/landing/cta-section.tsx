"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CtaSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })
  const router = useRouter();
  return (
    <section ref={sectionRef} className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,50,255,0.15),transparent_70%)]"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="container mx-auto px-4 relative z-10"
      >
        <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm"></div>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-2xl blur-lg opacity-50"></div>

          <div className="relative p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Ready to Elevate Your Aptos Experience?
            </h2>
            <p className="text-zinc-300 mb-8 max-w-2xl mx-auto text-lg">
              Join thousands of users who are already leveraging AptosOne to simplify their blockchain interactions and
              maximize returns.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg shadow-purple-900/30 group"
                onClick={() => router.push("/app")}
              >
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

