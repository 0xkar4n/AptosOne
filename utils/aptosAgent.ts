// utils/aptosAgent.ts
import { AgentRuntime, LocalSigner } from "move-agent-kit";
import { Aptos, AptosConfig, Ed25519PrivateKey, Network, PrivateKey, PrivateKeyVariants } from "@aptos-labs/ts-sdk";
import { fetchAptosOneWallet } from "./fetchAptosOneWallet";
import decryptKey from "./decryptKey";

export async function aptosAgent(userWalletAddress: string) {
  const aptosConfig = new AptosConfig({ network: Network.MAINNET });
  const aptos = new Aptos(aptosConfig);

  const response=await fetchAptosOneWallet(userWalletAddress);


  const privateKeyStr = decryptKey(response.data.encryptedPrivateKey);
  console.log(privateKeyStr)
  if (!privateKeyStr) {
    throw new Error("Missing APTOS_PRIVATE_KEY environment variable");
  }

  const account = await aptos.deriveAccountFromPrivateKey({
    privateKey: new Ed25519PrivateKey(
      PrivateKey.formatPrivateKey(privateKeyStr, PrivateKeyVariants.Ed25519)
    ),
  });

  const signer = new LocalSigner(account, Network.MAINNET);
  const agent = new AgentRuntime(signer, aptos);

  // Return multiple fields as properties of an object
  return { agent, signer, account };
}
