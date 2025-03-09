"use client"

import Sidebar from "@/components/ui/sidebar"
import WalletProvider from "@/components/WalletProvider"
import { Toaster } from "sonner"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WalletProvider>
      <Sidebar>
        {children}
        <Toaster richColors position="bottom-right" />
      </Sidebar>
      <Toaster />
    </WalletProvider>
  )
} 