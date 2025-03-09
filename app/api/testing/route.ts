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

      const { prompt,userWalletAddress }=await req.json()
      console.log("req data in testing api ",prompt,userWalletAddress)
        const {agent:agentRuntime,signer,account}= await aptosAgent(userWalletAddress)
      

      
  
      // Create the tools object by merging default tools with your custom TopApyTool
     // const tools = [
      //  ...createAptosTools(agentRuntime),
    //   new TopApyTool(agentRuntime),
      //];

      const tools = createAptosTools(agentRuntime);

  
      // Initialize the language model and memory saver
      //const llm = new ChatAnthropic({ model: "claude-3-sonnet-20240229" });
      const memorySaver = new MemorySaver();
  
      // Create the agent with a message modifier that instructs it to use the top pool tool when needed
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
  
      // Configuration for the agent stream (e.g., thread tracking)
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
          resultText += "Agent: " + chunk.agent.messages[0].content + "\n";
        } else if ("tools" in chunk) {
          resultText += "Tool: " + chunk.tools.messages[0].content + "\n";
        }
        resultText += "-------------------\n";
      }
  
      return NextResponse.json({ result: resultText });
    } catch (error: any) {
      console.error("An error occurred:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  