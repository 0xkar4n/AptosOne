import 'dotenv/config';
import { Client, GatewayIntentBits, Events, ChannelType, Partials } from 'discord.js';
import { HumanMessage } from '@langchain/core/messages';
import { MemorySaver } from '@langchain/langgraph';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { AgentRuntime, createAptosTools, LocalSigner } from "move-agent-kit";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Aptos, AptosConfig, Ed25519PrivateKey, Network, PrivateKey, PrivateKeyVariants } from "@aptos-labs/ts-sdk";
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

const client = new Client({
  intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages],
  partials: [Partials.Message, Partials.Channel],
});

const chatHistory = new Map();
const userState = new Map(); // Track user interaction state

// User states
enum UserState {
  INITIAL = 'initial',
  WAITING_FOR_WALLET = 'waiting_for_wallet',
  AUTHENTICATED = 'authenticated'
}

async function initializeAgent(walletAddress?: string, privateKey?: string) {
  try {
    const llm = new ChatGoogleGenerativeAI({
      temperature: 0.7,
      model: "gemini-2.0-flash", 
    });

    const aptosConfig = new AptosConfig({ network: Network.MAINNET });
    const aptos = new Aptos(aptosConfig);
    
    const privateKeyStr = privateKey ;
    if (!privateKeyStr) {
      throw new Error("Missing private key");
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

    const config = { configurable: { thread_id: 'Move Agent Kit!' } };

    const agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memorySaver,
      messageModifier: `
        You are a helpful agent that can interact onchain using the Move Agent Kit. You are
        empowered to interact onchain using your tools. If you ever need funds, you can request them from the
        faucet. Otherwise, you can provide your wallet details and request funds from the user. If there is a 5XX
        (internal) HTTP error code, ask the user to try again later. If someone asks you to do something you
        can't do with your currently available tools, you must say so, and encourage them to implement it
        themselves using the Move Agent Kit. For more information, please visit https://metamove.build/move-agent-kit. Be
        concise and helpful with your responses. Refrain from restating your tools' descriptions unless explicitly requested.

        ${walletAddress ? `You are currently using wallet address: ${walletAddress}` : ''}
      `,
    });

    return { agent, config };
  } catch (error) {
    console.error('Failed to initialize agent:', error);
    throw error;
  }
}

client.on(Events.ClientReady, async () => {
  await client.application?.fetch();
  console.info(`${client.user?.username || 'Bot'} is running. Send it a message in Discord DM to get started.`);
});

client.on(Events.MessageCreate, async (message: any) => {
  try {
    if (message.channel.type !== ChannelType.DM || message.author.bot) return;

    console.info(`Received message: ${message.content}`);
    await message.channel.sendTyping();

    const userId = message.author.id;
    
    // Initialize chat history if it doesn't exist
    if (!chatHistory.has(userId)) {
      chatHistory.set(userId, []);
    }
    
    // Initialize user state if it doesn't exist
    if (!userState.has(userId)) {
      userState.set(userId, UserState.INITIAL);
    }

    const userChatHistory = chatHistory.get(userId);
    const currentState = userState.get(userId);
    
    if (currentState === UserState.INITIAL) {
      const userWallet = await prisma.userWallet.findFirst({
        where: {
          discordUserId: userId
        }
      });

      if (!userWallet) {
        await message.reply("Welcome! Before we begin, please share your wallet address so I can help you with your on-chain interactions.");
        userState.set(userId, UserState.WAITING_FOR_WALLET);
        return;
      } else {
        userState.set(userId, UserState.AUTHENTICATED);
        return processAuthenticatedMessage(message, userId, userWallet.walletAddress, userWallet.encryptedPrivateKey);
      }
    }
    
    if (currentState === UserState.WAITING_FOR_WALLET) {
      const potentialWalletAddress = message.content.trim();
      
      if (potentialWalletAddress.startsWith('0x') && potentialWalletAddress.length >= 40) {
        const walletDetails = await prisma.userWallet.findUnique({
          where: {
            walletAddress: potentialWalletAddress
          }
        });
        
        if (walletDetails) {
          // Wallet found, associate with user by updating the discordUserId
          await prisma.userWallet.update({
            where: {
              walletAddress: potentialWalletAddress
            },
            data: {
              discordUserId: userId
            }
          });
          
          userState.set(userId, UserState.AUTHENTICATED);
          
          await message.reply("Wallet authenticated! I'm now ready to assist you with your on-chain interactions.");
          
         
          await message.reply("What would you like to do with your wallet? You can ask about your balance, send tokens, or interact with contracts.");
          
          return;
        } else {
          // Wallet not found
          await message.reply("I couldn't find this wallet in our system. Please visit our website at https://metamove.build to create a wallet first, then come back here.");
          return;
        }
      } else {
        // Invalid wallet format
        await message.reply("That doesn't look like a valid wallet address. Please provide a valid Aptos wallet address.");
        return;
      }
    }
    
    // If user is already authenticated, process the message
    if (currentState === UserState.AUTHENTICATED) {
      const userWallet = await prisma.userWallet.findFirst({
        where: {
          discordUserId: userId
        }
      });
      
      if (userWallet) {
        return processAuthenticatedMessage(message, userId, userWallet.walletAddress, userWallet.encryptedPrivateKey);
      } else {
        // This should not happen normally, but handle edge case
        userState.set(userId, UserState.INITIAL);
        await message.reply("I couldn't find your wallet information. Let's start over. Please share your wallet address.");
        userState.set(userId, UserState.WAITING_FOR_WALLET);
        return;
      }
    }
    
  } catch (error) {
    console.error('Error handling message:', error);
    await message.reply("Sorry, I encountered an error. Please try again later.");
  }
});

