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
      .sort((a, b) => b.depositApy - a.depositApy)
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
      .sort((a, b) => a.borrowApy - b.borrowApy)
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
