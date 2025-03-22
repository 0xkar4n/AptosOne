import axios from "axios";
import { Tool } from "langchain/tools";
import { AgentRuntime } from "move-agent-kit";

export class JouleTopBorrowPools extends Tool {
  name = "joule_top_borrow_pools";
  description = `Fetches the top 3 borrowing pools from Joule Finance, ranked by the lowest borrow APY. No input is required.`;

  constructor(private agent: AgentRuntime) {
    super();
  }

  protected async _call(): Promise<string> {
    try {
      const response = await axios.get("https://price-api.joule.finance/api/market");
      const pools = response.data.data;

      const topBorrowPools = pools
        .slice()
        .sort((a: any, b: any) => Number(a.borrowApy) - Number(b.borrowApy))
        .slice(0, 3)
        .map((pool: any) => ({
          name: pool.asset.assetName,
          borrowApy: pool.borrowApy,
          ltv: pool.asset.ltv ? Number(pool.asset.ltv) : null,
        }));

      return JSON.stringify({ status: "success", topBorrowPools });
    } catch (error: any) {
      return JSON.stringify({ status: "error", message: error.message, code: error.code || "UNKNOWN_ERROR" });
    }
  }
}
