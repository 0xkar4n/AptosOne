"use client"

import React, { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Wallet, Brain, Database, MessageCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { IconBrandDiscord } from "@tabler/icons-react"

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, index }) => {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl border border-purple-900/30 bg-gradient-to-b from-black/80 to-purple-950/20 backdrop-blur-sm hover:border-purple-700/50 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 to-pink-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

      <div className="p-8 relative z-10">
        <div className="mb-5 inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-950/80 to-black/80 p-3 shadow-inner shadow-purple-900/10 border border-purple-900/30">
          {icon}
        </div>

        <h3 className="mb-3 text-xl font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-500 transition-all duration-300">
          {title}
        </h3>

        <p className="text-zinc-400 mb-5">{description}</p>

        <Button
          variant="ghost"
          className="p-0 h-auto text-purple-400 hover:text-purple-300 hover:bg-transparent group/btn"
        >
         
          
        </Button>
      </div>
    </motion.div>
  )
}

export default function FeaturesSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  const features = [
    {
      icon: <Wallet className="h-6 w-6 text-purple-400" />,
      title: "Staking Capabilities",
      description:
        "Easily stake your Aptos tokens in Thala, Amnis, and Echo directly on our platform.",
    },
    {
      icon: <Brain className="h-6 w-6 text-pink-400" />,
      title: "AI-Powered Strategy",
      description:
        "Leverage advanced AI algorithms to analyze market trends and optimize your investment strategy. Get personalized recommendations based on your risk profile.",
    },
    {
      icon: <Database className="h-6 w-6 text-purple-400" />,
      title: "Curated Top Pools",
      description:
        "Access a carefully selected collection of the highest-performing liquidity pools on the Joule Finance. Save time with pre-vetted opportunities.",
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-pink-400" />,
      title: "AI Chatbot Support",
      description:
        "Explore everything our platform has to offer using our exclusive tools and intuitive chatbot. Get instant answers to your questions with our AI-powered assistant, confidently navigate the Aptos ecosystem.",
    },{
      icon : <IconBrandDiscord />,
      title: "Discord Bot",
      description:
      "Engage with our integrated Discord bot effortlessly. Execute operations with ease. Stay connected and manage transactions seamlessly within your community"
    }
  ]

  return (
    <section id="features" ref={sectionRef} className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,50,255,0.1),transparent_70%)]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Key Features
          </h2>
          <p className="max-w-2xl mx-auto text-zinc-400 text-lg">
            AptosOne provides a comprehensive suite of tools to help you navigate and leverage the Aptos blockchain
            ecosystem.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          {/* <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg shadow-purple-900/20">
            Explore All Features
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button> */}
        </motion.div>
      </div>
    </section>
  )
}

