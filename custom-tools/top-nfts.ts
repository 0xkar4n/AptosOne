import { Tool } from "langchain/tools";
import axios from "axios";
import { AgentRuntime } from "move-agent-kit";

export class TopNfts extends Tool {
  name = "TopNfts";
  description = `Fetches the top NFT collections, ranked by highest one-day trading volume. 
                 Only provides requested information and omits links/URLs from the response.
                 The data that is received that needs to be shown till 8 decimals and the floor price, market cap and top bid should be in the units of APTs. `;

  constructor(private agent: AgentRuntime) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      console.log(`Fetching NFT data for: ${input || "Top 100 NFTs"}...`);

      const response = await axios.get(
        "https://aggregator-api.wapal.io/collection/popular?page=1&take=100&sortBy=ONE_D_VOLUME"
      );

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid API response format.");
      }

      let collections = response.data;

      if (input) {
        const filteredCollections = collections.filter((collection: any) =>
          collection.collectionName.toLowerCase().includes(input.toLowerCase())
        );

        if (filteredCollections.length === 0) {
          return JSON.stringify({ status: "error", message: `No NFT collection found for "${input}"` });
        }

        collections = filteredCollections;
      } else {
        collections = collections.slice(0, 100);
      }

      const nftDetails = collections.map((collection: any) => ({
        name: collection.collectionName,
        oneDayVolume: collection.oneDayVolume /(10000*10000),
        sevenDaysVolume: collection.sevenDaysVolume/(10000*10000),
        floorPrice: collection.floorPrice/(10000*10000),
        topBid: collection.topBid/(10000*10000),
        uniqueOwners: collection.uniqueOwnersCount,
        marketCap: collection.marketCap/(10000*10000),
        sevenDaysChangePercent : collection.sevenDaysChangePercent,
        oneDayChangePercent : collection.oneDayChangePercent,
        currentSupply: collection.currentSupply,
        uniqueOwnersCount : collection.uniqueOwnersCount,
        creatorAddress : collection.creatorAddress,
        allTimeVolume : collection.allTimeVolume,
        
      }));

      console.log(`NFT data fetched successfully for: ${input || "Top 100 NFTs"}`);

      return JSON.stringify({ status: "success", nftDetails });
    } catch (error: any) {
      console.error("Error fetching NFT data:", error.message);
      return JSON.stringify({
        status: "error",
        message: error.message,
        code: error.code || "UNKNOWN_ERROR",
      });
    }
  }
}
