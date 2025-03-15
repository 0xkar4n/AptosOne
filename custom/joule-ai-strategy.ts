import axios from "axios";
import { Tool } from "langchain/tools";
import { AgentRuntime } from "move-agent-kit";
import  llmAgent  from "@/utils/llmAgent"; // Import the LLM agent function

export class JouleAIHighApyStrategy extends Tool {
  name = "joule_ai_high_apy_strategy";
  description = `This tool analyzes lending and borrowing pools from Joule Finance and provides an optimal high APY strategy based on the user's wallet balance and strategy.
  
  **Input:**
    - walletAddress (string): User's Aptos wallet address.
    - strategy (string, optional): Strategy to analyze (e.g., "APT to USDT"). Default: "APT to USDT".
  
  **Output:**
    - A JSON object with the best APY strategy for maximizing yield.
  `;

  constructor(private agent: AgentRuntime) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      // Parse the input JSON string
      const { walletAddress, strategy = "APT to USDT" } = JSON.parse(input);

      if (!walletAddress) {
        return JSON.stringify({ error: "Missing walletAddress parameter" });
      }

      console.log("Fetching strategy data for:", walletAddress, strategy);

      // Fetch Joule market data
      const response = await axios.get("https://price-api.joule.finance/api/market");
      const poolsArray = response.data.data;

      if (!Array.isArray(poolsArray)) {
        throw new Error("Invalid pool data format from Joule API");
      }

      // Build a dictionary of pools based on asset names
      const poolsDict: Record<string, { totalAPY: number; borrowAPY: number }> = {};
      poolsArray.forEach((pool: any) => {
        const assetName = pool.asset?.assetName;
        if (assetName) {
          poolsDict[assetName] = {
            totalAPY: pool.depositApy,
            borrowAPY: pool.borrowApy,
          };
        }
      });

      console.log("Joule Pool Data:", poolsDict);

      // Create an AI Agent to analyze the best APY strategy
      const agent = await llmAgent(walletAddress);
      const prompt = `
We have the following Joule pool data: ${JSON.stringify(poolsDict, null, 2)}. 
Analyze this information to determine the optimal and highest APY strategy for maximizing yield when converting ${strategy}. 
Consider:
  - Direct lending
  - Borrowing
  - Multi-step lending & borrowing
  - Token swaps

Provide the **top 3 recommendations** with:
  - APY details for each step
  - Yield calculations for each step
  - The final **effective yield**
  
Return the result **only** in structured JSON format.
`;

      const config = { configurable: { thread_id: "AI Strategy" } };
      const stream = await agent.stream(
        {
          messages: [{ role: "user", content: prompt }],
        },
        config
      );

      let resultText = "";
      for await (const chunk of stream) {
        if ("agent" in chunk) {
          resultText += chunk.agent.messages[0].content + "\n";
        } else if ("tools" in chunk) {
          resultText += "Tool: " + chunk.tools.messages[0].content + "\n";
        }
      }

      const finalResult = JSON.parse(resultText.trim().slice(7).slice(0, -4));
      console.log("Final APY Strategy:", finalResult);

      return JSON.stringify({ status: "success", strategy: finalResult });
    } catch (error: any) {
      console.error("Error in AI APY Strategy Tool:", error);
      return JSON.stringify({
        status: "error",
        message: error.message,
        code: error.code || "UNKNOWN_ERROR",
      });
    }
  }
}
