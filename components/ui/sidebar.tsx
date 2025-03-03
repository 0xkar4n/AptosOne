"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useState, createContext, useContext } from "react";
import { IconWallet, IconArrowsExchange, IconDroplet } from "@tabler/icons-react";
import { ShineBorder } from "@/components/ui/shine-border";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex fixed w-screen bg-neutral-900 text-white left-0 h-full">
      <div className="hidden md:flex rounded-lg flex-col gap-y-2 bg-neutral-800 h-full w-[300px] p-2">
        <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} className="rounded-lg" />
          <div className="flex flex-col justify-center gap-y-4 px-5 py-4">
            <SidebarLink
              link={{ label: "Stake", href: "/", icon: <IconWallet /> }}
            />
            <div className="border-t border-neutral-700 my-2"></div>

            <SidebarLink
              link={{ label: "Top Pools", href: "/top-pools", icon: <IconWallet /> }}
            />
            <div className="border-t border-neutral-700 my-2"></div>
            
            
            
            <SidebarLink
              link={{ label: "Swapping", href: "/swapping", icon: <IconArrowsExchange /> }}
            />
            <div className="border-t border-neutral-700 my-2"></div>
            <SidebarLink
              link={{ label: "Liquidity", href: "/liquidity", icon: <IconDroplet /> }}
            />
          </div>
      </div>
      <main className="h-full flex-1 overflow-y-scroll no-scrollbar p-2">
        {children}
      </main>
    </div>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
}) => {
  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center justify-start gap-2 py-2 hover:text-gray-300 hover:bg-neutral-700 rounded-md transition-colors duration-200",
        className
      )}
      {...props}
    >
      {link.icon}
      <span className="text-lg font-bold">{link.label}</span>
    </Link>
  );
};

export default Sidebar;