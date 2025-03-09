"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import StrategyCard from "@/components/StrategyCard"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { ArrowRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export interface Step {
  action: string
  apy: string
}

export interface Recommendation {
  strategy: string
  expected_effective_yield: string
  steps: Step[]
}

export default function StrategyPage() {
  const [strategyQuery, setStrategyQuery] = useState("")
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [investToken, setInvestToken] = useState("")
  const { account } = useWallet()

  // Extract the first token from the strategy query
  useEffect(() => {
    if (strategyQuery) {
      const tokens = strategyQuery.split(" ")
      if (tokens.length > 0) {
        // Extract first token and convert to uppercase
        const firstToken = tokens[0].toUpperCase()
        setInvestToken(firstToken)
      }
    } else {
      setInvestToken("")
    }
  }, [strategyQuery])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setRecommendations(null)

    try {
      // Construct the API URL with query parameters
      const userWalletAddress = account?.address ? account.address.toString() : ""
      const url = `/api/ai-strategy?walletAddress=${encodeURIComponent(userWalletAddress)}&strategy=${encodeURIComponent(strategyQuery)}`
      const response = await axios.get(url)

      const recs: Recommendation[] = response.data.finalResult.recommendations
      setRecommendations(recs)
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "An error occurred")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-amber-900/20 z-0"></div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=500&width=1920')] bg-cover bg-center opacity-10 z-0"></div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-amber-400">
              AI-Powered Yield Strategies
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Discover optimized DeFi strategies tailored to your preferences
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
              <div className="bg-neutral-800/80 backdrop-blur-sm p-6 rounded-2xl border border-neutral-700/50 shadow-xl">
                <div className="mb-6">
                  <label htmlFor="strategyQuery" className="block mb-2 text-sm font-medium text-gray-300">
                    What strategy are you looking for?
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      id="strategyQuery"
                      value={strategyQuery}
                      onChange={(e) => setStrategyQuery(e.target.value)}
                      placeholder="e.g. APT to USDT"
                      className="w-full pl-10 pr-4 py-3 bg-neutral-900/90 border border-neutral-700 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    Enter tokens and strategy type (e.g. "APT to USDT", "ETH lending")
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !strategyQuery.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white font-medium py-6 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <LoadingSpinnerSmall />
                      <span className="ml-2">Generating Strategy...</span>
                    </span>
                  ) : (
                    <>
                      <span>Generate Optimal Strategy</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        {error && (
          <div className="max-w-3xl mx-auto mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {loading && (
          <div className="mt-12 flex flex-col items-center justify-center">
            <LoadingSpinner />
            <p className="text-gray-400 mt-6 text-center max-w-md">
              Our AI is analyzing market conditions and generating the most optimal strategy for your needs...
            </p>
          </div>
        )}

        {recommendations && recommendations.length > 0 ? (
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-8 text-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-amber-400">
                Recommended Strategies
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec, idx) => (
                <StrategyCard
                  key={idx}
                  title={`Strategy ${idx + 1}`}
                  description={rec.strategy}
                  expected_effective_yield={rec.expected_effective_yield}
                  steps={rec.steps}
                  icon="https://images.unsplash.com/photo-1621416894569-0f39ed31d247?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                  investToken={investToken || "USDT"}
                />
              ))}
            </div>
          </div>
        ) : (
          !loading &&
          recommendations === null && (
            <div className="mt-12 flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-neutral-800/50 rounded-full flex items-center justify-center mb-6">
                <Search size={36} className="text-gray-500" />
              </div>
              <p className="text-gray-400 text-center max-w-md">
                Enter your strategy query above to generate AI-powered yield recommendations.
              </p>
            </div>
          )
        )}
      </div>
      {/* Disclaimer Message */}
      <div className="my-4 pb-4">
          <p className="text-xs text-center text-gray-400">
            Disclaimer: The strategy displayed above is generated by an AI system based on available data, which may be inaccurate or incomplete. Please verify all details and conduct your own research or consult a financial advisor before making any investment decisions.
          </p>
        </div>

    </div>
  )
}

const LoadingSpinnerSmall = () => {
  return <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
}

const LoadingSpinner = () => {
  return (
    <div className="relative w-24 h-24">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-500/20 rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
      <div
        className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-l-amber-500 rounded-full animate-spin"
        style={{ animationDuration: "1.5s" }}
      ></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-purple-500/20 to-amber-500/20 rounded-full flex items-center justify-center">
        <div className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full"></div>
      </div>
    </div>
  )
}

