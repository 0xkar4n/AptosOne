"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface NFTCollection {
  collectionId: string
  collectionName: string
  collectionImage: string
  isVerified: boolean
}

export default function NftSection() {
  const [collections, setCollections] = useState<NFTCollection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredNft, setHoveredNft] = useState<string | null>(null)

  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.8, 1, 1, 0.8])

  const row1X = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])
  const row2X = useTransform(scrollYProgress, [0, 1], ["-50%", "0%"])
  const row3X = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])

  // Fetch NFT data
  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/nft")

        if (!response.ok) {
          throw new Error("Failed to fetch NFT data")
        }

        const result = await response.json()

        if (!result.data) {
          throw new Error("Invalid API response format")
        }

        const transformedCollections = result.data
          .map((item: any) => ({
            collectionId: item.collectionId || "",
            collectionName: item.collectionName || "",
            collectionImage: item.collectionImage || "/placeholder.svg?height=400&width=400",
            isVerified: item.isVerified || false,
          }))
          .slice(0, 24) 

        setCollections(transformedCollections)
      } catch (err) {
        console.error("Error fetching NFT data:", err)
        setError("Failed to load NFT collections. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchNFTs()
  }, [])

  const placeholderCollections: NFTCollection[] = Array(24)
    .fill(null)
    .map((_, i) => ({
      collectionId: `placeholder-${i}`,
      collectionName: `NFT Collection ${i + 1}`,
      collectionImage: `/placeholder.svg?height=400&width=400`,
      isVerified: Math.random() > 0.5,
    }))

  const displayCollections = collections.length > 0 ? collections : placeholderCollections

  const row1Collections = displayCollections.slice(0, 8)
  const row2Collections = displayCollections.slice(8, 16)
  const row3Collections = displayCollections.slice(16, 24)

  const duplicatedRow1 = [...row1Collections, ...row1Collections]
  const duplicatedRow2 = [...row2Collections, ...row2Collections]
  const duplicatedRow3 = [...row3Collections, ...row3Collections]

  return (
    <section id="nft-collections" ref={sectionRef} className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.1),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 pointer-events-none"></div>

      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/20 to-transparent"
          animate={{
            x: ["-100%", "100%"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        ></motion.div>
        <motion.div
          className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"
          animate={{
            x: ["100%", "-100%"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        ></motion.div>
      </div>

      <motion.div style={{ opacity, scale }} className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Explore NFT Collections
          </h2>
          <p className="max-w-2xl mx-auto text-zinc-400 text-lg">
            Discover unique digital artwork on the Aptos blockchain
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-pink-500 animate-spin mb-4" />
            <p className="text-zinc-400">Loading NFT collections...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-pink-500/50 text-pink-400 hover:bg-pink-950/30"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-16 md:space-y-24 overflow-hidden">
            {/* Row 1: Left to Right */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>

              <motion.div className="flex space-x-4 md:space-x-6" style={{ x: row1X }}>
                {duplicatedRow1.map((collection, index) => (
                  <NFTCard
                    key={`row1-${collection.collectionId}-${index}`}
                    collection={collection}
                    index={index}
                    isHovered={hoveredNft === `row1-${collection.collectionId}-${index}`}
                    onHover={() => setHoveredNft(`row1-${collection.collectionId}-${index}`)}
                    onLeave={() => setHoveredNft(null)}
                  />
                ))}
              </motion.div>
            </div>

            {/* Row 2: Right to Left */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>

              <motion.div className="flex space-x-4 md:space-x-6" style={{ x: row2X }}>
                {duplicatedRow2.map((collection, index) => (
                  <NFTCard
                    key={`row2-${collection.collectionId}-${index}`}
                    collection={collection}
                    index={index}
                    isHovered={hoveredNft === `row2-${collection.collectionId}-${index}`}
                    onHover={() => setHoveredNft(`row2-${collection.collectionId}-${index}`)}
                    onLeave={() => setHoveredNft(null)}
                  />
                ))}
              </motion.div>
            </div>

            {/* Row 3: Left to Right */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>

              <motion.div className="flex space-x-4 md:space-x-6" style={{ x: row3X }}>
                {duplicatedRow3.map((collection, index) => (
                  <NFTCard
                    key={`row3-${collection.collectionId}-${index}`}
                    collection={collection}
                    index={index}
                    isHovered={hoveredNft === `row3-${collection.collectionId}-${index}`}
                    onHover={() => setHoveredNft(`row3-${collection.collectionId}-${index}`)}
                    onLeave={() => setHoveredNft(null)}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        )}
      </motion.div>
    </section>
  )
}

interface NFTCardProps {
  collection: NFTCollection
  index: number
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
}

function NFTCard({ collection, index, isHovered, onHover, onLeave }: NFTCardProps) {
  return (
    <motion.div
      className="relative flex-shrink-0 w-64 md:w-72 aspect-square rounded-xl overflow-hidden group"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
    >
      {/* Image */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Image
          src={collection.collectionImage || "/placeholder.svg"}
          alt={collection.collectionName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 256px, 288px"
          priority={index < 8}
        />
      </motion.div>

      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-white font-medium text-lg truncate">{collection.collectionName}</h3>
        {collection.isVerified && (
          <div className="flex items-center mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></div>
            <span className="text-blue-400 text-xs">Verified</span>
          </div>
        )}
      </motion.div>

      {/* Border animation on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-transparent pointer-events-none"
        style={{
          background: `linear-gradient(90deg, #9333EA, #EC4899) border-box`,
          WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Glow effect on hover */}
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-xl blur-lg -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}
