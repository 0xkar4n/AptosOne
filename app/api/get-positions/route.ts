import { NextResponse } from "next/server";
import { aptosAgent } from "@/utils/aptosAgent";


export const GET = async(req:Request) => {
    // Extract query parameters: userWalletAddress and (optionally) strategy.
    const url = new URL(req.url);
    const userWalletAddress = url.searchParams.get("walletAddress");
    console.log("usewallet address ",userWalletAddress)
    if (!userWalletAddress) {
      return NextResponse.json({ error: "Missing walletAddress parameter" }, { status: 400 });
    }

    try {
      const {agent} =await aptosAgent(userWalletAddress);
      const walletAddress = agent.account.getAddress();

      const allPositionsData = await agent.getUserAllPositions(walletAddress);
      console.log(allPositionsData)
      
  
      return NextResponse.json({ allPositionsData });
      
    } catch (error:any) {
      console.error("Error in POST handler:", error);
      return Response.json(
        {
          error: error.message,
          code: error.error_code || error.vm_error_code || null,
        },
        { status: 500 }
      );
    }

    


}