"use client";
import StakingCards from "@/components/StakingCards";

export default function DashboardPage() {
  return (
    <main className="dark">
      <h2 className="text-4xl font-semibold flex justify-center p-2 mb-8">Staking Options</h2>
      <StakingCards />
    </main>
  );
} 