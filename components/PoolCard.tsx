// components/PoolCard.tsx
"use client";
import React from "react";
import { ShineBorder } from "@/components/ui/shine-border";
import { Button } from "@/components/ui/button";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { APYTooltip } from "./APTtooltip"; // adjust path as needed
import { Input } from "./ui/input";

interface PoolCardProps {
  icon: string; // URL to the icon image
  title: string;
  type: "Lending" | "Borrowing";
  // Lending pool properties
  totalApy?: number;
  depositApy?: number;
  extraApy?: number | null;
  stakingApy?: number | null;
  // Borrowing pool property
  borrowApy?: number;
}

const PoolCard: React.FC<PoolCardProps> = ({
  icon,
  title,
  type,
  totalApy,
  depositApy,
  extraApy,
  stakingApy,
  borrowApy,
}) => {
  return (
    <div className="relative h-full p-4 rounded-lg">
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
      />
      <div className="absolute inset-0 pointer-events-none" />
      <div className="relative flex flex-col h-full p-4 bg-neutral-800 dark:bg-neutral-900 shadow-md rounded-lg">
        <div className="flex items-center space-x-2">
          <img
            src={icon}
            alt={title}
            className="w-10 h-10 object-contain rounded-lg border p-1"
          />
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        <div className="mt-4">
          {type === "Lending" ? (
            <div>
              <p className="text-sm text-gray-300">
                Deposit APY: {depositApy?.toFixed(2)}%
              </p>
              <p className="text-sm text-gray-300">
                Total APY: {totalApy?.toFixed(2)}%
                {depositApy != null &&
                  extraApy != null &&
                  stakingApy != null &&
                  totalApy != null && (
                    <APYTooltip
                      depositApy={depositApy}
                      extraApy={Number(extraApy)}
                      stakingApy={Number(stakingApy)}
                      totalApy={totalApy}
                    />
                  )}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-300">
              Borrow APY: {borrowApy?.toFixed(2)}%
            </p>
          )}
        </div>
        <div className="relative overflow-hidden mt-4">
                  <Input
                    id="unstake-amount"
                    type="text"
                    placeholder="Enter amount"
                    className="w-full p-2 border rounded-lg bg-gray-800 text-white"
                  />
                </div>
        <div className="relative overflow-hidden mt-4">
          <ShineBorder
            shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
            className="rounded-lg"
          />

          <Button className="w-full bg-black hover:bg-black/40 text-white rounded-lg">
             {type === "Lending" ? "Deposit" : "Borrow"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PoolCard;
