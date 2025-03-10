"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import type React from "react"
import { useState, createContext, useContext, useEffect } from "react"
import { IconWallet, IconArrowsExchange, IconDroplet, IconMenu2, IconListDetails } from "@tabler/icons-react"
import { ShineBorder } from "@/components/ui/shine-border"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { motion } from "framer-motion"
import { useAptBalance } from "@/custom/useAptBalance"
import { SparklesText } from "./sparkles-text"
import SidebarWallet from "../SidebarWallet"

interface Links {
  label: string
  href: string
  icon: React.JSX.Element | React.ReactNode
}

interface SidebarContextProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  animate: boolean
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined)

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  animate?: boolean
}) => {
  const [openState, setOpenState] = useState(false)

  const open = openProp !== undefined ? openProp : openState
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState

  return <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>{children}</SidebarContext.Provider>
}

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <SidebarContent>{children}</SidebarContent>
    </SidebarProvider>
  )
}

const SidebarContent = ({ children }: { children: React.ReactNode }) => {
  const [activeLink, setActiveLink] = useState<string>("/stake")
  const { open, setOpen } = useSidebar()
  const { balance, loading } = useAptBalance();



  const links = [
    { label: "Stake", href: "/app/stake", icon: <IconWallet className="w-5 h-5" /> },
    { label: "Top Pools", href: "/app/top-pools", icon: <IconDroplet className="w-5 h-5" />  },
    { label: "AI Strategy", href: "/app/ai-strategy", icon: <IconArrowsExchange className="w-5 h-5" /> },
    { label: "Positions", href: "/app/positions", icon: <IconListDetails className="w-5 h-5" /> },
  ]

  return (
    <div className="flex fixed w-screen bg-neutral-900/95 text-white left-0 h-full">
      {/* Mobile menu button */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-neutral-800 text-white"
      >
        <IconMenu2 className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed md:relative flex flex-col bg-neutral-800/90 backdrop-blur-md h-full w-[280px] p-6 border-r border-gray-700/50 transition-all duration-300 ease-in-out z-40",
          "shadow-[0_0_15px_rgba(0,0,0,0.5)]",
          open ? "left-0" : "-left-[280px] md:left-0",
        )}
      >
        <div className="relative">
          <GlowingEffect spread={60} glow={true} disabled={false} proximity={80} inactiveZone={0.01} />
        </div>

        {/* Logo */}
        <SparklesText className="text-3xl flex justify-center  " text="AptosOne" />
        <br  className="h-2 w-1/2 bg-white"/>

        {/* Navigation */}
        <div className="flex flex-col gap-y-3 mt-4">
          {links.map((link) => (
            <div key={link.label} className="relative group">
              <SidebarLink link={link} isActive={activeLink === link.href} onClick={() => setActiveLink(link.href)} />
              <motion.div
                className={cn(
                  "absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-purple-500/80 via-pink-500/80 to-amber-500/80",
                  activeLink === link.href ? "w-full" : "w-0 group-hover:w-full",
                )}
                initial={{ width: activeLink === link.href ? "100%" : "0%" }}
                animate={{ width: activeLink === link.href ? "100%" : "0%" }}
                exit={{ width: "0%" }}
                transition={{ duration: 0.3 }}
              />
            </div>
          ))}
        </div>

        {/* Wallet Balance */}
        <div className="mt-auto pt-6">

       <SidebarWallet />
        </div>
      </div>

      {/* Main content */}
      <main className="h-full flex-1 overflow-y-scroll no-scrollbar p-2 md:p-6 pl-[60px] md:pl-6">{children}</main>
    </div>
  )
}

export const SidebarLink = ({
  link,
  className,
  isActive,
  onClick,
  ...props
}: {
  link: Links
  className?: string
  isActive?: boolean
  onClick?: () => void
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center justify-start gap-3 py-3 px-4 rounded-lg transition-all duration-200 relative overflow-hidden",
        "hover:bg-neutral-700/50",
        isActive ? "bg-gradient-to-r from-neutral-700/80 to-neutral-700/30 text-white" : "text-gray-300",
        className,
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* Hover glow effect */}
      {isHovered && !isActive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Icon with glow effect */}
      <div className={cn("relative", (isActive || isHovered) && "text-purple-400")}>
        {(isActive || isHovered) && <div className="absolute inset-0 bg-purple-500/30 blur-md rounded-full" />}
        <div className="relative z-10">{link.icon}</div>
      </div>

      {/* Text with gradient on active/hover */}
      <span
        className={cn(
          "text-base font-semibold transition-all duration-200",
          (isActive || isHovered) &&
            "bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-200 to-amber-200",
        )}
      >
        {link.label}
      </span>

      {/* Active indicator */}
      {isActive && (
        <div className="absolute right-2 w-1 h-1/2 bg-gradient-to-b from-purple-500/50 to-pink-500/50 rounded-full" />
      )}

      {/* Hover indicator line animation */}
      <motion.div
        className={cn(
          "absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-purple-500/80 via-pink-500/80 to-amber-500/80",
        )}
        initial={{ width: isActive ? "100%" : "0%" }}
        animate={{
          width: isActive ? "100%" : isHovered ? "100%" : "0%",
          opacity: isActive ? 1 : isHovered ? 0.8 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
    </Link>
  )
}

export default Sidebar

