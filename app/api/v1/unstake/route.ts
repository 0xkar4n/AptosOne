import { aptosAgent } from "@/utils/aptosAgent";

/**
 * Unstake tokens via different protocols (Thala, Amnis, Echo)
 * Expected JSON request body:
 * {
 *   "protocol": "thala" | "amnis" | "echo",
 *   "value": number (human-readable APT amount)
 * }
 */
export const POST = async (req: Request) => {
  try {
    const { protocol, value } = await req.json();
    // Validate and convert value
    const rawValue = Number(value);
    if (isNaN(rawValue) || rawValue <= 0) {
      return Response.json({ error: 'Invalid value provided' }, { status: 400 });
    }
    // Convert APT amount to smallest unit (8 decimals)
    const amountInInteger = Math.floor(rawValue * 10 ** 8);

    if (!protocol || typeof protocol !== 'string') {
      return Response.json({ error: 'Missing or invalid protocol provided' }, { status: 400 });
    }

    console.log(`Unstaking: protocol = ${protocol} and value = ${amountInInteger}`);
    const { agent } = await aptosAgent();
    let result;
    const protocolLower = protocol.toLowerCase();

    // Use the unstake function that corresponds to the protocol
    if (protocolLower === 'thala') {
      console.log("Processing Thala unstake");
      result = await agent.unstakeTokensWithThala(amountInInteger);
    } else if (protocolLower === 'amnis') {
      console.log("Processing Amnis unstake");
      const walletAddress = agent.account.getAddress();
      result = await agent.withdrawStakeFromAmnis(walletAddress, amountInInteger);
    } else if (protocolLower === 'echo') {
      console.log("Processing Echo unstake");
      result = await agent.unstakeTokenWithEcho(amountInInteger);
    } else {
      return Response.json({ error: 'Invalid protocol provided' }, { status: 400 });
    }

    return Response.json({ result });
  } catch (error: any) {
    console.error("Error in unstake POST handler:", error);
    return Response.json(
      {
        error: error.message,
        code: error.error_code || error.vm_error_code || null,
      },
      { status: 500 }
    );
  }
};
