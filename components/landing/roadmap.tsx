"use client"

import { useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { Check, Clock, CalendarDays } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type RoadmapItemStatus = "completed" | "in-progress" | "planned"

interface RoadmapItem {
  title: string
  status: RoadmapItemStatus
}

interface RoadmapQuarter {
  title: string
  items: RoadmapItem[]
}

const roadmapData: RoadmapQuarter[] = [
  {
    title: "Q1",
    items: [
      { title: "Landing Page and Web Application", status: "completed" },
      { title: "AptosOne Wallet", status: "completed" },
      { title: "Stake, Unstake directly in Thala, Amnis, Echo", status: "completed" },
      { title: "Joule Finance top lending and borrowing pools", status: "completed" },
      { title: "AI-Strategy Builder", status: "completed" },
      { title: "AI-Chat bot", status: "completed" },
      { title: "Discord bot", status: "completed" },
    ],
  },
  {
    title: "Q2",
    items: [
      { title: "Dashboard for AptosOne Wallet", status: "planned" },
      { title: "Merkle Trade Integration", status: "planned" },
      { title: "AI-Price Prediction", status: "planned" },
      { title: "Managing of Pools on Joule Finance", status: "planned" },
      { title: "MultiSign AptosOne Wallet", status: "planned" },
      { title: "Swap Aggregator", status: "planned" },
    ],
  },
]

const StatusBadge = ({ status }: { status: RoadmapItemStatus }) => {
  const statusConfig = {
    completed: {
      color: "bg-green-500/20 text-green-400 border-green-500/30",
      icon: <Check className="h-3 w-3 mr-1" />,
      text: "Completed",
    },
    "in-progress": {
      color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      icon: <Clock className="h-3 w-3 mr-1" />,
      text: "In Progress",
    },
    planned: {
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      icon: <CalendarDays className="h-3 w-3 mr-1" />,
      text: "Planned",
    },
  }

  const config = statusConfig[status]

  return (
    <Badge variant="outline" className={cn("text-xs font-normal py-0 h-5", config.color)}>
      {config.icon}
      {config.text}
    </Badge>
  )
}

const RoadmapQuarterCard = ({ quarter, index }: { quarter: RoadmapQuarter; index: number }) => {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, amount: 0.2 })

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative"
    >
      <div className="relative z-10 rounded-2xl border border-purple-900/30 bg-gradient-to-b from-black/80 to-purple-950/20 backdrop-blur-sm p-6 md:p-8 h-full">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-lg opacity-50 -z-10"></div>

        <div className="flex items-center mb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold text-xl">
            {quarter.title}
          </div>
          <h3 className="ml-4 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            {quarter.title} Milestones
          </h3>
        </div>
        

        <ul className="space-y-4">
          {quarter.items.map((item, itemIndex) => (
            <motion.li
              key={itemIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3, delay: index * 0.1 + itemIndex * 0.05 }}
              className="flex items-start"
            >
              <div className="min-w-[24px] h-6 flex items-center justify-center mr-3">
                {item.status === "completed" ? (
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="h-3 w-3 text-green-400" />
                  </div>
                ) : item.status === "in-progress" ? (
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <p
                  className={cn(
                    "text-base font-medium",
                    item.status === "completed" ? "text-zinc-400 line-through decoration-green-500/50" : "text-white",
                  )}
                >
                  {item.title}
                </p>
                <div className="mt-1">
                  <StatusBadge status={item.status} />
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

// Timeline connector component for desktop view
const TimelineConnector = ({ index }: { index: number }) => {
  const connectorRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: connectorRef,
    offset: ["start end", "end start"],
  })

  const scaleProgress = useTransform(scrollYProgress, [0, 0.5], [0, 1])

  return (
    <div ref={connectorRef} className="hidden md:block absolute top-0 bottom-0 left-1/2 w-1 -translate-x-1/2">
      <motion.div
        style={{ scaleY: scaleProgress, originY: 0 }}
        className={`w-full h-full ${
          index % 2 === 0
            ? "bg-gradient-to-b from-purple-600 to-pink-600"
            : "bg-gradient-to-b from-pink-600 to-purple-600"
        }`}
      />
    </div>
  )
}

export default function RoadmapSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  return (
    <section id="roadmap" ref={sectionRef} className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,50,255,0.1),transparent_70%)]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Project Roadmap
          </h2>
          <p className="max-w-2xl mx-auto text-zinc-400 text-lg">
            Our journey to build the ultimate gateway to the Aptos blockchain ecosystem. Track our progress and see
            what's coming next.
          </p>
        </motion.div>



        {/* Mobile Timeline (Vertical) */}
        <div className="md:hidden space-y-8">
          {roadmapData.map((quarter, index) => (
            <div key={index} className="relative">
              {index < roadmapData.length - 1 && (
                <div className="absolute top-full left-6 w-0.5 h-8 bg-gradient-to-b from-purple-600 to-pink-600"></div>
              )}
              <RoadmapQuarterCard quarter={quarter} index={index} />
            </div>
          ))}
        </div>

        {/* Desktop Timeline (Horizontal Cards with Vertical Timeline) */}
        <div className="hidden md:block relative">
          <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-purple-900/30 -translate-x-1/2"></div>

          <div className="space-y-24">
            {roadmapData.map((quarter, index) => (
              <div key={index} className="relative">
                <TimelineConnector index={index} />
                <div className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
                  <div className={`w-5/12 ${index % 2 === 1 ? "order-1" : "order-none"}`}>
                    <RoadmapQuarterCard quarter={quarter} index={index} />
                  </div>

                  <div className="w-2/12 relative flex justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                      className="absolute top-8 w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center z-20"
                    >
                      <span className="text-white font-bold">{index + 1}</span>
                    </motion.div>
                  </div>

                  <div className="w-5/12"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-zinc-300 text-lg font-medium">Stay tuned for more exciting features and updates!</p>
          <p className="text-zinc-400 mt-2">
            Our roadmap is constantly evolving as we continue to innovate and respond to community feedback.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
