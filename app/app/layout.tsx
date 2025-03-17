"use client"

import Sidebar from "@/components/ui/sidebar"
import WalletProvider from "@/components/WalletProvider"
import { Toaster } from "sonner"
import { ChatWidget } from "@/components/ChatWidget"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WalletProvider>
      <Sidebar>
        {children}
        <Toaster richColors position="top-right" closeButton={true}  />
      </Sidebar>
      <ChatWidget />
    </WalletProvider>
  )
} 