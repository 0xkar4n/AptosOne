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
  .sort((a: any, b: any) => {
    const aDeposit = Number(a.depositApy);
    const aExtra = a.extraAPY ? Number(a.extraAPY.depositAPY) : 0;
    const aStaking = a.extraAPY ? Number(a.extraAPY.stakingAPY) : 0;
    const aTotalApy = aDeposit + aExtra + aStaking;

    const bDeposit = Number(b.depositApy);
    const bExtra = b.extraAPY ? Number(b.extraAPY.depositAPY) : 0;
    const bStaking = b.extraAPY ? Number(b.extraAPY.stakingAPY) : 0;
    const bTotalApy = bDeposit + bExtra + bStaking;

    return bTotalApy - aTotalApy;
  })
  .slice(0, 3)
  .map((pool: any) => ({
    name: pool.asset.assetName,
    icon: pool.asset.icon,
    tokenAddress: pool.asset.type,
    depositApy: pool.depositApy,
    extraDepositApy: pool.extraAPY ? pool.extraAPY.depositAPY : null,
    stakingAPY: pool.extraAPY ? pool.extraAPY.stakingAPY : null,
    totalApy: Number(pool.depositApy) +
      (pool.extraAPY ? Number(pool.extraAPY.depositAPY) : 0) +
      (pool.extraAPY ? Number(pool.extraAPY.stakingAPY) : 0),
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
