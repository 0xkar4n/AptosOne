'use client'
import { useAptBalance } from "@/utils/useAptBalance";
import StakingCard from "./StakingCard";
import Image from "next/image";

export function StakingCards() {
  const { balance, loading } = useAptBalance();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StakingCard
        icon={
          <Image 
            src="/icons/irrbOSBA_400x400.png" 
            alt="Thala Protocol" 
            width={36} 
            height={36}
            className="rounded-full"
          />
        }
        title="Thala"
        description="Thala Labs is building DeFi infrastructure on Aptos."
        APTbalance={balance !== null ? balance.toFixed(4) : "0"}
        loading={loading}
      />
      <StakingCard
        icon={
          <Image 
            src="/icons/oj1pkVgf_400x400.png" 
            alt="Echo Protocol" 
            width={36} 
            height={36}
            className="rounded-full"
          />
        }
        title="Echo"
        description="High-performance on-chain order book exchange on Aptos."
        APTbalance={balance !== null ? balance.toFixed(4) : "0"}
        loading={loading}
      />
      <StakingCard
        icon={
          <Image 
            src="/icons/fG7oLzdd_400x400.jpg" 
            alt="Amnis Protocol" 
            width={36} 
            height={36}
            className="rounded-full"
          />
        }
        title="Amnis"
        description="Decentralized lending and borrowing protocol on Aptos."
        APTbalance={balance !== null ? balance.toFixed(4) : "0"}
        loading={loading}
      />
    </div>
  );
}

export default StakingCards; 