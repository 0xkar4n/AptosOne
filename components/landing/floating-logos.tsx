"use client"

import type React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface FloatingLogoProps {
  children: React.ReactNode
  position:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "mid-left"
    | "mid-right"
    | "center-top"
    | "center-bottom"
  offsetX?: number
  offsetY?: number
  size: number
  duration?: number
  delay?: number
  amplitude?: number
  direction?: "normal" | "reverse"
}

const FloatingLogo = ({
  children,
  position,
  offsetX = 0,
  offsetY = 0,
  size,
  duration = 5,
  delay = 0,
  amplitude = 15,
  direction = "normal",
}: FloatingLogoProps) => {
  const [positionClasses, setPositionClasses] = useState("")
  const [transform, setTransform] = useState({ x: 0, y: 0 })

  // Set position based on the position prop
  useEffect(() => {
    let baseClasses = ""
    const x = offsetX
    const y = offsetY

    switch (position) {
      case "top-left":
        baseClasses = "left-[10%] top-[20%]"
        break
      case "top-right":
        baseClasses = "right-[10%] top-[20%]"
        break
      case "bottom-left":
        baseClasses = "left-[15%] bottom-[25%]"
        break
      case "bottom-right":
        baseClasses = "right-[15%] bottom-[25%]"
        break
      case "mid-left":
        baseClasses = "left-[5%] top-[50%]"
        break
      case "mid-right":
        baseClasses = "right-[5%] top-[50%]"
        break
      case "center-top":
        baseClasses = "left-[50%] top-[15%] -translate-x-1/2"
        break
      case "center-bottom":
        baseClasses = "left-[50%] bottom-[15%] -translate-x-1/2"
        break
    }

    setPositionClasses(baseClasses)
    setTransform({ x, y })
  }, [position, offsetX, offsetY])

  return (
    <motion.div
      className={`absolute ${positionClasses}`}
      style={{
        width: size,
        height: size,
      }}
      initial={{
        x: transform.x,
        y: transform.y,
        opacity: 0,
        scale: 0.8,
      }}
      animate={{
        x: transform.x,
        y: transform.y,
        opacity: [0, 0.9, 0.7],
        scale: [0.8, 1.1, 1],
      }}
      transition={{
        duration: 1.5,
        delay: delay,
      }}
    >
      <motion.div
        animate={{
          y: [0, -amplitude, 0, -amplitude * 0.7, 0],
          rotate: [0, 2, 0, -2, 0],
          scale: [1, 1.05, 1, 1.03, 1],
        }}
        transition={{
          duration: duration,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
          direction: direction,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

export default function FloatingLogos() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Discord Logo */}
      {/* <FloatingLogo position="top-left" offsetX={20} offsetY={-30} size={50} delay={0.2} amplitude={12}>
        <div className="bg-[#5865F2]/10 p-3 rounded-full backdrop-blur-sm border border-[#5865F2]/20">
          <DiscordLogo className="w-full h-full text-[#5865F2]" />
        </div>
      </FloatingLogo> */}

      {/* MetaMove Logo */}
      <FloatingLogo position="top-right" offsetX={-20} offsetY={20} size={60} duration={6} delay={0.5} amplitude={18}>
        <div className="bg-purple-900/10 p-2 rounded-full backdrop-blur-sm border border-purple-500/20 overflow-hidden">
          <Image
            src="https://pbs.twimg.com/profile_images/1877022471980826624/MWAZcFo6_400x400.jpg"
            alt="MetaMove Logo"
            width={60}
            height={60}
            className="rounded-full w-full h-full object-cover"
          />
        </div>
      </FloatingLogo>

      {/* Joule Logo */}
      <FloatingLogo
        position="mid-left"
        offsetX={15}
        offsetY={-10}
        size={55}
        duration={6.5}
        delay={1.3}
        direction="reverse"
      >
        <div className="bg-blue-900/10 p-2 rounded-full backdrop-blur-sm border border-blue-500/20 overflow-hidden">
          <Image
            src="https://pbs.twimg.com/profile_images/1879437253614907393/z1bwlrBF_400x400.jpg"
            alt="Joule Logo"
            width={55}
            height={55}
            className="rounded-full w-full h-full object-cover"
          />
        </div>
      </FloatingLogo>

      {/* Google Gemini Logo */}
      <FloatingLogo position="mid-right" offsetX={-15} offsetY={10} size={58} duration={7.2} delay={0.9} amplitude={20}>
        <div className="bg-teal-900/10 p-2 rounded-full backdrop-blur-sm border border-teal-500/20 overflow-hidden">
          <Image
            src="https://pbs.twimg.com/profile_images/1815873998682742785/xrPuqBjr_400x400.jpg"
            alt="Google Gemini Logo"
            width={58}
            height={58}
            className="rounded-full w-full h-full object-cover"
          />
        </div>
      </FloatingLogo>

      {/* Aptos Logo */}
      {/* <FloatingLogo position="bottom-left" offsetX={30} offsetY={-20} size={55} duration={7} delay={0.8} amplitude={16}>
        <div className="bg-blue-900/10 p-2 rounded-full backdrop-blur-sm border border-blue-500/20 overflow-hidden">
          <Image
            src="https://pbs.twimg.com/profile_images/1556801889282686976/tuHF27-8_400x400.jpg"
            alt="Aptos Logo"
            width={55}
            height={55}
            className="rounded-full w-full h-full object-cover"
          />
        </div>
      </FloatingLogo> */}

      {/* Additional Logo - Center Top */}
      {/* <FloatingLogo position="center-top" offsetY={20} size={50} duration={5.5} delay={1.1} amplitude={14}>
      <div className="bg-green-900/10 p-3 rounded-full backdrop-blur-sm border border-green-500/20">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <linearGradient id="centerBottomGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
            <g fill="url(#centerBottomGradient)">
              <path d="M70,30 H30 C25,30 20,35 20,40 V70 C20,75 25,80 30,80 H70 C75,80 80,75 80,70 V40 C80,35 75,30 70,30 Z M70,60 H60 C55,60 50,55 50,50 C50,45 55,40 60,40 H70 V60 Z" />
              <circle cx="60" cy="50" r="5" />
            </g>
          </svg>
        </div>
      </FloatingLogo> */}


        <FloatingLogo position="top-left" offsetX={80} offsetY={10} size={65} duration={5.5} delay={1.1} amplitude={14}>
        <div className="bg-blue-900/10 p-2 rounded-full backdrop-blur-sm border border-blue-500/20 overflow-hidden">
          <Image
            src="https://pbs.twimg.com/profile_images/1556801889282686976/tuHF27-8_400x400.jpg"
            alt="Aptos Logo"
            width={55}
            height={55}
            className="rounded-full w-full h-full object-cover"
          />
        </div>
        </FloatingLogo>

        <FloatingLogo position="center-top" offsetX={50} offsetY={10} size={50} duration={5.5} delay={1.1} amplitude={14}>
        <div className="bg-blue-900/10 p-2 rounded-full backdrop-blur-sm border border-blue-500/20 overflow-hidden">
          <Image
            src="https://pbs.twimg.com/profile_images/1842105305813172224/irrbOSBA_400x400.png"
            alt="Aptos Logo"
            width={55}
            height={55}
            className="rounded-full w-full h-full object-cover"
          />
        </div>
        </FloatingLogo>
     
     
    </div>
  )
}

