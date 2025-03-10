import { useWallet } from "@aptos-labs/wallet-adapter-react";
import axios from "axios";

export async function generateResponse(userInput: string): Promise<string> {

    const {account}=useWallet()

    try {
   debugger
     const userWalletAddress=account?.address.toString();
      const response = await axios.post(`/api/chat`, { prompt,userWalletAddress });
      console.log("response in testing frontend",response.data)
      const data = await response.data;
      return data.response || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('Error:', error);
      return 'An error occurred. Please try again.';
    }
  }
  