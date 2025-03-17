"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md py-3 shadow-lg shadow-purple-900/10" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/final.png" width={230} height={230} alt="AptosOne Logo" />
        </Link>

        

        <div className="flex items-center gap-4">
          {/* <Button variant="ghost" className="hidden md:flex text-zinc-400 hover:text-white hover:bg-purple-900/20">
            Log In
          </Button> */}
          
          <Button onClick={()=>{
            router.push("/app")
          }} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-md shadow-purple-900/20" >
            Get Started
          </Button>
        </div>
      </div>
    </motion.header>
  )
}

