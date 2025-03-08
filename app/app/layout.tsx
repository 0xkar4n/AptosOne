"use client"

import ClientLayout from "@/components/ClientLayout"
import { Toaster } from "sonner"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientLayout>
      {children}
      <Toaster />
    </ClientLayout>
  )
} 