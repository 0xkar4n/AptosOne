// components/PoolCard.tsx
import React from "react";
import { ShineBorder } from "@/components/ui/shine-border";
import { Button } from "@/components/ui/button";
import { GlowingEffect } from "@/components/ui/glowing-effect";

interface PoolCardProps {
  icon: string; // URL to the icon image
  title: string;
  apy: number | string;
  extraApy?: number | null;
  type: "Lending" | "Borrowing";
}

const PoolCard: React.FC<PoolCardProps> = ({ icon, title, apy, extraApy, type }) => {
  return (
    <div className="relative h-full p-4 rounded-lg">
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
      />
      <div className="absolute inset-0 pointer-events-none">
        
      </div>
      <div className="relative flex flex-col rounded-lg h-full p-4 rounded-2.5xl bg-neutral-800 dark:bg-neutral-900 shadow-md">
        <div className="flex items-center space-x-2">
          <img
            src={icon}
            alt={title}
            className="w-10 h-10 object-contain rounded-lg border p-1"
          />
          <h3 className="text-xl font-semibold text-white">
            {title}
          </h3>
        </div>
        <div className="mt-4">
          {type === "Lending" ? (
            <p className="text-sm text-gray-300">
              Deposit APY: {apy}
              {extraApy && <span> (Extra: {Number(extraApy).toFixed(2)})</span>}
            </p>
          ) : (
            <p className="text-sm text-gray-300">
              Borrow APY: {apy}
            </p>
          )}
        </div>
        {/* Deposit Button */}
        <div className="relative overflow-hidden mt-4">
          <ShineBorder
            shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
            className="rounded-lg"
          />
          <Button className="w-full bg-black hover:bg-black/40 text-white rounded-lg">
            Tell agent to deposit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PoolCard;
