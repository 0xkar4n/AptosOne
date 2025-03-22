import axios from "axios";
import { Tool } from "langchain/tools";
import { AgentRuntime } from "move-agent-kit";

export class TokenData extends Tool {
  name = "coingecko_token_data";
  description = "Fetches the latest price and data of a specified token from CoinGecko. Requires a token ID as input.";

  constructor(private agent: AgentRuntime) {
    super();
  }

  protected async _call(tokenId: string): Promise<string> {
    try {
      if (!tokenId) {
        throw new Error("Token ID is required.");
      }

      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            ids: tokenId,
            vs_currencies: "usd",
            include_market_cap: true,
            include_24hr_vol: true,
            include_24hr_change: true,
            include_last_updated_at: true,
          },
        }
      );

      if (!response.data[tokenId]) {
        throw new Error("Invalid token ID or data not found.");
      }

      const tokenData = response.data[tokenId];

      return JSON.stringify({
        status: "success",
        tokenId,
        price: tokenData.usd,
        marketCap: tokenData.usd_market_cap || null,
        volume24h: tokenData.usd_24h_vol || null,
        priceChange24h: tokenData.usd_24h_change || null,
        lastUpdated: tokenData.last_updated_at ? new Date(tokenData.last_updated_at * 1000).toISOString() : null,
      });
    } catch (error: any) {
      return JSON.stringify({ status: "error", message: error.message, code: error.code || "UNKNOWN_ERROR" });
    }
  }
}