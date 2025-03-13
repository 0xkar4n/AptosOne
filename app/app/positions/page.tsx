"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Trash2, X } from "lucide-react"
import { ShineBorder } from "@/components/ui/shine-border"
import { Button } from "@/components/ui/button"

interface Position {
  id: string
  asset: string
  amount: number
  value: number
}

const UserPositions: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([
    { id: "1", asset: "BTC", amount: 0.5, value: 15000 },
    { id: "2", asset: "ETH", amount: 5, value: 10000 },
    { id: "3", asset: "USDT", amount: 10000, value: 10000 },
    { id: "4", asset: "ADA", amount: 5000, value: 2500 },
  ])

  const deletePosition = (id: string) => {
    setPositions(positions.filter((position) => position.id !== id))
  }

  const deleteAllPositions = () => {
    setPositions([])
  }

  return (
    <div className="bg-black min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-100 mb-8">Your Positions</h1>

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-400">
            Total Positions: <span className="font-semibold text-gray-200">{positions.length}</span>
          </p>
          <ShineBorder  shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                  className="rounded-lg"
                  borderWidth={2} />
            <Button
              onClick={deleteAllPositions}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center space-x-2"
            >
              <Trash2 size={16} />
              <span>Delete All</span>
            </Button>
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-4">
            {positions.map((position) => (
              <PositionCard key={position.id} position={position} onDelete={() => deletePosition(position.id)} />
            ))}
          </div>
        </div>

        {positions.length === 0 && (
          <div className="text-center text-gray-400 mt-12">
            <p className="text-xl">No positions available</p>
          </div>
        )}
      </div>
    </div>
  )
}

interface PositionCardProps {
  position: Position
  onDelete: () => void
}

const PositionCard: React.FC<PositionCardProps> = ({ position, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-64 flex-shrink-0"
    >
      <ShineBorder  shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                  className="rounded-lg"
                  borderWidth={2} />
        <div className="bg-gray-800 rounded-lg p-4 relative">
          <button
            onClick={onDelete}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={18} />
          </button>
          <h3 className="text-xl font-semibold text-gray-100 mb-2">{position.asset}</h3>
          <div className="text-gray-300 mb-1">
            Amount: <span className="font-medium">{position.amount}</span>
          </div>
          <div className="text-gray-300">
            Value: <span className="font-medium">${position.value.toLocaleString()}</span>
          </div>
        </div>
    </motion.div>
  )
}

export default UserPositions

