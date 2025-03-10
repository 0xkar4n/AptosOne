import { NextRequest, NextResponse } from 'next/server';
import llmAgent from "@/utils/llmAgent";
import axios from "axios";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { createAptosTools } from 'move-agent-kit';
import { aptosAgent } from '@/utils/aptosAgent';

const llm = new ChatGoogleGenerativeAI({
  temperature: 0.7,
  model: "gemini-2.0-flash", // Google's Gemini model
  // Optionally include your API key if not set via env variable:
  // googleApiKey: "YOUR_GOOGLE_API_KEY",
});


export async function POST(req: NextRequest) {
  try {
    
    const { prompt,userWalletAddress }=await req.json();
    const {agent:agentRuntime,signer,account}= await aptosAgent(userWalletAddress)
    const tools = createAptosTools(agentRuntime);
    console.log('Received request body:', prompt);

    if (!prompt.userInput) {
      return NextResponse.json({ error: 'No input provided' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
    }

    //const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
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

    // Configuration for the agent stream (e.g., thread tracking)
    const config = { configurable: { thread_id: "Aptos Agent Kit!" } };
  
    // Stream a command to fetch the top lending and borrowing pools
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

    // const data = await response.json();
    // console.log('Gemini API Response:', data);

    // if (!response.ok) {
    //   return NextResponse.json({ error: data.error || 'Failed to get response' }, { status: 500 });
    // }

    // const assistantReply = data.candidates?.[0]?.content?.parts?.map((part: { text: any; }) => part.text).join(' ') || 'Sorry, I couldn’t process that.';


    // return NextResponse.json({ response: assistantReply });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
