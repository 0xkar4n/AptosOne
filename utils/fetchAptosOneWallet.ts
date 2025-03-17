
import axios from "axios";

export async function fetchAptosOneWallet(userWalletAddress: string) {
  try {
    console.log("inside the fetchAptosWallet function")
    const response = await axios.get(`/api/wallet?userWalletAddress=${userWalletAddress}`);
    console.log(response)
    return response.data; // Contains { success, data: { aptosOneWalletAddress, encryptedPrivateKey, createdTime } }
  } catch (error) {
    console.error("Error fetching wallet:", error);
    throw error;
  }
}