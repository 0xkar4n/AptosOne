// components/PoolCard.tsx
"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ShineBorder } from "@/components/ui/shine-border";
import { Button } from "@/components/ui/button";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { APYTooltip } from "./APTtooltip"; // adjust path as needed
import { Input } from "./ui/input";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { LinkPreview } from "./ui/link-preview";

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
  // Optionally pass these as props or get from context/state
  tokenAddress?: string;
  userWalletAddress?: string;
  ltv?: number; // new property: Loan-to-Value percentage
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
  tokenAddress,
  userWalletAddress,
  ltv,
}) => {
  // State to capture the amount input
  const [amount, setAmount] = useState("");
  const { connected } = useWallet();

  const handleAgentAction = async () => {
    try {
      // Prepare payload based on the pool type
      if(amount==''){
        toast.error('Please enter valid amount');
        return;
      }
      const payload = {
        action: type === "Lending" ? "deposit" : "borrow",
        amount,
        tokenAddress,
        userWalletAddress,
      };
      toast.loading("Loading your request...")
    

      const response = await axios.post("/api/v1/top-pools", payload);

      toast.dismiss();
      toast.success(`Action succeeded: ${response.data.result}`);
      toast.dismiss();
    } catch (err: any) {
        toast.dismiss();
        toast.error("Failed", {
          description: err.response.data.error,
        });
      } 
    finally{
    }
  };

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
              <p className="text-sm text-white">
                Deposit APY : {depositApy?.toFixed(2)}%
              </p>
              <p className="text-sm text-white">
                Total APY : {totalApy?.toFixed(2)}%
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
            <p className="text-sm text-white">
              Borrow APY : {borrowApy?.toFixed(2)}%
            </p>
          )}
          {typeof ltv === "number" && (
            <p className="text-sm text-white">
              LTV : {ltv.toFixed(2)}%
            </p>
          )}
        </div>
        <div className="relative overflow-hidden mt-4">
          <Input
            id="amount-input"
            type="text"
            placeholder="Enter amount"
            className="w-full p-2 border rounded-lg bg-gray-800 text-white"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="relative overflow-hidden mt-4">
          <ShineBorder
            shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
            className="rounded-lg"
            borderWidth={2}
          />
          {connected ? (
            <Button
              onClick={handleAgentAction}
              className="w-full bg-black hover:bg-black/40 text-white rounded-lg"
            >
              {type === "Lending"
                ? "Tell agent to Deposit"
                : "Tell agent to Borrow"}
            </Button>
          ) : (
            <Button
              onClick={handleAgentAction}
              className="w-full bg-black hover:bg-black/40 text-white rounded-lg"
            >
              Please Connect your wallet
            </Button>
          )}
        </div>

        <div className=" flex justify-center pt-2 text-sm">
          <h1>For more details, visit {" "}
            <LinkPreview url="https://www.joule.finance/" className="font-bold text-orange-500">
              Joule Finance
            </LinkPreview>

          </h1>
        </div>
      </div>
    </div>
  );
};

export default PoolCard;
