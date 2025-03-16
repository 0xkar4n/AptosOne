import axios from "axios";
import { Tool } from "langchain/tools";
import { AgentRuntime } from "move-agent-kit";
import  llmAgent  from "@/utils/llmAgent"; // Import the LLM agent function

export class JouleAIHighApyStrategy extends Tool {
  name = "joule_ai_high_apy_strategy";
  description = `This tool analyzes lending and borrowing pools from Joule Finance and provides an optimal high APY strategy based on the user's wallet balance and strategy.
  
  **Input:**
    - strategy (string ): Strategy to analyze (e.g., "APT to USDT"). Default: "APT to USDT".
  
  **Output:**
    - The best APY strategy for maximizing yield.
  `;

  constructor(private agent: AgentRuntime) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      // Parse the input JSON string
      const { strategy = "APT to USDT" } = JSON.parse(input);

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
      
      const prompt = `
We have the following Joule pool data: ${JSON.stringify(poolsDict, null, 2)}. Please analyze this information to determine the optimal and positive high apy strategy for 
maximizing yield when converting ${strategy}. Consider all possible approaches such as direct lending, borrowing, multi-step lending and borrowing, 
and token swaps. Use your internal reasoning to decide the best method that yields the highest APY for the ${strategy}, but only provide your final 3 
recommendation along with the expected but concise effective yield use high apy for lending and low apy for borrowing with apy details of each step and calculation of the yeild in each step , without revealing any internal thought process and in JSON format.
`;;

const getPromptRes = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,{  
    "contents": [{
      "parts":[{"text": prompt}]
    }]
});


console.log("AI Response:", getPromptRes.data["candidates"][0]["content"]["parts"][0]["text"]);

const finalResult = getPromptRes.data["candidates"][0]["content"]["parts"][0]["text"]
       


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
