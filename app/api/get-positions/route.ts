import llmAgent from "@/utils/llmAgent";
import { NextResponse } from "next/server";
import { HumanMessage } from "@langchain/core/messages";


export const GET = async(req:Request) => {
    // Extract query parameters: userWalletAddress and (optionally) strategy.
    const url = new URL(req.url);
    const userWalletAddress = url.searchParams.get("walletAddress");
    if (!userWalletAddress) {
      return NextResponse.json({ error: "Missing walletAddress parameter" }, { status: 400 });
    }

    try {
      const agent =await llmAgent(userWalletAddress);

      const prompt = `Get all of my joule positions and if no positions are there then tell No postions only if positions are there then send me that data only in json format of response:""`;

      

      const config = { configurable: { thread_id: "Get Positions" } };
      
      const stream = await agent.stream(
        {
          messages: [new HumanMessage(prompt)],
        },
        config
      );

      let resultText = "";
      for await (const chunk of stream) {
        if ("agent" in chunk) {
          resultText +=  "Agent:" + chunk.agent.messages[0].content + "\n";
        } else if ("tools" in chunk) {
          resultText += "Tool: " + chunk.tools.messages[0].content + "\n";
        }
      }
      console.log(resultText)

      
  
      return NextResponse.json({ resultText });
      
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