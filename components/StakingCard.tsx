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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStake = async () => {
    try {
      const amount = Number(stakeAmount);
      if (isNaN(amount) || amount <= 0) {
        toast.error("Please enter a valid stake amount");
        return;
      }
      setIsSubmitting(true);
      const protocol = title;
      const payload = { protocol, value: amount };
      
      // Show loading toast
      toast.loading("Processing your stake request...");
      
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
        description: err.response?.data?.error || err.message || "An error occurred while staking",
      });
    } finally {
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
              <div className="w-fit rounded-lg border border-gray-600 p-2">
                {icon}
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white">
                {title}
              </h3>
            </div>
            
            <Tabs defaultValue="stake" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="stake">Stake</TabsTrigger>
                <TabsTrigger value="unstake">Unstake</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stake" className="mt-6">
                <Label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-300">
                  Amount of APT to Stake
                  <span className="ml-2 text-gray-500">
                    (Max: {loading ? "Loading..." : `${APTbalance} APT`})
                  </span>
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
                  />
                  <Button
                    onClick={handleStake}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 bg-black hover:bg-black/40 text-white rounded-lg"
                  >
                    {isSubmitting ? "Processing..." : "Tell agent to deposit"}
                  </Button>
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
                    className="w-full p-2 border rounded-lg bg-gray-800 text-white"
                  />
                </div>
                <div className="relative overflow-hidden mt-4">
                  <ShineBorder
                    shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                    className="rounded-lg"
                  />
                  <Button className="w-full px-4 py-2 bg-black hover:bg-black/40 text-white rounded-lg">
                    Unstake
                  </Button>
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
