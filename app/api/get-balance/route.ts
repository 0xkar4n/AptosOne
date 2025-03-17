import { aptosAgent } from "@/utils/aptosAgent";

export const GET = async (req: Request) => {
  try {
    // Extract query parameter from the URL
    const { searchParams } = new URL(req.url);
    const userWalletAddress = searchParams.get("userWalletAddress");

    if (!userWalletAddress) {
      return Response.json({ error: "Missing userWalletAddress parameter" });
    }

    console.log("Fetching APT balance for:", userWalletAddress);

    // Get agent and wallet address
    const { agent } = await aptosAgent(userWalletAddress);
    const walletAddress = agent.account.getAddress();

    // Fetch APT balance
    const APTbalance = await agent.aptos.getAccountAPTAmount({
      accountAddress: walletAddress,
    });
    console.log("Raw APT Balance:", APTbalance);

    // Convert balance
    const finalAPTbalance = APTbalance / 1e8;
    console.log("Fetched APT balance:", finalAPTbalance);

    // Return the final balance as JSON
    return Response.json({ finalAPTbalance });
  } catch (error: any) {
    console.error("Error fetching APT balance:", error);
    return Response.json({ error: error.message });
  }
};
