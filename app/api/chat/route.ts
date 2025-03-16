import {
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  HexInput,
  Network,
  PrivateKey,
  PrivateKeyVariants,
} from "@aptos-labs/ts-sdk";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { AgentRuntime, LocalSigner, createAptosTools } from "move-agent-kit";

import { NextResponse } from "next/server";
import { aptosAgent } from "@/utils/aptosAgent";
import { JouleTopBorrowPools } from "@/custom/joule-top-borrow-pool";
import { JouleTopLendPools } from "@/custom/joule-top-lend-pool";
import { JouleAIHighApyStrategy } from "@/custom/joule-ai-strategy";


const llm = new ChatGoogleGenerativeAI({
temperature: 0.7,
model: "gemini-2.0-flash", // Google's Gemini model
// Optionally include your API key if not set via env variable:
// googleApiKey: "YOUR_GOOGLE_API_KEY",
});



export async function POST(req: Request) {
  try {
    
    const { prompt,userWalletAddress }=await req.json()
    console.log("req data in testing api ",prompt,userWalletAddress)
      const {agent:agentRuntime}= await aptosAgent(userWalletAddress)

    const defaultTools = createAptosTools(agentRuntime);
    const tools = [...defaultTools, new JouleTopBorrowPools(agentRuntime),new JouleTopLendPools(agentRuntime),new JouleAIHighApyStrategy(agentRuntime)];

    const memorySaver = new MemorySaver();
    const agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memorySaver,
      messageModifier: `
        You are a helpful agent that can interact onchain using the Aptos Agent Kit. You are
        empowered to interact onchain using your tools. you can provide your wallet details and request funds from the user. If there is a 5XX
        (internal) HTTP error code, ask the user to try again later. If someone asks you to do something you
        can't do with your currently available tools, you must say so, and encourage them to implement it
        themselves using the Aptos Agent Kit
        show the apy till 2 digit 
        User wallet address is ${userWalletAddress} if you needed 
       
		The response also contains token/token[] which contains the name and address of the token and the decimals.
		WHEN YOU RETURN ANY TOKEN AMOUNTS, RETURN THEM ACCORDING TO THE DECIMALS OF THE TOKEN.
      `,
    });

    const config = { configurable: { thread_id: "Aptos Agent Kit!" ,  userWalletAddress: userWalletAddress} };

    // Stream a command to fetch the top lending and borrowing pools
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
        resultText += "Agent:" + chunk.agent.messages[0].content + "\n";
      } 
    }
    console.log(resultText)

    return NextResponse.json({ result: resultText });
  } catch (error: any) {
    console.error("An error occurred:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}