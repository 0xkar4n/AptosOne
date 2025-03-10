// components/APYTooltip.tsx
"use client";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface APYTooltipProps {
  depositApy: number;
  extraApy: number;
  stakingApy: number;
  totalApy: number;
}

export const APYTooltip: React.FC<APYTooltipProps> = ({
  depositApy,
  extraApy,
  stakingApy,
  totalApy,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="ml-2 cursor-pointer border border-gray-400 rounded-full px-1 text-xs text-gray-300">
            i
          </span>
        </TooltipTrigger>
        <TooltipContent className="bg-yellow-400 text-black text-xs p-2 rounded">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <span>Deposit APY : </span>
              <span>{depositApy.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Extra APY : </span>
              <span>{extraApy.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Staking APY : </span>
              <span>{stakingApy.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total APY:</span>
              <span>{totalApy.toFixed(2)}%</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
