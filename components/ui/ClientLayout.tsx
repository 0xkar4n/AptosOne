'use client';

import { usePathname } from "next/navigation";
import Sidebar from "@/components/ui/sidebar";
import { Toaster } from "sonner";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  if (isLandingPage) {
    return children;
  }

  return (
    <Sidebar>
      {children}
      <Toaster richColors position="bottom-right" />
    </Sidebar>
  );
} 