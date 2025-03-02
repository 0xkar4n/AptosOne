import StakingCard from "./StakingCard";
import { Box, Lock, Settings } from "lucide-react";

export function StakingCards() {
  return (
    <ul className="flex gap-4">
      <StakingCard
        icon={<Box className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="Thala"
        description="Running out of copy so I'll write anything."
      />
      <StakingCard
        icon={<Settings className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="Echo"
        description="Yes, it's true. I'm not even kidding. Ask my mom if you don't believe me."
      />
      <StakingCard
        icon={<Lock className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="Amnis"
        description="It's the best money you'll ever spend"
      />
    </ul>
  );
}

export default StakingCards; 