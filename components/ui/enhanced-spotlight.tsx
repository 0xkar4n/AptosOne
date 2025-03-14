"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"

export function EnhancedSpotlight() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const { left, top } = containerRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - left,
        y: e.clientY - top,
      })
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    window.addEventListener("mousemove", handleMouseMove)
    containerRef.current?.addEventListener("mouseenter", handleMouseEnter)
    containerRef.current?.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      containerRef.current?.removeEventListener("mouseenter", handleMouseEnter)
      containerRef.current?.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute pointer-events-none"
        animate={{
          WebkitMaskImage: isHovering
            ? `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, white 30%, transparent 70%)`
            : `radial-gradient(600px circle at ${dimensions.width / 2}px ${dimensions.height / 2}px, white 30%, transparent 70%)`,
          background: isHovering
            ? `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15) 0%, transparent 70%)`
            : `radial-gradient(600px circle at ${dimensions.width / 2}px ${dimensions.height / 2}px, rgba(139, 92, 246, 0.15) 0%, transparent 70%)`,
        }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,50,255,0.15),transparent_50%)]"></div>

      <div className="absolute top-[calc(50%-250px)] left-[calc(50%-250px)] w-[500px] h-[500px] bg-purple-600 rounded-full opacity-[0.03] blur-[100px]"></div>
    </div>
  )
}

