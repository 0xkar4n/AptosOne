
import axios from "axios";

export async function fetchAptosOneWallet(userWalletAddress: string) {
  try {
   
    const response = await axios.get(`/api/wallet?userWalletAddress=${userWalletAddress}`);

    return response.data; // Contains { success, data: { aptosOneWalletAddress, encryptedPrivateKey, createdTime } }
  } catch (error) {

    throw error;
  }
}