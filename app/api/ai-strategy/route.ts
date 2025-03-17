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
      console.log("pooldict created",poolsDict)


      const agent =await llmAgent(userWalletAddress);

      const prompt = `
We have the following Joule pool data: ${JSON.stringify(poolsDict, null, 2)}. Please analyze this information to determine the optimal and positive high apy strategy for 
maximizing yield when converting ${userStrategy} at the end user want the "to token" as the output token and "from token" as the input token. Consider all possible approaches such as direct lending, borrowing, multi-step lending and borrowing, 
and token swaps. Use your internal reasoning to decide the best method that yields the highest APY for the ${userStrategy}, but only provide your final 3 
recommendation along with the expected but concise effective yield use high apy for lending and low apy for borrowing with apy details of each step and calculation of the yeild in each step , without revealing any internal thought process and in JSON format.
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
          resultText +=    chunk.agent.messages[0].content + "\n";
        } else if ("tools" in chunk) {
          resultText += "Tool: " + chunk.tools.messages[0].content + "\n";
        }
      }

      const finalResult = JSON.parse(resultText.trim().slice(7).slice(0,-4));
      console.log(finalResult)
  
      return NextResponse.json({ finalResult });
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


export const POST = async(req:Request) => {
  try {
    const {userWalletAddress,amount,steps,description,investToken,netApy}=await req.json();

    if (!userWalletAddress || !amount || !steps || !investToken){
      return NextResponse.json({error: "Invalid fields"})
    }
    console.log(steps,description,"amount",amount,investToken)

    const agent =await llmAgent(userWalletAddress);
    const prompt = `  
      You are an expert blockchain automation agent with access to a meta-move-agent kit .
      Your task is to execute the following investment strategy step-by-step using the tool provided.
      
      Strategy: "${description}"
      
      Amount: ${amount} ${investToken}

      Steps:
      ${steps}
      
      Instructions:
      1. Execute each step sequentially. Do not proceed to the next step until the current step has been confirmed as successful and after 1st step decrease the amount=amount/2 for each next steps .
      2. For each step, use the appropriate joule tool  to perform the transaction (e.g., call "lendToken" for lending or "borrowToken" for borrowing).
      3. Check for success or failure after each transaction and include error handling.
      4. Return the results as a JSON object containing a list of transaction statuses and details for each step.
      
      
      Based on the above, execute all steps one by one using the provided tool.
      `;;

      const config = { configurable: { thread_id: "Execute_AI_Strategy" } };
      
      const stream = await agent.stream(
        {
          messages: [new HumanMessage(prompt)],
        },
        config
      );

      let resultText = "";
      for await (const chunk of stream) {
        if ("agent" in chunk) {
          resultText += "Agent:"  + chunk.agent.messages[0].content + "\n";
        } else if ("tools" in chunk) {
          resultText += "Tool: " + chunk.tools.messages[0].content + "\n";
        }
      }

      console.log(resultText)

  
      return NextResponse.json({ resultText });
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


    
    



    

  //   return NextResponse.json({
  //     success: true,
  //     id: `strategy_${Math.random().toString(36).substring(2, 10)}`,
  // })
    
  }

