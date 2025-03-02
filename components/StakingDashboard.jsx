"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import { GlowingEffect } from "./ui/glowing-effect";
import { IconWallet, IconArrowsExchange, IconDroplet } from "@tabler/icons-react";
import StakingCards from "./StakingCards";

const StakingDashboard = () => {
  const [activeSection, setActiveSection] = useState("stake");

  const sidebarLinks = [
    {
      label: "Stake",
      href: "stake",
      icon: <IconWallet className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Swapping",
      href: "#swapping",
      icon: <IconArrowsExchange className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Liquidity",
      href: "#liquidity",
      icon: <IconDroplet className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />,
    },
  ];

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-900">
      <Sidebar>
        <SidebarBody className="border-r border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-white">Staking App</h2>
            <div className="flex flex-col gap-2">
              {sidebarLinks.map((link) => (
                <SidebarLink
                  key={link.label}
                  link={link}
                  className={`${
                    activeSection === link.label.toLowerCase()
                      ? "bg-neutral-200 dark:bg-neutral-700"
                      : ""
                  } rounded-md px-2 hover:bg-neutral-200 dark:hover:bg-neutral-700`}
                  onClick={() => handleSectionChange(link.label.toLowerCase())}
                />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex-1 p-6 overflow-auto">
        {activeSection === "stake" && <StakingCards />}
        {activeSection === "swapping" && (
          <div className="text-center text-neutral-700 dark:text-neutral-200 mt-20">
            <GlowingEffect disabled={false} glow={false} />
          </div>
        )}
        {activeSection === "liquidity" && (
          <div className="text-center text-neutral-700 dark:text-neutral-200 mt-20">
            Liquidity section coming soon
          </div>
        )}
      </div>
    </div>
  );
};

export default StakingDashboard; 