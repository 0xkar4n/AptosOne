"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface PositionsSkeletonProps {
  count?: number
}

export function PositionsSkeleton({ count = 3 }: PositionsSkeletonProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div key={index} variants={itemVariants}>
          <Card className="overflow-hidden border border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <Skeleton className="h-7 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex flex-col items-end">
                  <Skeleton className="h-6 w-24 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="pb-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="flex justify-between pt-0">
              <Skeleton className="h-8 w-28" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-32" />
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}

