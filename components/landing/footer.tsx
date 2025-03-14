"use client"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-black py-12 border-t border-purple-900/20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,50,255,0.1),transparent_50%)]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-lg transform rotate-45"></div>
              <div className="absolute inset-1 bg-black rounded-lg transform rotate-45 flex items-center justify-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-bold">
                  A
                </span>
              </div>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              AptosOne
            </span>
          </Link>

          <p className="text-zinc-400 mb-6 max-w-md">
            Your gateway to the Aptos blockchain ecosystem, providing intuitive tools and AI-powered insights.
          </p>

          <div className="flex space-x-3 mb-8">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-purple-900/50 text-purple-400 hover:text-purple-300 hover:border-purple-700/50 hover:bg-purple-950/30"
            >
              <Github className="h-5 w-5" />
            </Button>
          </div>

          <div className="pt-8 border-t border-purple-900/20 w-full text-center">
            <p className="text-zinc-500 mb-2">Made with love by X and Y</p>
            <p className="text-zinc-600 text-sm">© 2025 AptosOne. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

