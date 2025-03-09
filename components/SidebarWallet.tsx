// components/SidebarWallet.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import axios from "axios";
import { toast } from "sonner";
import { fetchAptosOneWallet } from "@/utils/fetchAptosOneWallet";
import { IconCopy, IconLogout } from "@tabler/icons-react";
import { RainbowButton } from "@/components/magicui/rainbow-button";
 
import { Button } from "./ui/button";
import { ShineBorder } from "./ui/shine-border";
import { BorderBeam } from "./ui/border-beam";

// Helper function to shorten addresses
function shortAddress(addr: string): string {
  if (!addr) return "";
  if (addr.startsWith("0x") && addr.length > 10) {
    return addr.slice(0, 6) + ".." + addr.slice(-4);
  }
  return addr;
}

const SidebarWallet = () => {
  const { account, connect, connected, disconnect, wallet } = useWallet();

  // State for the created AptosOne wallet address
  const [createdWallet, setCreatedWallet] = useState<string | null>(null);
  // State for the user's connected wallet address (as string)
  const [userWalletAddress, setUserWalletAddress] = useState<string | null>(null);

  // When account changes, update userWalletAddress and check for existing AptosOne wallet
  useEffect(() => {
    if (account?.address) {
      const addr = account.address.toString();
      setUserWalletAddress(addr);
      const checkCreatedWallet = async () => {
        try {
          const response = await fetchAptosOneWallet(addr);
              if (response.success) {
            setCreatedWallet(response.data.aptosOneWalletAddress);
          } else {
            setCreatedWallet(null);
          }
        } catch (error) {
          console.error("Error fetching created wallet:", error);
          setCreatedWallet(null);
        }
      };
      checkCreatedWallet();
    }
  }, [account?.address]);

  // Connect using a specific wallet name (e.g., "Petra")
  const onConnect = async (walletName: string) => {
    console.log("Attempting to connect with:", walletName);
    try {
      debugger
      const res =  await connect(walletName);
      toast.success("Wallet Connected");
    } catch (error) {
      console.error("Failed to connect to wallet:", error);
    }
  };

  // Disconnect the wallet
  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast.success("Wallet Disconnected");
      setUserWalletAddress(null);
      setCreatedWallet(null);
    } catch (error) {
      console.error("Failed to disconnect from wallet:", error);
    }
  };

  // Create a new AptosOne wallet via your backend API
  const handleCreateWallet = async () => {
    try {
      debugger
      if (!userWalletAddress) return;
      toast.loading("Creating your AptosOne Wallet...");
      const response = await axios.post("/api/wallet", { userWalletAddress });
      const data = response.data;
      if (response.status === 200 && data.success) {
        setCreatedWallet(data.wallet.aptosOneWalletAddress);
        toast.dismiss();
        toast.success("AptosOne Wallet created successfully!");
      } else {
        alert("Error creating wallet: " + data.error);
      }
    } catch (error) {
      console.error("Error creating wallet:", error);
      alert("Error creating wallet");
      toast.dismiss();
    }
  };

  // Copy the given text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800 rounded-xl p-4 shadow-lg border border-gray-700/50 relative overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 opacity-30" />
      <h3 className="text-gray-300 text-sm mb-1 font-medium flex align-middle justify-center">Wallet</h3>
      {!connected ? (
        <div className="relative overflow-hidden">
        
        <RainbowButton
          onClick={() => onConnect(wallet?.name || "Petra")}
          className="bg-black text-white hover:bg-black/80 font-medium py-2 px-4 rounded-lg w-full"
        >
          Connect Wallet
          <BorderBeam
        size={50}
        initialOffset={20}
        className="from-transparent via-yellow-500 to-transparent"
        transition={{
          type: "spring",
          stiffness: 60,
          damping: 20,
        }}
        
      />
     
      
        </RainbowButton>
        </div>
      ) : (
        <>
          {/* Connected wallet info with disconnect icon */}
          <div className="flex items-center justify-between bg-neutral-700 p-3 rounded-lg mb-3">
            <div>
              <p className="text-xs text-gray-400">Connected Wallet</p>
              <p className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-amber-200">
                {shortAddress(account?.address.toString() ?? "")}
              </p>
            </div>
            <button 
  onClick={handleDisconnect} 
  className="group relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95"
>
<div className="absolute inset-0 rounded-lg bg-white opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
<IconLogout 
    size={20}  
    className="text-white transition-transform duration-300 group-hover:rotate-[-10deg]"
  />
            </button>
          </div>
          {/* Conditional section: Show AptosOne wallet details if created, else show button to create */}
          {createdWallet ? (
            <div className="flex items-center justify-between bg-neutral-700 p-3 rounded-lg">
              <div>
                <p className="text-xs text-gray-400">AptosOne Wallet</p>
                <p className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-amber-200">
                  {shortAddress(createdWallet)}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(createdWallet)}
                className="hover:text-green-400"
              >
                <IconCopy size={20} />
              </button>
            </div>
          ) : (
            <div className="bg-neutral-700 p-3 rounded-lg">
              <p className="text-gray-300 text-sm">
                You haven't created an AptosOne Wallet yet.
              </p>
              <RainbowButton
                onClick={handleCreateWallet}
                className="mt-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded w-full"
              >
                Create AptosOne Wallet
              </RainbowButton>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SidebarWallet;
