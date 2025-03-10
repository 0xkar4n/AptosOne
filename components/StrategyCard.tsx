import type React from "react"
import { ShineBorder } from "./ui/shine-border"
import { Button } from "./ui/button"
import { GlowingEffect } from "./ui/glowing-effect"
import { Input } from "./ui/input"
import { Info, ArrowRight, Sparkles, TrendingUp } from "lucide-react"

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
  return (
    <div className="relative h-full rounded-xl overflow-hidden">
      <GlowingEffect spread={60} glow={true} disabled={false} proximity={100} inactiveZone={0.01} />
      <div className="absolute inset-0 pointer-events-none" />
      <div className="relative flex flex-col h-full p-6 bg-gradient-to-b from-neutral-800/90 to-neutral-900/90 backdrop-blur-sm shadow-xl rounded-xl border border-neutral-700/50">
        {/* Card Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="relative w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-amber-500/20 border border-neutral-700/50 p-2">
            <img src={icon || "/placeholder.svg"} alt={title} className="w-8 h-8 object-contain rounded-md" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
              <Sparkles size={10} className="text-black" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            {description && <p className="text-sm text-gray-400 line-clamp-1">{description}</p>}
          </div>
        </div>

        {/* Yield Information */}
        {expected_effective_yield && (
          <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/20 rounded-lg p-3 mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="text-green-400 mr-2" size={18} />
              <span className="text-gray-300 text-sm">Effective Yield</span>
            </div>
            <span className="text-green-400 font-bold text-lg">{expected_effective_yield}</span>
          </div>
        )}

        {/* Strategy Steps */}
        {steps && steps.length > 0 && (
          <div className="mt-1 bg-black/40 p-4 rounded-xl border border-neutral-800 mb-4">
            <div className="flex items-center mb-3">
              <h4 className="text-md font-semibold text-white">Strategy Steps</h4>
              <div className="ml-2 text-gray-400 cursor-help hover:text-gray-300 transition-colors">
                <Info size={14} />
              </div>
            </div>
            <div className="space-y-2">
              {steps.map((stepItem, index) => (
                <div key={index} className="bg-neutral-800/50 rounded-lg p-3">
                  <div className="flex items-start">
                    <div className="min-w-6 h-6 rounded-full bg-neutral-700 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-xs font-medium text-white">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="text-gray-300 text-sm">{stepItem.action}</span>
                        <span className="text-green-400 font-medium text-sm ml-2">{stepItem.apy}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* APY Breakdown (if provided) */}
        {apyBreakdowns && netApy !== undefined && (
          <div className="mt-1 bg-black/40 p-4 rounded-xl border border-neutral-800 mb-4">
            <div className="flex items-center mb-3">
              <h4 className="text-md font-semibold text-white">APY Calculation</h4>
              <div className="ml-2 text-gray-400 cursor-help hover:text-gray-300 transition-colors">
                <Info size={14} />
              </div>
            </div>
            <div className="space-y-2">
              {apyBreakdowns.map((breakdown, index) => (
                <div key={index} className="bg-neutral-800/50 rounded-lg p-2.5">
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-gray-300 flex items-center">
                      <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      {breakdown.depositToken} deposit
                    </span>
                    <span className="text-green-400 font-medium">+{breakdown.depositApy.toFixed(2)}%</span>
                  </div>
                  {breakdown.borrowToken && (
                    <div className="flex justify-between text-sm items-center mt-1.5">
                      <span className="text-gray-300 flex items-center">
                        <span className="inline-block w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                        {breakdown.borrowToken} borrow
                      </span>
                      <span className="text-red-400 font-medium">-{breakdown.borrowCost.toFixed(2)}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-700/50">
              <div className="flex justify-between font-medium">
                <span className="text-white flex items-center">
                  <span className="mr-1.5">Net APY</span>
                  <Info size={12} className="text-gray-500" />
                </span>
                <span className={`text-lg font-bold ${netApy >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {netApy.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Investment Input */}
        <div className="mt-auto">
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Investment Amount</label>
          <div className="relative">
            <Input
              type="text"
              placeholder="0.00"
              className="w-full p-3 border border-neutral-700 rounded-lg bg-neutral-800/70 text-white text-lg font-medium"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600/80 to-amber-600/80 px-3 py-1 rounded text-xs font-medium text-white">
              {investToken}
            </div>
          </div>
        </div>

        {/* Execute Button */}
        <div className="relative overflow-hidden mt-5">
          <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} className="rounded-lg">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white font-medium py-3 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300">
              <span>Execute Strategy</span>
              <ArrowRight size={16} />
            </Button>
          </ShineBorder>
          <p className="text-xs text-center text-gray-500 mt-2">Gas fees will be calculated at execution time</p>
        </div>
      </div>
    </div>
  )
}

export default StrategyCard

