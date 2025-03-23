"use client"
import { Button } from "@/components/ui/button"
import { Github, GithubIcon, Twitter, X, XIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Logo from "../AptosOnelogo"

export default function Footer() {
  return (
    <footer className="bg-black py-12 border-t border-purple-900/20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,50,255,0.1),transparent_50%)]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          {/* <Link href="/" className="flex items-center gap-2 mb-6"> */}
            {/* <Image src="/1500x500.png" width={180} height={180} alt="AptosOne Logo" />
             */}
             <div className="flex items-center gap-2 mb-6">
             <Logo />
             </div>
            
          {/* </Link> */}

          <p className="text-zinc-400 mb-6 max-w-md">
            Your gateway to the Aptos blockchain ecosystem, providing intuitive tools and AI-powered insights.
          </p>

          <div className="flex space-x-3 mb-8">
            <Link
              href="https://github.com/0xkar4n/AptosOne"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300"
            >
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-purple-900/50 text-purple-400 hover:text-purple-300 hover:border-purple-700/50 hover:bg-purple-950/30"
              >

                <GithubIcon
                  className="h-5 w-5"
                />
              </Button>
            </Link>
            <Link
              href="https://x.com/0xAptosOne"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300"
            >
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-purple-900/50 text-purple-400 hover:text-purple-300 hover:border-purple-700/50 hover:bg-purple-950/30"
              >

                <Image
                  src="https://pbs.twimg.com/profile_images/1683899100922511378/5lY42eHs_400x400.jpg"
                  alt="MetaMove Logo"
                  width={20}
                  height={20}
                  className="rounded-full w-full h-full object-cover"
                />
              </Button>
            </Link>
          </div>

          <div className="pt-8 border-t border-purple-900/20 w-full text-center">
            <p className="text-zinc-500 mb-2">
              Made by{" "}
              <Link
                href="https://x.com/0xkar4n"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 hover:text-pink-300"
              >
                Karan
              </Link>{" "}
              &{" "}
              <Link
                href="https://x.com/PraniketBodke1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 hover:text-pink-300"
              >
                Praniket
              </Link>
            </p>
            <p className="text-zinc-600 text-sm">© 2025 AptosOne. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}