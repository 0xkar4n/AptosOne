import { AgentRuntime} from "move-agent-kit";

async function getUserPosition(
    agent: AgentRuntime,
    tokenAddress: string
  ): Promise<{ positionId: string; newPosition: boolean }> {
    // Replace this pseudo-code with your actual logic to fetch positions (e.g., via agent.account.getPositions())
    const walletAddress=await agent.account.getAddress()
    console.log(walletAddress)
    const positions: Array<{ tokenAddress: string; positionId: string }> = await agent.getUserAllPositions(walletAddress);
    console.log(positions)
    const userPosition = positions.find((pos) => pos.tokenAddress === tokenAddress);
    if (userPosition) {
      return { positionId: userPosition.positionId, newPosition: false };
    }
    // If no position exists for this pool, default to "1" and mark it as a new position
    return { positionId: "1", newPosition: true };
  }

  export default getUserPosition;