async function processAuthenticatedMessage(message: any, userId: string, walletAddress: string, encryptedPrivateKey: string) {
  const userChatHistory = chatHistory.get(userId);
  
  if (message.content.trim() !== '') {
    userChatHistory.push(new HumanMessage(message.content));
  } else {
    console.error('Received an empty message. Ignoring.');
    return;
  }

  const privateKey = decryptPrivateKey(encryptedPrivateKey);

  // Initialize agent with the user's wallet information
  const { agent, config } = await initializeAgent(walletAddress, privateKey);

  try {
    const stream = await agent.stream({ messages: userChatHistory }, config);

    let resultText = "";
    for await (const chunk of stream) {
      if ("agent" in chunk) {
        resultText += "Agent:" + chunk.agent.messages[0].content + "\n";
      }
    }
    console.log(resultText);

    function getSubstringAfterNthOccurrence(str: string, delimiter: string, n: number) {
      let pos = -1;
      for (let i = 0; i < n; i++) {
        pos = str.indexOf(delimiter, pos + 1);
        if (pos === -1) {
          return ""; // Return empty string if the delimiter doesn't occur n times
        }
      }
      return str.substring(pos + delimiter.length);
    }
    
    const messageToSend = getSubstringAfterNthOccurrence(resultText, "Agent:", 2).trim();
    
    if (messageToSend) {
      await message.reply(messageToSend);
      userChatHistory.push(new HumanMessage(messageToSend));
    } else {
      
      const firstResponse = getSubstringAfterNthOccurrence(resultText, "Agent:", 1).trim();
      if (firstResponse) {
        await message.reply(firstResponse);
        userChatHistory.push(new HumanMessage(firstResponse));
      } else {
        console.error("No agent response found in resultText.");
        await message.reply("I'm ready to help with your Aptos wallet. What would you like to do?");
      }
    }
  } catch (error) {
    console.error('Error in agent processing:', error);
    await message.reply("I encountered an issue processing your request. Please try again.");
  }
}

// Function to decrypt the private key - you'll need to implement this
function decryptPrivateKey(encryptedPrivateKey: string): string {
  const algorithm = "aes-256-cbc";
  const encryptionPassword = process.env.ENCRYPTION_PASSWORD;
  if (!encryptionPassword) {
    throw new Error("ENCRYPTION_PASSWORD environment variable is not set.");
  }

  const key = crypto.scryptSync(encryptionPassword, "salt", 32);
  // Split the stored string into IV and encrypted content
  const parts = encryptedPrivateKey.split(":");
  if (parts.length !== 2) {
    throw new Error("Invalid encrypted text format");
  }
  const iv = Buffer.from(parts[0], "hex");
  const encrypted = parts[1];

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// Connect to Discord
client.login(process.env.DISCORD_BOT_TOKEN);