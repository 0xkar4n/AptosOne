"use client"

import type React from "react"

import { useState, useEffect } from "react"
import axios from "axios"
import StrategyCard from "@/components/StrategyCard"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { ArrowRight, Search, Sparkles, Zap, ChevronRight, BarChart3, Wallet, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShineBorder } from "@/components/ui/shine-border"
import { Separator } from "@/components/ui/separator"

export interface Step {
  action: string
  apy: string
}

export interface Recommendation {
  strategy: string
  effective_yield: string
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
      const userWalletAddress = account?.address ? account.address.toString() : ""
      const url = `/api/ai-strategy?walletAddress=${encodeURIComponent(userWalletAddress)}&strategy=${encodeURIComponent(strategyQuery)}`
      const response = await axios.get(url)
      console.log(response.data)

      const recs: Recommendation[] = response.data.finalResult.recommendations
      setRecommendations(recs)
      console.log(recs)
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "An error occurred")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 dark">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-gray-200" />
            </div>
            <span className="font-semibold text-lg tracking-tight">AptosOne Strategist</span>
          </div>
          
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/20 to-gray-800/10 z-0"></div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=500&width=1920')] bg-cover bg-center opacity-5 z-0"></div>

     

        <motion.div
          className="container mx-auto px-4 py-16 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800/10 border border-gray-700/20 text-gray-300 text-sm font-medium mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              <span>AI-Powered Investment Strategies</span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-300 tracking-tight"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Optimize Your DeFi Yield Strategy
            </motion.h1>
            <motion.p
              className="text-lg text-gray-300 mb-8 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Leverage advanced AI to discover personalized yield strategies tailored to your investment goals and risk
              profile.
            </motion.p>

            <motion.form
              onSubmit={handleSubmit}
              className="w-full max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              
                <Card className="bg-gray-900/80 backdrop-blur-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl text-gray-100 tracking-tight">Generate Strategy</CardTitle>
                    <CardDescription className="text-gray-400">
                      Describe your investment goals and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
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
                          className="w-full pl-10 pr-4 py-3 bg-black border border-gray-800 rounded-lg text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-gray-700 focus:border-gray-700"
                        />
                        <Search
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          size={18}
                        />
                      </div>
                      <p className="mt-2 text-xs text-gray-400">
                        Enter tokens and strategy type (e.g. "USDC to APT", "USDC to WBTC","APT to ABTC")
                      </p>
                    </div>

                    <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                  className="rounded-lg"
                  borderWidth={1} />
                      <Button
                        type="submit"
                        disabled={loading || !strategyQuery.trim()}
                        className={cn(
                          "w-full bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-gray-100 font-medium py-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 h-auto disabled:opacity-50",
                          loading && "relative overflow-hidden",
                        )}
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <LoadingSpinnerSmall />
                            <span className="ml-2">Generating Strategy...</span>
                          </span>
                        ) : (
                          <>
                            <Zap size={18} className="mr-2" />
                            <span>Generate Optimal Strategy</span>
                            <motion.div
                              animate={{
                                x: [0, 3, 0],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "reverse",
                              }}
                            >
                              <ArrowRight size={18} />
                            </motion.div>
                          </>
                        )}
                      </Button>
                  </CardContent>
                  
                </Card>
            </motion.form>
          </motion.div>
        </motion.div>
      </div>

      <Separator />

    

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        {error && (
          <motion.div
            className="max-w-3xl mx-auto mt-4 p-4 bg-red-900/10 border border-red-800/30 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-red-300 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              {error}
            </p>
          </motion.div>
        )}

        {loading && (
          <motion.div
            className="mt-12 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <LoadingSpinner />
            <motion.p
              className="text-gray-400 mt-6 text-center max-w-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Our AI is analyzing market conditions and generating the most optimal strategy for your needs...
            </motion.p>
          </motion.div>
        )}

        {recommendations && recommendations.length > 0 ? (
          <div
            className="mt-12"
           
          >
            <div
              className="flex items-center justify-between mb-8"
              
            >
              <h2 className="text-2xl font-semibold tracking-tight text-gray-100">Recommended Strategies</h2>
              <Button
                variant="outline"
                size="sm"
                className="text-gray-300 border-gray-700 hover:bg-gray-800 hover:text-gray-100"
              >
                <ChevronRight className="w-4 h-4 mr-1" />
                View All
              </Button>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              
            >
              {recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  
                >
                  <StrategyCard
                    title={`Strategy ${idx + 1}`}
                    description={rec.strategy}
                    expected_effective_yield={rec.effective_yield}
                    steps={rec.steps}
                    icon="https://images.unsplash.com/photo-1621416894569-0f39ed31d247?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    investToken={investToken || "USDT"}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          !loading &&
          recommendations === null && (
            <motion.div
              className="mt-12 flex flex-col items-center justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="w-20 h-20 bg-gray-900/50 rounded-full flex items-center justify-center mb-6 border border-gray-800/50"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Search size={32} className="text-gray-500" />
              </motion.div>
              <motion.p
                className="text-gray-400 text-center max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Enter your strategy query above to generate AI-powered yield recommendations.
              </motion.p>
            </motion.div>
          )
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black/80 backdrop-blur-md mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 rounded-md bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-gray-200" />
              </div>
              <span className="font-medium text-gray-100">AptosOne Strategist</span>
            </div>
            <div className="text-xs text-gray-400">
              Disclaimer: The strategies displayed are generated by an AI system based on available data, which may be
              inaccurate or incomplete. Please verify all details and conduct your own research or consult a financial
              advisor before making any investment decisions.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

const LoadingSpinnerSmall = () => {
  return <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
}

const LoadingSpinner = () => {
  return (
    <div className="relative w-24 h-24">
      <motion.div
        className="absolute top-0 left-0 w-full h-full border-4 border-gray-500/20 rounded-full"
        animate={{ scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      ></motion.div>
      <motion.div
        className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-gray-500 rounded-full animate-spin"
        style={{ animationDuration: "1s" }}
      ></motion.div>
      <motion.div
        className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-l-gray-400 rounded-full animate-spin"
        style={{ animationDuration: "1.5s" }}
      ></motion.div>
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-gray-500/20 to-gray-400/20 rounded-full flex items-center justify-center"
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(156, 163, 175, 0.3)",
            "0 0 0 10px rgba(156, 163, 175, 0)",
            "0 0 0 0 rgba(156, 163, 175, 0)",
          ],
        }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <div className="w-10 h-10 bg-gray-900/50 backdrop-blur-sm rounded-full"></div>
      </motion.div>
    </div>
  )
}


