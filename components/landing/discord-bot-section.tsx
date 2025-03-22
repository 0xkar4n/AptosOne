"use client"

import { useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Bot, MessageCircle, Server, Users, Zap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export default function DiscordBotSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  const features = [
    {
      icon: <MessageCircle className="h-5 w-5" />,
      title: "AI-Powered Responses",
      description: "Get instant answers about staking, pools, and strategies with our intelligent chatbot",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Real-time Updates",
      description: "Receive notifications about price changes, new pools, and important ecosystem events",
    },
    {
      icon: <Server className="h-5 w-5" />,
      title: "Direct Transactions",
      description: "Stake, unstake, and manage your assets directly through Discord commands",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Community Integration",
      description: "Connect with other AptosOne users and share strategies in a collaborative environment",
    },
  ]

  return (
    <section id="discord-bot" ref={sectionRef} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(88,101,242,0.1),transparent_70%)]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="flex items-center mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-[#5865F2]/20 p-2.5 rounded-lg mr-4 w-14 h-14 flex items-center justify-center shadow-inner shadow-[#5865F2]/10">
              <Image
            src="https://pbs.twimg.com/profile_images/1795851438956204032/rLl5Y48q_400x400.jpg"
            alt="MetaMove Logo"
            width={60}
            height={60}
            className="rounded-full w-full h-full object-cover"
            />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#5865F2] to-[#7289DA]">
                Discord Bot
              </h2>
            </motion.div>

            <motion.h3
              className="text-2xl md:text-3xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Manage Your Aptos Assets Without Leaving Discord
            </motion.h3>

            <motion.p
              className="text-zinc-400 text-lg mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Our Discord bot brings the power of AptosOne directly to your server, allowing you to check balances,
              stake tokens, and get AI-powered recommendations through simple commands.
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  className="flex group"
                >
                  <motion.div
                    className="mr-3 mt-1 bg-[#5865F2]/20 p-2 rounded-md text-[#5865F2] w-10 h-10 flex items-center justify-center shadow-sm"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(88, 101, 242, 0.25)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <div>
                    <h4 className="font-medium text-white mb-1 group-hover:text-[#5865F2] transition-colors duration-200">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-zinc-400">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Button
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-md shadow-[#5865F2]/20 transition-all duration-300"
              >
                <Bot className="mr-2 h-4 w-4" />
                Add to Discord
              </Button>
              <Button
                variant="outline"
                className="border-[#5865F2]/50 text-[#5865F2] hover:bg-[#5865F2]/10 transition-all duration-300"
              >
                View Documentation
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Right side - Discord Interface Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5865F2]/30 to-purple-600/30 rounded-xl blur-lg opacity-70"></div>

            <motion.div whileHover={{ y: -5, transition: { duration: 0.3 } }} className="relative z-10">
              <Card className="bg-[#36393F] border-[#202225] rounded-xl overflow-hidden shadow-2xl relative">
                <div className="bg-[#202225] p-4 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center mr-3">
                  <Image
            src="https://pbs.twimg.com/profile_images/1795851438956204032/rLl5Y48q_400x400.jpg"
            alt="MetaMove Logo"
            width={60}
            height={60}
            className="rounded-full w-full h-full object-cover"
          />                  </div>
                  <div>
                    <h3 className="font-medium text-white">AptosOne Bot</h3>
                    <div className="flex items-center">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-green-500 mr-2"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                      ></motion.div>
                      <span className="text-xs text-green-400">Online</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-0">
                  <div className="bg-[#36393F] p-4 min-h-[400px] flex flex-col">
                    {/* Bot welcome message */}
                    <motion.div
                      className="flex mb-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.4 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center mr-3 flex-shrink-0">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium text-[#5865F2] mr-2">AptosOne Bot</span>
                          <Badge className="bg-[#5865F2]/20 text-[#5865F2] border-[#5865F2]/30 text-xs">BOT</Badge>
                        </div>
                        <p className="text-white mt-1">Welcome to AptosOne! How can I assist you today?</p>
                      </div>
                    </motion.div>

                    {/* User balance query */}
                    <motion.div
                      className="flex justify-end mb-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.6 }}
                    >
                      <div className="bg-[#444A54] rounded-lg p-2.5 max-w-[80%]">
                        <p className="text-white">What is my apt balance</p>
                      </div>
                    </motion.div>

                    {/* Bot balance response */}
                    <AnimatePresence>
                      {isInView && (
                        <motion.div
                          className="flex mb-4"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.5, delay: 0.8 }}
                        >
                          <div className="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center mr-3 flex-shrink-0">
                            <Bot className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium text-[#5865F2] mr-2">AptosOne Bot</span>
                              <Badge className="bg-[#5865F2]/20 text-[#5865F2] border-[#5865F2]/30 text-xs">BOT</Badge>
                            </div>
                            <motion.p
                              className="text-white mt-1"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, delay: 1.0 }}
                            >
                              Your APT balance is <span className="text-green-400 font-medium">20 </span>.
                            </motion.p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                      <motion.div
                      className="flex justify-end mb-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.6 }}
                    >
                      <div className="bg-[#444A54] rounded-lg p-2.5 max-w-[80%]">
                        <p className="text-white">Stake 10 APT on Thala</p>
                      </div>
                    </motion.div>

                     <AnimatePresence>
                      {isInView && (
                        <motion.div
                          className="flex mb-4"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.5, delay: 0.8 }}
                        >
                          <div className="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center mr-3 flex-shrink-0">
                            <Bot className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium text-[#5865F2] mr-2">AptosOne Bot</span>
                              <Badge className="bg-[#5865F2]/20 text-[#5865F2] border-[#5865F2]/30 text-xs">BOT</Badge>
                            </div>
                            <motion.p
                              className="text-white mt-1"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, delay: 1.0 }}
                            >
                              Staked <span className="text-green-400 font-medium">10 APT</span> on Thala .
                            </motion.p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Input field */}
                    <div className="mt-auto border-t border-[#202225] pt-4">
                      <div className="bg-[#40444B] rounded-lg p-2.5 flex items-center">
                        <input
                          type="text"
                          placeholder="Message #aptos-one"
                          className="bg-transparent border-0 text-white w-full focus:outline-none text-sm"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Decorative elements */}
            <motion.div
              className="absolute -z-10 top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#5865F2]/20 rounded-full blur-3xl"
              animate={{
                opacity: [0.4, 0.7, 0.4],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            ></motion.div>
            <motion.div
              className="absolute -z-10 bottom-0 left-1/4 transform -translate-x-1/2 translate-y-1/4 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.15, 1],
              }}
              transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
            ></motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

