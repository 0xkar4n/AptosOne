"use client";
import StakingCards from "@/components/StakingCards";
import StakingDashboard from "@/components/StakingDashboard";
import { SparklesText } from "@/components/ui/sparkles-text";

export default function Home() {
  return (
    <main className="dark">
      <h2 className="text-4xl font-semibold flex justify-center p-2 mb-8"> Staking Options</h2>
      <StakingCards />
    </main>
  );
} 