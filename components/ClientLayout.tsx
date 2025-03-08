'use client';

import { usePathname } from "next/navigation";
import Sidebar from "@/components/ui/sidebar";
import { Toaster } from "sonner";
import { HomeIcon, CurrencyDollarIcon, ChartBarIcon } from "@heroicons/react/24/outline";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  const navigation = [
    { name: 'Dashboard', href: '/app/dashboard', icon: HomeIcon },
    { name: 'Stake', href: '/app/stake', icon: CurrencyDollarIcon },
    { name: 'Top Pools', href: '/app/top-pools', icon: ChartBarIcon },
    // ... other navigation items
  ]

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