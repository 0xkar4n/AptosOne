import { Tool } from "langchain/tools";
import { AgentRuntime, createAptosTools } from "move-agent-kit";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";


export class JouleExecuteStrategy extends Tool {
  name = "joule_execute_strategy";
  description = `This tool executes an investment strategy step-by-step using the Aptos Agent Kit.
  
  **Input:**
    - amount (number): The initial amount to invest.
    - steps (string[]): List of steps to execute (e.g., "Lend APT", "Borrow USDT").
    - description (string): Description of the investment strategy.
    - investToken (string): The token being invested.
    - netApy (number, optional): The net APY expectation.
  
  **Output:**
    - JSON object containing transaction results for each step.`;

  constructor(private agentRuntime: AgentRuntime) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const { amount, steps, description, investToken, netApy } = JSON.parse(input);

      if ( !amount || !steps || !investToken) {
        return JSON.stringify({ error: "Invalid fields" });
      }

      console.log("Executing strategy for:", steps, amount, investToken);

      
    const llm = new ChatGoogleGenerativeAI({
        temperature: 0.7,
        model: "gemini-2.0-flash", 
      });
      
      const tools = createAptosTools(this.agentRuntime);

      // **Create React Agent**
      const agent = createReactAgent({
        llm, 
        tools, 
        messageModifier: `
         You are an agent that interacts with the Aptos blockchain using the move-agent-kit.
          The response also contains token/token[] which contains the name and address of the token and the decimals.
		      WHEN YOU RETURN ANY TOKEN AMOUNTS, RETURN THEM ACCORDING TO THE DECIMALS OF THE TOKEN.
        `,
      });

      const prompt = `  
        You are an expert blockchain automation agent with access to a meta-move-agent kit.
        Your task is to execute the following investment strategy step-by-step using the tool provided.
        
        Strategy: "${description}"
        
        Amount: ${amount} ${investToken}
        
        Steps:
        ${steps}
        
        Instructions:
        1. Execute each step sequentially. Do not proceed to the next step until the current step has been confirmed as successful.
        2. After the first step, divide the amount by 2 for each subsequent step.
        3. For each step, use the appropriate Joule tool to perform the transaction (e.g., call "lendToken" for lending or "borrowToken" for borrowing).
        4. Check for success or failure after each transaction and include error handling.
        5. Return the results as a JSON object containing a list of transaction statuses and details for each step.
      `;

     

      // **Stream Execution**
      const stream = await agent.stream(
        {
          messages: [{ role: "user", content: prompt }],
        },
      );

      let resultText = "";
      for await (const chunk of stream) {
        if ("agent" in chunk) {
          resultText += "Agent: " + chunk.agent.messages[0].content + "\n";
        } else if ("tools" in chunk) {
          resultText += "Tool: " + chunk.tools.messages[0].content + "\n";
        }
      }

      console.log("Execution Result:", resultText);

      return JSON.stringify({ status: "success", execution: resultText });
    } catch (error: any) {
      console.error("Error in Joule Execute Strategy Tool:", error);
      return JSON.stringify({
        status: "error",
        message: error.message,
        code: error.code || "UNKNOWN_ERROR",
      });
    }
  }
}
