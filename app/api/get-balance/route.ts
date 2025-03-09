import { aptosAgent } from "@/utils/aptosAgent";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export const POST = async(req:Request) => {
    try {
        const {userWalletAddress}= await req.json()
        console.log("Fetching APT balance for:");
        const { agent } = await aptosAgent(userWalletAddress);
        const walletAddress= agent.account.getAddress();
        const APTbalance = await agent.aptos.getAccountAPTAmount({
          accountAddress: walletAddress,
        });

        const finalAPTbalance=APTbalance/1e8;
        console.log("Fetched APT balance:", finalAPTbalance);
        return Response.json({finalAPTbalance});
      } catch (error) {
        console.error("Error fetching APT balance:", error);
        return Response.json({error});
      }
   
}
