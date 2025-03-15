"use client";

import React, { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import axios from "axios";
import { toast } from "sonner";
import { fetchAptosOneWallet } from "@/utils/fetchAptosOneWallet";
import {
  AccountAddress
} from "@aptos-labs/ts-sdk";

// Helper function to shorten addresses
function shortAddress(addr: string): string {
  if (!addr) return "";
  if (addr.startsWith("0x") && addr.length > 10) {
    // Example: 0x21..ad92
    return addr.slice(0, 6) + ".." + addr.slice(-4);
  }
  return addr;
}

const WalletConnectDemo = () => {
  const {
    account,
    connect,
    connected,
    disconnect,
    wallet,
  } = useWallet();

  const [createdWallet, setCreatedWallet] = useState< string| null>(null);


  useEffect(() => {
    const checkCreatedWallet = async () => {
      const userWalletAddress=account?.address.toString()
      if(userWalletAddress){
        try {
          const response = await fetchAptosOneWallet(userWalletAddress.toString())
          console.log("incise use effect func",response)
          if (typeof response === 'string') {
            throw new Error(response); // Handle the error case
          }
          
          if (response) {
            console.log("Wallet is already created")
            console.log(response)
            setCreatedWallet(response.aptosOneWalletAddress);
          } else {
            setCreatedWallet(null);
          }
        } catch (error) {
          console.error("Error fetching created wallet:", error);
          setCreatedWallet(null);
        }
      
    };
  }
    checkCreatedWallet();
  }, [account?.address]);

  // Connect with a specific wallet name (e.g., "Petra")
  const onConnect = async (walletName: string) => {
    console.log("Attempting to connect with:", walletName);
    try {
      await connect(walletName);
      
      console.log("Connected to wallet:", account);
      toast.success("Wallet Connected")
    } catch (error) {
      console.error("Failed to connect to wallet:", error);
    }
  };

  // Disconnect the currently connected wallet
  const handleDisconnect = async () => {
    try {
      await disconnect();
      console.log("Disconnected from wallet");
      toast.success("Wallet Disconnected")
    } catch (error) {
      console.error("Failed to disconnect from wallet:", error);
    }
  };

  // Create a new Aptos wallet via your backend API
  const handleCreateWallet = async () => {
    try {
      const userWalletAddress = account?.address.toString();
      toast.loading("Creating you AptosOne Wallet....");
      const response = await axios.post("/api/wallet", { userWalletAddress });
      const data = await response.data;
      if (response.status === 200) {
        setCreatedWallet(data.wallet.aptosOneWalletAddress);
        console.log("New wallet created:", data.wallet);
        toast.dismiss();
        toast.success("AptosOne Created successful!", {
        description: `Here is you aptosOne Wallet Address at Wallet Tab`,
      })
      } else {
        alert("Error creating wallet: " + data.error);
      }
    } catch (error) {
      console.error("Error creating wallet:", error);
      alert("Error creating wallet");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-neutral-800/90 p-6 rounded-xl shadow-lg border border-neutral-700/50 space-y-4">
        <h2 className="text-2xl font-semibold">Aptos Wallet</h2>
        {!connected ? (
          <button
            onClick={() => onConnect(wallet?.name || "Petra")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="space-y-4">
            {/* Connected Wallet Info */}
            <div className="bg-neutral-700 p-4 rounded-lg space-y-2">
              <div className="text-sm text-gray-400">Connected Wallet</div>
              <div>
                <span className="font-medium text-gray-300">Address: </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-amber-200 font-bold">
                  {shortAddress(account?.address.toString() ?? "")}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-300">Wallet: </span>
                <span className="text-gray-200">{wallet?.name}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleDisconnect}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
              >
                Disconnect
              </button>
            </div>

            {/* Conditional Section: If AptosOne wallet is created or not */}
            {createdWallet ? (
              // Display the created AptosOne wallet details
              <div className="bg-neutral-700 p-4 rounded-lg space-y-2 mt-4">
                <div className="text-sm text-gray-400">Your AptosOne Wallet</div>
                <div>
                  <span className="font-medium text-gray-300">
                    Wallet Address:
                  </span>{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-amber-200 font-bold">
                    {shortAddress(createdWallet)}
                  </span>
                </div>
              </div>
            ) : (
              // Prompt user to create a wallet if not created
              <div className="bg-neutral-700 p-4 rounded-lg space-y-2 mt-4">
                <p className="text-gray-300">
                  You haven't created an AptosOne Wallet yet.
                </p>
                <button
                  onClick={handleCreateWallet}
                  className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
                >
                  Create AptosOne Wallet
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletConnectDemo;
