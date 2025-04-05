import { aptosAgent } from "@/utils/aptosAgent";

export const POST = async (req: Request) => {
  try {
    const { protocol, value, userWalletAddress } = await req.json();
    // Convert value to number
    const rawValue = Number(value);
    if (isNaN(rawValue) || rawValue <= 0) {
      return Response.json({ error: 'Invalid value provided' }, { status: 400 });
    }
    // Convert APT amount (human-readable) to smallest unit (assuming 8 decimals)
    const amountInInteger = Math.floor(rawValue * 10 ** 8);

    console.log(`Protocol value = ${protocol} and value provided = ${amountInInteger}`);

    if (!protocol || typeof value !== 'number') {
      return Response.json({ error: 'Missing or invalid protocol/value' }, { status: 400 });
    }
    const { agent } = await aptosAgent(userWalletAddress);

    let result;
    const protocolLower = protocol.toLowerCase();
    if (protocolLower === 'thala') {
      console.log("Thala protocol");
      result = await agent.stakeTokensWithThala(amountInInteger);
    } else if (protocolLower === 'amnis') {
      console.log("Amnis protocol");
      const walletAddress = agent.account.getAddress();
      result = await agent.stakeTokensWithAmnis(walletAddress, amountInInteger);
    } else if (protocolLower === 'echo') {
      console.log("Echo protocol");
      result = await agent.stakeTokenWithEcho(amountInInteger);
    } else {
      return Response.json({ error: 'Invalid protocol provided' }, { status: 400 });
    }

    return Response.json({ result });
  } catch (error: any) {
    console.error("Error in POST handler:", error); 
    if (error.message?.includes(`Can't derive account`)) {
      return Response.json(
        {
          error: "Please fund your AptosOne wallet before proceeding",
          code: "WALLET_FUNDING_REQUIRED",
        },
        { status: 400 }
      );
    }else{
      return Response.json(
        {
          error: error.message,
          code: error.error_code || error.vm_error_code || null,
        },
        { status: 500 }
      );
    
    }
  
}};
