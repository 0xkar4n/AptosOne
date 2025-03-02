import { aptosAgent } from "@/utils/aptosAgent";

export const POST = async(req:Request) => {
    try {
        const { protocol, value } = await req.json();

        console.log(`Protocol value = ${protocol} and value provided = ${value}`)

        if (!protocol || typeof value !== 'number') {
          return Response.json({ error: 'Missing or invalid protocol/value' });
        }
        const {agent}= await aptosAgent()

        let result;
        const protocolLower = protocol.toLowerCase();
        if (protocolLower === 'thala') {
            console.log("Thala protocol")
            result = await agent.stakeTokensWithThala(value);
        } else if (protocolLower === 'amnis') {
            console.log("Amnis protocol")
            const walletAddress= agent.account.getAddress();
            result = await agent.stakeTokensWithAmnis(walletAddress,value);
        } else if (protocolLower === 'echo') {
            console.log("Echo protocol")
            result = await agent.stakeTokenWithEcho(value);
        } else {
            return Response.json({ error: 'Invalid protocol provided' });
        }

        return Response.json({result})

    } catch (error) {
        console.error("Error in POST handler:", error);
        return Response.json({error})
    }
 
}
