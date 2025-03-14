"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ShineBorder } from "@/components/ui/shine-border"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Info, ArrowRight, Sparkles, TrendingUp, ChevronDown, ChevronUp } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import axios from "axios"

export interface APYBreakdown {
  depositToken: string
  depositApy: number
  borrowToken: string
  borrowCost: number
}

export interface StrategyStep {
  action: string
  apy: string
}

interface StrategyCardProps {
  title: string
  description?: string
  apyBreakdowns?: APYBreakdown[]
  netApy?: number
  expected_effective_yield?: string
  steps?: StrategyStep[]
  icon: string
  investToken?: string
}

const StrategyCard: React.FC<StrategyCardProps> = ({
  title,
  description,
  apyBreakdowns,
  netApy,
  expected_effective_yield,
  steps,
  icon,
  investToken = "USDT",
}) => {
  const [expanded, setExpanded] = useState(false)
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleExecuteStrategy = async () => {
    // Validate input
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    setLoading(true)
    setError(null)

    // Show processing toast
    const toastId = toast.loading("Processing strategy...", {
      description: "Please wait while we process your request",
    })

    try {
      // Prepare data for API
      const data = {
        amount: Number(amount),
        steps: steps || [],
        title,
        investToken,
        netApy: netApy || 0,
        expected_effective_yield,
      }

      // Send request to API
      const response = await axios.post("/api/ai-strategy", data)

      // Dismiss loading toast and show success
      toast.dismiss(toastId)
      toast.success("Strategy executed successfully", {
        description: "Your strategy has been processed",
      })

      // Handle successful response
      console.log("Strategy response:", response.data)

      // Here you could update UI with response data or redirect
      // For example: router.push(`/strategy/${response.data.id}`);
    } catch (err) {
      // Dismiss loading toast
      toast.dismiss(toastId)

      // Handle error
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "An unexpected error occurred"

      setError(errorMessage)
      toast.error("Failed to execute strategy", {
        description: errorMessage,
      })

      console.error("Strategy execution error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      ref={cardRef}
      className="relative h-full rounded-xl overflow-hidden transform transition-all duration-500 ease-out translate-y-0 hover:-translate-y-2"
    >
      <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                  className="rounded-lg"
                  borderWidth={2}  />
        <div className="relative flex flex-col h-full p-6 bg-black backdrop-blur-sm shadow-xl rounded-xl">
          {/* Card Header */}
          <div className="flex items-center space-x-3 mb-5">
            <div className="relative w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 p-2">
              <img src={icon || "/placeholder.svg"} alt={title} className="w-8 h-8 object-contain rounded-md" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
                <Sparkles size={10} className="text-gray-200" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-100 tracking-tight">{title}</h3>
              {description && <p className="text-sm text-gray-400 line-clamp-1 mt-0.5">{description}</p>}
            </div>
          </div>

          {/* Yield Information */}
          {expected_effective_yield && (
            <div>
            <ShineBorder  shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                  className="rounded-lg"
                  borderWidth={2} />
              <div className="bg-gray-900 rounded-lg p-3.5 mb-5 flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="text-gray-400 mr-2.5" size={18} />
                  <span className="text-gray-300 text-sm font-medium">Effective Yield</span>
                </div>
                <span className="text-gray-200 font-bold text-lg">{expected_effective_yield}</span>
              </div>
            </div>
          )}

          {/* Strategy Steps */}
          {steps && steps.length > 0 && (
            <div>
            <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                  className="rounded-lg"
                  borderWidth={2} />
              <div className="mt-1 bg-gray-900 p-5 rounded-xl mb-5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-semibold text-white flex items-center tracking-tight">
                    Strategy Steps
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="ml-2 text-gray-400 cursor-help hover:text-gray-300 transition-colors">
                            <Info size={14} />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-800 border-gray-700 text-white">
                          <p>Step-by-step actions for this strategy</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-gray-400 hover:text-white hover:bg-gray-700"
                    onClick={() => setExpanded(!expanded)}
                  >
                    {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </Button>
                </div>
                <div
                  className="space-y-2.5 transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: expanded ? `${steps.length * 100}px` : steps.length > 2 ? "120px" : "auto",
                    overflow: "hidden",
                  }}
                >
                  {steps.map((stepItem, index) => (
                    <div
                      key={index}
                      className="bg-gray-700/50 rounded-lg p-3.5 border border-gray-600/30 transition-transform duration-200 ease-in-out hover:translate-x-1"
                    >
                      <div className="flex items-start">
                        <div className="min-w-6 h-6 rounded-full bg-gradient-to-r from-gray-600/80 to-gray-800/80 flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-xs font-medium text-white">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <span className="text-gray-300 text-sm font-medium">{stepItem.action}</span>
                            <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-500/30 ml-2">
                              {stepItem.apy}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {!expanded && steps.length > 2 && (
                  <div className="h-6 bg-gradient-to-b from-transparent to-gray-800/80 mt-2 rounded-b-lg" />
                )}
              </div>
            </div>
          )}

          {/* APY Breakdown (if provided) */}
          {apyBreakdowns && netApy !== undefined && (
            <div>
            <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                  className="rounded-lg"
                  borderWidth={2}  />
              <div className="mt-1 bg-gray-900 p-5 rounded-xl mb-5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-semibold text-white flex items-center tracking-tight">
                    APY Calculation
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="ml-2 text-gray-400 cursor-help hover:text-gray-300 transition-colors">
                            <Info size={14} />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-800 border-gray-700 text-white">
                          <p>Breakdown of deposit and borrow rates</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </h4>
                </div>
                <div className="space-y-2.5">
                  {apyBreakdowns.map((breakdown, index) => (
                    <div
                      key={index}
                      className="bg-gray-700/50 rounded-lg p-3.5 border border-gray-600/30 transition-transform duration-200 ease-in-out hover:translate-x-1"
                    >
                      <div className="flex justify-between text-sm items-center">
                        <span className="text-gray-300 flex items-center font-medium">
                          <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                          {breakdown.depositToken} deposit
                        </span>
                        <span className="text-gray-400 font-medium">+{breakdown.depositApy.toFixed(2)}%</span>
                      </div>
                      {breakdown.borrowToken && (
                        <div className="flex justify-between text-sm items-center mt-2">
                          <span className="text-gray-300 flex items-center font-medium">
                            <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                            {breakdown.borrowToken} borrow
                          </span>
                          <span className="text-gray-400 font-medium">-{breakdown.borrowCost.toFixed(2)}%</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-600/50">
                  <div className="flex justify-between font-medium">
                    <span className="text-white flex items-center">
                      <span className="mr-1.5">Net APY</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info size={12} className="text-gray-500" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-800 border-gray-700 text-white">
                            <p>Total yield after all costs</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </span>
                    <span className={`text-lg font-bold ${netApy >= 0 ? "text-gray-400" : "text-gray-400"}`}>
                      {netApy.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Separator className="my-1 bg-gray-800" />

          {/* Investment Input */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Investment Amount</label>
            <div className="relative">
              <Input
                type="text"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 border border-gray-800 rounded-lg bg-gray-900 text-gray-100 text-lg font-medium focus:ring-2 focus:ring-gray-700 focus:border-gray-700"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-gray-800 to-gray-700 px-3 py-1 rounded text-xs font-medium text-gray-200">
                {investToken}
              </div>
            </div>
          </div>

          {/* Execute Button */}
          <div className="relative overflow-hidden mt-5">
            <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                  className="rounded-lg"
                  borderWidth={2} />
              <Button className="w-full bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-gray-100 font-medium py-6 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 h-auto">
                <span>Execute Strategy</span>
                <ArrowRight size={16} />
              </Button>
          </div>
            <p className="text-xs text-center text-gray-500 mt-2">Gas fees will be calculated at execution time</p>
        </div>
    </div>
  )
}

export default StrategyCard

