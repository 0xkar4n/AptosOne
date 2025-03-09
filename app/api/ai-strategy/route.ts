import llmAgent from "@/utils/llmAgent";
import axios from "axios";
import { NextResponse } from "next/server";
import { HumanMessage } from "@langchain/core/messages";


type PoolData = {
    totalAPY: number;
    borrowAPY: number;
  };
  
  type PoolInfo = {
    totalAPY: number;
    borrowAPY: number;
  };

  type CalculationResult = {
    strategy: string;
    pools: Record<string, PoolData>;
    geminiData: any;
    // You can add further calculated fields here as needed.
  };
  


  export const GET = async(req:Request) => {
   // Extract query parameters: userWalletAddress and (optionally) strategy.
   const url = new URL(req.url);
   const userWalletAddress = url.searchParams.get("walletAddress");
   if (!userWalletAddress) {
     return NextResponse.json({ error: "Missing walletAddress parameter" }, { status: 400 });
   }
   const userStrategy = url.searchParams.get("strategy") || "APT to USDT";


   console.log("AI STRATEGY data we got",userWalletAddress,userStrategy)
 

  
  
    try {
      const response = await axios.get("https://price-api.joule.finance/api/market");
      const poolsArray = response.data.data;

      console.log("got the response from joule")
  
      if (!Array.isArray(poolsArray)) {
        throw new Error("Invalid pool data format from Joule API");
      }
  
      // Build a dictionary of pools keyed by asset name.
      // Note: If there are duplicate asset names (as with USDC in this case),
      // the later entry will override the earlier one.
      const poolsDict: Record<string, PoolInfo> = {};
      poolsArray.forEach((pool: any) => {
        const assetName = pool.asset?.assetName;
        if (assetName) {
          poolsDict[assetName] = {
            totalAPY: pool.depositApy,
            borrowAPY: pool.borrowApy,
          };
        }
      });
      console.log("pooldict created")


      const agent =await llmAgent(userWalletAddress);

      const prompt = `
      We have the following pool data:
      ${JSON.stringify(poolsDict, null, 2)}
      
      The user strategy is: "${userStrategy}"
      
      Please analyze this data and determine the best APY approach for converting APT to USDT.
      Consider:
      - Whether to lend directly, borrow, or use a multi-step strategy involving both lending and borrowing.
      - The impact of the LTV values.
      Provide your chain-of-thought reasoning before recommending the final strategy along with the expected APY.
      `;

      const config = { configurable: { thread_id: "AI Strategy" } };
      
      const stream = await agent.stream(
        {
          messages: [new HumanMessage(prompt)],
        },
        config
      );

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
    }
    catch(error: any){
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