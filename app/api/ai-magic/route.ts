import axios from "axios";

type PoolData = {
    totalAPY: number;
    borrowAPY: number;
  };
  
  type PoolInfo = {
    totalAPY: number;
    borrowAPY: number;
  };

  type CalculationResult = {
    strategy: string;
    pools: Record<string, PoolData>;
    geminiData: any;
    // You can add further calculated fields here as needed.
  };
  
  export const GET = async(req:Request) => {
  
    //const { strategy } = await req.json();
    //if (!strategy || typeof strategy !== "string") {
    //  return Response.json({ error: "Strategy input is required"}, { status: 400 } );
    //}
  
    try {
        const response = await axios.get("https://price-api.joule.finance/api/market");
    const allPoolDetails = response.data;
    const pools = allPoolDetails.data;

    console.log(pools)
    
        //if (!Array.isArray(pools)) {
        //  throw new Error("Invalid pool data format from Joule API");
        //}
    
        // 2. Build a dictionary of pools keyed by asset name.
        
        // 3. Return the dictionary only.
        return Response.json(pools);
    }
    catch(error: any){
        console.error("Error in POST handler:", error);
        return Response.json(
          {
            error: error.message,
            code: error.error_code || error.vm_error_code || null,
          },
          { status: 500 }
        );
    }
  
}