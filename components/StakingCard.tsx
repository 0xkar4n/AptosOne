'use client'
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShineBorder } from "@/components/ui/shine-border";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

interface StakingCardProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  APTbalance: string;
  loading: boolean;
}

const StakingCard = ({ icon, title, description, APTbalance, loading }: StakingCardProps) => {
  const [activeTab, setActiveTab] = useState("stake");
  const [stakeAmount, setStakeAmount] = useState("");
  const {
    account,
    connect,
    connected,
    disconnect,
    wallet,
  } = useWallet();

  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  // New state for tracking the API call status

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStake = async () => {
    try {
      debugger;
      const amount = Number(stakeAmount);
      if (isNaN(amount) || amount <= 0) {
        toast.error("Please enter a valid stake amount");
        return;
      }
      setIsSubmitting(true);
      const protocol = title;
      const payload = { protocol, value: amount, userWalletAddress:account?.address.toString() };
      
      // Show loading toast
      toast.loading("Processing your stake request...");
      debugger
      const response = await axios.post("/api/v1/stake", payload);
      
      // Dismiss all toasts before showing success
      toast.dismiss();
      toast.success("Stake successful!", {
        description: `Successfully staked ${amount} APT with ${protocol}`,
      });
      
      setStakeAmount(""); // Clear input after successful stake
    } catch (err: any) {
      // Dismiss all toasts before showing error
      toast.dismiss();
      toast.error("Stake failed", {
        description:  "Something Went Wrong ",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleUnstake = async () => {
    try {
      const amount = Number(unstakeAmount);
      if (isNaN(amount) || amount <= 0) {
        console.error("Please enter a valid stake amount");
        return;
      }
      setIsSubmitting(true);
      const protocol = title;
      const payload = { protocol, value: amount,userWalletAddress:account?.address.toString()  };
      const response = await axios.post("/api/v1/unstake", payload);
      toast.dismiss();
      toast.success("UnStake successful!", {
        description: `Successfully UnStaked ${amount} APT with ${protocol}`,
      });
    } catch (err: any) {
      toast.dismiss();
      toast.error("UnStake failed", {
        description: "Something Went Wrong",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <li className="flex-1 min-h-[14rem] list-none">
      <div className="relative h-full rounded-2.5xl border p-4 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-0.75 p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D] md:p-6">
          <div className="flex items-center space-x-2">
            <div className="w-fit rounded-full">
              {icon}
            </div>
            <h3 className="text-xl font-semibold text-black dark:text-white">
              {title}
            </h3>
          </div>
          
          <Tabs defaultValue="stake" value={activeTab} onValueChange={setActiveTab}>
            <TabsList >
              <TabsTrigger value="stake">Stake</TabsTrigger>
              <TabsTrigger value="unstake">Unstake</TabsTrigger>
            </TabsList>
            
            <TabsContent value="stake" className="mt-6">
              <Label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-300">
                Amount of APT to Stake
                {connected?
                <span className="ml-2 text-gray-500">               
                  (Max: {loading ? "Loading..." : `${APTbalance} APT`})
                </span>
                :
                <span className="ml-2 text-gray-500">               
                
               </span>
                }

              </Label>
              <div className="relative overflow-hidden mt-4">
                <Input
                  id="amount"
                  type="text"
                  placeholder="Enter amount"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="w-full p-2 border rounded-lg text-cyan-50 bg-gray-800"
                />
              </div>
              <div className="relative overflow-hidden mt-4">
                <ShineBorder
                  shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                  className="rounded-lg"
                  borderWidth={2}
                />
                {connected?
                <Button
                  onClick={handleStake}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-black hover:bg-black/40 text-white rounded-lg"
                >
                  {isSubmitting ? "Processing..." : "Tell Agent to Stake"}
                </Button>
                :
                <Button
                 
                  disabled={!connected}
                  className="w-full px-4 py-2 bg-black hover:bg-black/40 text-white rounded-lg"
                >
                  Please Connect your wallet
                </Button>

              }
              </div>
            </TabsContent>
            
            <TabsContent value="unstake" className="mt-6">
              <Label htmlFor="unstake-amount" className="block mb-2 text-sm font-medium text-gray-300">
                Amount of APT to Unstake
              </Label>
              <div className="relative overflow-hidden mt-4">
                <Input
                  id="unstake-amount"
                  type="text"
                  placeholder="Enter amount"
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-gray-800 text-white"
                />
              </div>
              <div className="relative overflow-hidden mt-4">
                <ShineBorder
                  shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                  className="rounded-lg"
                  borderWidth={2}
                />
                {connected?
                <Button 
                onClick={handleUnstake}
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-black hover:bg-black/40 text-white rounded-lg">
                  {isSubmitting ? "Processing..." : "Tell Agent to unstake"}
                </Button>
                :
                <Button
                  disabled={!connected}
                  className="w-full px-4 py-2 bg-black hover:bg-black/40 text-white rounded-lg"
                >
                  Please Connect your wallet
                </Button>

              }
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </li>
  </>
  );
};

export default StakingCard;
