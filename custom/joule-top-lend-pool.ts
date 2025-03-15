import axios from "axios";
import { Tool } from "langchain/tools";
import { AgentRuntime } from "move-agent-kit";

export class JouleTopLendPools extends Tool {
  name = "joule_top_lend_pools";
  description = `Fetches the top 3 lending pools from Joule Finance, ranked by the highest total APY (deposit APY + extra deposit APY + staking APY). No input is required.`;

  constructor(private agent: AgentRuntime) {
    super();
  }

  protected async _call(): Promise<string> {
    try {
      const response = await axios.get("https://price-api.joule.finance/api/market");
      const pools = response.data.data;

      const topLendPools = pools
        .slice()
        .sort((a: any, b: any) => {
          const aTotalApy = Number(a.depositApy) + (a.extraAPY?.depositAPY || 0) + (a.extraAPY?.stakingAPY || 0);
          const bTotalApy = Number(b.depositApy) + (b.extraAPY?.depositAPY || 0) + (b.extraAPY?.stakingAPY || 0);
          return bTotalApy - aTotalApy;
        })
        .slice(0, 3)
        .map((pool: any) => ({
          name: pool.asset.assetName,
          depositApy: pool.depositApy,
          extraDepositApy: pool.extraAPY?.depositAPY || null,
          stakingAPY: pool.extraAPY?.stakingAPY || null,
          totalApy: Number(pool.depositApy) + (pool.extraAPY?.depositAPY || 0) + (pool.extraAPY?.stakingAPY || 0),
          ltv: pool.asset.ltv ? Number(pool.asset.ltv) : null,
        }));

      return JSON.stringify({ status: "success", topLendPools });
    } catch (error: any) {
      return JSON.stringify({ status: "error", message: error.message, code: error.code || "UNKNOWN_ERROR" });
    }
  }
}
