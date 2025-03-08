"use client";

import React, { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

// Helper function to shorten addresses
function shortAddress(addr: string): string {
  if (!addr) return "";
  if (addr.startsWith("0x") && addr.length > 10) {
    // Example: 0x21..ad92
    return addr.slice(0, 6) + ".." + addr.slice(-4);
  }
  if (addr.length > 8) {
    return addr.slice(0, 4) + ".." + addr.slice(-4);
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

  const [createdWallet, setCreatedWallet] = useState<{
    walletAddress: string;
    encryptedPrivateKey: string;
  } | null>(null);

  // Connect with a specific wallet name (e.g., "Petra")
  const onConnect = async (walletName: string) => {
    console.log("Attempting to connect with:", walletName);
    try {
      await connect(walletName);
      console.log("Connected to wallet:", account);
    } catch (error) {
      console.error("Failed to connect to wallet:", error);
    }
  };

  // Disconnect the currently connected wallet
  const handleDisconnect = async () => {
    try {
      await disconnect();
      console.log("Disconnected from wallet");
    } catch (error) {
      console.error("Failed to disconnect from wallet:", error);
    }
  };

  // Create a new Aptos wallet via your backend API
  const handleCreateWallet = async () => {
    try {
      const response = await fetch("/api/wallet", { method: "POST" });
      const data = await response.json();
      if (response.ok) {
        setCreatedWallet(data.wallet);
        console.log("New wallet created:", data.wallet);
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
                <span className="font-medium text-gray-300">Public Key: </span>
                <span className="text-gray-200">
                  {account?.publicKey.toString().slice(0, 8)}...
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
              <button
                onClick={handleCreateWallet}
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
              >
                Create New Wallet
              </button>
            </div>

            {/* Newly Created Wallet */}
            {createdWallet && (
              <div className="bg-neutral-700 p-4 rounded-lg space-y-2 mt-4">
                <div className="text-sm text-gray-400">New Wallet Details</div>
                <div>
                  <span className="font-medium text-gray-300">
                    Wallet Address:
                  </span>{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-amber-200 font-bold">
                    {shortAddress(createdWallet.walletAddress)}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-300">
                    Encrypted Private Key:
                  </span>{" "}
                  <span className="text-gray-200">
                    {createdWallet.encryptedPrivateKey}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletConnectDemo;
