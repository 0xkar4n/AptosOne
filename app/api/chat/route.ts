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


const llm = new ChatGoogleGenerativeAI({
temperature: 0.7,
model: "gemini-2.0-flash", // Google's Gemini model
// Optionally include your API key if not set via env variable:
// googleApiKey: "YOUR_GOOGLE_API_KEY",
});



export async function POST(req: Request) {
  try {
    debugger
    const { prompt,userWalletAddress }=await req.json()
    console.log("req data in testing api ",prompt,userWalletAddress)
      const {agent:agentRuntime,signer,account}= await aptosAgent(userWalletAddress)
    console.log("Derived account",account);
    const tools = createAptosTools(agentRuntime);
    const memorySaver = new MemorySaver();
    const agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memorySaver,
      messageModifier: `
        You are an agent that interacts with the Aptos blockchain using the move-agent-kit.
        The response also contains token/token[] which contains the name and address of the token and the decimals.
        WHEN YOU RETURN ANY TOKEN AMOUNTS, RETURN THEM ACCORDING TO THE DECIMALS OF THE TOKEN.
      `,
    });

    const config = { configurable: { thread_id: "Aptos Agent Kit!" } };

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
        resultText += "" + chunk.agent.messages[0].content + "\n";
      } else if ("tools" in chunk) {
        resultText += "Tool: " + chunk.tools.messages[0].content + "\n";
      }
    }

    return NextResponse.json({ result: resultText });
  } catch (error: any) {
    console.error("An error occurred:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}