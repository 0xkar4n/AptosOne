import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { AgentRuntime, LocalSigner, createAptosTools } from "move-agent-kit";

import { NextResponse } from "next/server";
import { aptosAgent } from "@/utils/aptosAgent";


export const POST = async (req: Request) => {
    

}