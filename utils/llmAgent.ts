import { AgentRuntime, createAptosTools, LocalSigner } from "move-agent-kit";
import { Aptos, AptosConfig, Ed25519PrivateKey, Network, PrivateKey, PrivateKeyVariants } from "@aptos-labs/ts-sdk";
import decryptKey from "./decryptKey";
import { NextResponse } from "next/server";
import { prisma } from "./prisma";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llmAgent = async(userWalletAddress:string) => {
    console.log(userWalletAddress)

    const record = await prisma.userWallet.findUnique({
        where: { walletAddress: userWalletAddress },
      });
  

      if (!record) {
        throw new Error("No record found for the provided userWalletAddress");
      }
    
    console.log(record)


    const llm = new ChatGoogleGenerativeAI({
        temperature: 0.7,
        model: "gemini-2.0-flash", 
      });
     

    const aptosConfig = new AptosConfig({ network: Network.MAINNET });
    const aptos = new Aptos(aptosConfig);

    const privateKeyStr = decryptKey(record.encryptedPrivateKey);
    console.log(privateKeyStr)
    if (!privateKeyStr) {
      throw new Error("Missing APTOS_PRIVATE_KEY environment variable");
    }

    const account = await aptos.deriveAccountFromPrivateKey({
        privateKey: new Ed25519PrivateKey(
          PrivateKey.formatPrivateKey(privateKeyStr, PrivateKeyVariants.Ed25519)
        ),
      });
    
      const signer = new LocalSigner(account, Network.MAINNET);
      const agentRuntime = new AgentRuntime(signer, aptos);

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

      return agent;

  
}

export default llmAgent