
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { AgentRuntime, LocalSigner, createAptosTools } from "move-agent-kit";

import { NextResponse } from "next/server";
import { aptosAgent } from "@/utils/aptosAgent";
import { JouleTopBorrowPools } from "@/custom-tools/joule-top-borrow-pool";
import { JouleTopLendPools } from "@/custom-tools/joule-top-lend-pool";
import { JouleAIHighApyStrategy } from "@/custom-tools/joule-ai-strategy";
import { TokenData } from "@/custom-tools/token-data";

const llm = new ChatGoogleGenerativeAI({
  temperature: 0.7,
  model: "gemini-2.0-flash",
});

const memorySaver = new MemorySaver(); // Persistent memory to maintain conversation context

export async function POST(req: Request) {
  try {
    const { prompt, userWalletAddress } = await req.json();
    console.log("req data in testing api ", prompt, userWalletAddress);
    
    const { agent: agentRuntime } = await aptosAgent(userWalletAddress);
    const defaultTools = createAptosTools(agentRuntime);
    const tools = [
      ...defaultTools,
      new JouleTopBorrowPools(agentRuntime),
      new JouleTopLendPools(agentRuntime),
      new JouleAIHighApyStrategy(agentRuntime),
      new TokenData(agentRuntime)

    ];

    const config = {
      configurable: {
        thread_id: "Aptos Agent Kit!",
        userWalletAddress: userWalletAddress,
      },
    };

    const agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memorySaver, // Ensures memory is persisted across requests
      messageModifier: `
        You are a helpful agent that can interact onchain using the Aptos Agent Kit.
        You can provide your wallet details and request funds from the user. If there is a 5XX error,
        ask the user to try again later. Maintain memory of past interactions to avoid redundant questions.
        Show APY values up to 2 decimal places.
        
        User wallet address is ${userWalletAddress} if needed.
        When returning token amounts, return them according to the token's decimals.
      `,
    });

    // Retrieve and update memory context automatically within the agent
    const stream = await agent.stream(
      {
        messages: [new HumanMessage(prompt)],
      },
      config
    );

    let resultText = "";
    for await (const chunk of stream) {
      if ("agent" in chunk) {
        resultText += "Agent:" + chunk.agent.messages[0].content + "\n";
      }
    }
    console.log(resultText);

    return NextResponse.json({ result: resultText });
  } catch (error: any) {
    console.error("An error occurred:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}