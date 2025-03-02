'use client'
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { useState,useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShineBorder } from "@/components/ui/shine-border";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAptBalance } from "@/custom/useAptBalance";

interface StakingCardProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const StakingCard = ({ icon, title, description }: StakingCardProps) => {
  const [activeTab, setActiveTab] = useState("Stake");
  const {balance,loading,error} = useAptBalance()


  return (
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
          <Tabs defaultValue="stake" className="mt-4">
            <TabsList>
              <TabsTrigger value="stake" onClick={() => setActiveTab("Stake")}>
                Stake
              </TabsTrigger>
              <TabsTrigger value="unstake" onClick={() => setActiveTab("Unstake")}>
                Unstake
              </TabsTrigger>
            </TabsList>
            <TabsContent value="stake" className="mt-6">
            <Label htmlFor="amount" className="block mb-2 text-sm  font-medium text-gray-300">
                  Amount of APT to Stake
                  <span className="ml-2 text-gray-500">
                    (Balance: { loading ? "Loading...": `${balance} APT` })
                  </span>
                </Label>
              <div className="relative overflow-hidden mt-4">
                
               
                  <Input
                    id="amount"
                    type="text"
                    placeholder="Enter amount"
                    className="w-full p-2 border rounded-lg text-cyan-50"
                  />
                <span className="absolute right-2 top-10 text-sm text-gray-500">
                  Balance: 100 APT
                </span>
              </div>
              <div className="relative overflow-hidden mt-2">
                <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} className="rounded-lg" />
                  <Button className="w-full px-4 py-2 bg-black/40 hover:bg-blue-500 text-white rounded-lg">
                    Stake
                  </Button>
              </div>
            </TabsContent>
            <TabsContent value="unstake">
            <Label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-300">
                  Amount of APT to Unstake
                </Label>
              <div className="relative overflow-hidden mt-4">
                
                  <Input
                    id="amount"
                    type="text"
                    placeholder="Enter amount"
                    className="w-full p-2 border rounded-lg"
                  />
                <span className="absolute right-2 top-10 text-sm text-gray-500">
                  Balance: 100 APT
                </span>
              </div>
              <div className="relative overflow-hidden mt-2">
                <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} className="rounded-lg" />
                  <Button className="w-full px-4 py-2 bg-black/40 hover:bg-blue-500 text-white rounded-lg">
                    Unstake
                  </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </li>
  );
};

export default StakingCard; 