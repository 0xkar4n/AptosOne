"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  textClassName?: string
  size?: "sm" | "md" | "lg" | "xl"
  animated?: boolean
  withText?: boolean
  href?: string
}

export default function Logo({
  className,
  textClassName,
  size = "md",
  animated = true,
  withText = true,
  href = "/",
}: LogoProps) {
  const sizeClasses = {
    sm: "w-7 h-7",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  }

  const logoVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.3, ease: "easeInOut" } },
  }

  const glowVariants = {
    initial: { opacity: 0.3 },
    hover: {
      opacity: 0.7,
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      },
    },
  }

  return (
    <Link href={href} className={cn("flex items-center gap-2", className)}>
      <motion.div
        className={cn("relative", sizeClasses[size])}
        initial="initial"
        whileHover={animated ? "hover" : "initial"}
        variants={logoVariants}
      >
        {/* Glow effect */}
        {animated && (
          <motion.div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl"  />
        )}

        {/* Main logo shape */}
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9333EA" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>

            <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer hexagon */}
          <path
            d="M40 5L71.6506 23.5V60.5L40 79L8.34936 60.5V23.5L40 5Z"
            fill="url(#logoGradient)"
            filter="url(#glow)"
          />

          {/* Inner hexagon */}
          <path d="M40 15L62.3013 28.5V55.5L40 69L17.6987 55.5V28.5L40 15Z" fill="#0F0F0F" />

          {/* A letter with gradient */}
          <path
            d="M31.5 52H48.5L50 56H29.5L31.5 52ZM40 24L26 52H33L35.5 46H44.5L47 52H54L40 24ZM37.5 41L40 34L42.5 41H37.5Z"
            fill="url(#innerGradient)"
          />

          {/* Decorative elements */}
          <circle cx="40" cy="15" r="1.5" fill="#EC4899" />
          <circle cx="62.3013" cy="28.5" r="1.5" fill="#EC4899" />
          <circle cx="62.3013" cy="55.5" r="1.5" fill="#EC4899" />
          <circle cx="40" cy="69" r="1.5" fill="#EC4899" />
          <circle cx="17.6987" cy="55.5" r="1.5" fill="#EC4899" />
          <circle cx="17.6987" cy="28.5" r="1.5" fill="#EC4899" />
        </svg>
      </motion.div>

      {withText && (
        <motion.span
          initial={{ opacity: 0.9 }}
          whileHover={{ opacity: 1 }}
          className={cn(
            "font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500",
            textSizeClasses[size],
            textClassName,
          )}
        >
          AptosOne
        </motion.span>
      )}
    </Link>
  )
}