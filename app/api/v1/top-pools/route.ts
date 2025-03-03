import { aptosAgent } from "@/utils/aptosAgent";
import getUserPosition from "@/utils/getUserPosition";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    
    const response = await axios.get("https://price-api.joule.finance/api/market");
    const allPoolDetails = response.data;
    const pools = allPoolDetails.data;


    

  
    // Process the data for lending pools (highest deposit APY)
    const topLendPools = pools
      .slice() 
      .sort((a:{depositApy: number}, b :{depositApy: number}) => b.depositApy - a.depositApy)
      .slice(0, 3)
      .map((pool: any) => ({
        name: pool.asset.assetName,
        icon: pool.asset.icon,
        tokenAddress: pool.asset.type,
        depositApy: pool.depositApy,
        extraDepositApy: pool.extraAPY ? pool.extraAPY.depositAPY : null,
      }));

    // Process the data for borrowing pools (lowest borrow APY)
    const topBorrowPools = pools
      .slice() 
      .sort((a: { borrowApy: number }, b: { borrowApy: number }) => a.borrowApy - b.borrowApy)
      .slice(0, 3)
      .map((pool: any) => ({
        name: pool.asset.assetName,
        icon: pool.asset.icon,
        tokenAddress: pool.asset.type,
        borrowApy: pool.borrowApy,
      }));

    return NextResponse.json({ topLendPools, topBorrowPools });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function POST(req:Request) {
  try {
    console.log("Inside post request in top-pools")
    const { action, amount, tokenAddress, fungibleAsset } = await req.json();

    // Initialize the agent from your Aptos agent helper
    const { agent } = await aptosAgent();

    // Get the user's position for this pool (if exists)
    const { positionId, newPosition } = await getUserPosition(agent, tokenAddress);

    // Call the appropriate function based on the action provided
    let transactionResult;
    if (action === "lend") {
      transactionResult = await agent.lendToken(
        amount,
        tokenAddress, // mint is the token address/MoveStructId
        positionId,
        newPosition,
        fungibleAsset || false
      );
    } else if (action === "borrow") {
      transactionResult = await agent.borrowToken(
        amount,
        tokenAddress, // mint is the token address/MoveStructId
        positionId,
        fungibleAsset || false
      );
    } else {
      return NextResponse.json({ error: "Invalid action provided" }, { status: 400 });
    }

    return NextResponse.json(transactionResult);

    
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  


}
