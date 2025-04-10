import { aptosAgent } from "@/utils/aptosAgent";
import getUserPosition from "@/utils/getUserPosition";
import llmAgent from "@/utils/llmAgent";
import axios from "axios";
import { NextResponse } from "next/server";
import { HumanMessage } from "@langchain/core/messages";

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
        ltv: pool.asset.ltv ? Number(pool.asset.ltv) : null, // New LTV mapping
      }));
      
    // Process the data for borrowing pools (lowest borrow APY)
    const topBorrowPools = pools
      .slice()
      .sort((a: any, b: any) => a.borrowApy - b.borrowApy)
      .slice(0, 3)
      .map((pool: any) => ({
        name: pool.asset.assetName,
        icon: pool.asset.icon,
        tokenAddress: pool.asset.type,
        borrowApy: pool.borrowApy,
        ltv: pool.asset.ltv ? Number(pool.asset.ltv) : null, // New LTV mapping
      }));
  
    return NextResponse.json({ topLendPools, topBorrowPools });
  } catch (error: any) {
    if (error.message?.includes(`Can't derive account`)) {
      return Response.json(
        {
          error: "Please fund your AptosOne wallet before proceeding",
          code: "WALLET_FUNDING_REQUIRED",
        },
        { status: 400 }
      );
    }else{
      return Response.json(
        {
          error: error.message,
          code: error.error_code || error.vm_error_code || null,
        },
        { status: 500 }
      );
    
    }
  }
}


export async function POST(req:Request) {
  try {
    const { action, amount, tokenAddress,title, userWalletAddress } = await req.json();
    const agent = await llmAgent(userWalletAddress);
    const config = { configurable: { thread_id: "Top-Pools" } };
  
    const prompt = `please ${action} amount ${amount} to token ${title} having  address ${tokenAddress} on Joule having mint address as ${tokenAddress} creating a fresh position with whatever position id you would like you can create  and if user dont have balance or fees send the error Message`;
    const stream = await agent.stream(
      {
        messages: [new HumanMessage(prompt)],
      },
      config
    );
  
    // Collect the streamed response into a string
    let resultText = "";
    for await (const chunk of stream) {
      if ("agent" in chunk) {
        resultText += "Agent: " + chunk.agent.messages[0].content + "\n";
      } else if ("tools" in chunk) {
        resultText += "Tool: " + chunk.tools.messages[0].content + "\n";
      }
      resultText += "-------------------\n";
    }
  
    return NextResponse.json({ result: resultText });
    
  } catch (error: any) {
    if (error.message?.includes(`Can't derive account`)) {
      return Response.json(
        {
          error: "Please fund your AptosOne wallet before proceeding",
          code: "WALLET_FUNDING_REQUIRED",
        },
        { status: 400 }
      );
    }else{
      return Response.json(
        {
          error: error.message,
          code: error.error_code || error.vm_error_code || null,
        },
        { status: 500 }
      );
    
    }
  }

}
