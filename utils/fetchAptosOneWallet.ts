
import axios from "axios";

export async function fetchAptosOneWallet(userWalletAddress: string) {
  try {
    console.log("inside the fetchAptosWallet function")
    //http://localhost:3000/api/wallet?userWalletAddress=0x57977c34b7bbed9f35a35907ad577e02cef422ff194f78892204966e8fa04796
    const response = await axios.get(`http://localhost:3000/api/wallet?userWalletAddress=${userWalletAddress}`);
    console.log(response)
    return response.data; // Contains { success, data: { aptosOneWalletAddress, encryptedPrivateKey, createdTime } }
  } catch (error) {
    console.error("Error fetching wallet:", error);
    throw error;
  }
}
