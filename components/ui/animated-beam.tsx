"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

interface AnimatedBeamProps {
  containerRef: React.RefObject<HTMLElement>;
  fromRef: React.RefObject<HTMLElement>;
  toRef: React.RefObject<HTMLElement>;
  className?: string;
  duration?: number;
  delay?: number;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
  isStraight?: boolean;
}

export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  className = "",
  duration = 5,
  delay = 0,
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = "#ffaa40",
  gradientStopColor = "#9c40ff",
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
  isStraight = false,
}: AnimatedBeamProps) {
  const controls = useAnimation();
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const updatePath = () => {
      if (!containerRef.current || !fromRef.current || !toRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const fromRect = fromRef.current.getBoundingClientRect();
      const toRect = toRef.current.getBoundingClientRect();

      // Calculate center points of the circles
      const startX = fromRect.left - containerRect.left + fromRect.width / 2 + startXOffset;
      const startY = fromRect.top - containerRect.top + fromRect.height / 2 + startYOffset;
      const endX = toRect.left - containerRect.left + toRect.width / 2 + endXOffset;
      const endY = toRect.top - containerRect.top + toRect.height / 2 + endYOffset;

      if (isStraight) {
        // Create a straight path for the middle circle
        const path = `M ${startX} ${startY} L ${endX} ${endY}`;
        if (pathRef.current) {
          pathRef.current.setAttribute("d", path);
        }
      } else {
        // Calculate the distance between points
        const dx = endX - startX;
        const dy = endY - startY;

        // Calculate control points for a smooth curve
        const controlX1 = startX + dx * 0.35;
        const controlX2 = startX + dx * 0.65;
        const controlY1 = startY + dy * 0.25;
        const controlY2 = startY + dy * 0.75;

        // Create a curved path that connects the circles
        const path = `M ${startX} ${startY} 
                     C ${controlX1} ${controlY1},
                       ${controlX2} ${controlY2},
                       ${endX} ${endY}`;
        
        if (pathRef.current) {
          pathRef.current.setAttribute("d", path);
        }
      }
    };

    updatePath();
    window.addEventListener("resize", updatePath);
    window.addEventListener("scroll", updatePath);

    return () => {
      window.removeEventListener("resize", updatePath);
      window.removeEventListener("scroll", updatePath);
    };
  }, [containerRef, fromRef, toRef, startXOffset, startYOffset, endXOffset, endYOffset, isStraight]);

  useEffect(() => {
    controls.start({
      pathLength: [0, 1],
      transition: {
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      },
    });
  }, [controls, duration, delay]);

  return (
    <motion.div className={`absolute inset-0 pointer-events-none ${className}`}>
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id={`beam-gradient-${delay}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gradientStartColor} />
            <stop offset="50%" stopColor={gradientStopColor} />
            <stop offset="100%" stopColor={gradientStartColor} />
          </linearGradient>
          <filter id={`glow-${delay}`}>
            <feGaussianBlur stdDeviation={isStraight ? "4" : "3"} result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.path
          ref={pathRef}
          stroke={`url(#beam-gradient-${delay})`}
          strokeWidth={pathWidth}
          fill="none"
          strokeLinecap="round"
          strokeOpacity={pathOpacity}
          filter={`url(#glow-${delay})`}
          animate={controls}
          className="opacity-100"
          style={{ mixBlendMode: "screen" }}
        />
      </svg>
    </motion.div>
  );
} 