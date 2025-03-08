// app/test/page.tsx
"use client";

import React, { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";

const WalletConnectDemo = () => {
  const {
    account,
    connect,
    connected,
    disconnect,
    wallet,
  } = useWallet();

  // State to hold the created wallet details returned from your API
  const [createdWallet, setCreatedWallet] = useState<{
    walletAddress: string;
    encryptedPrivateKey: string;
  } | null>(null);

  // Custom connect function that requires a wallet name.
  const onConnect = async (walletName: string) => {
    console.log("inside connect func");
    try {
      console.log("Attempting to connect with:", walletName);
      await connect(walletName);
      console.log("Connected to wallet:", account);
    } catch (error) {
      console.error("Failed to connect to wallet:", error);
    }
  };

  // Disconnect the wallet
  const handleDisconnect = async () => {
    try {
      await disconnect();
      console.log("Disconnected from wallet");
    } catch (error) {
      console.error("Failed to disconnect from wallet:", error);
    }
  };

  // Create a new wallet by calling your backend API and store the result
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
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Aptos Wallet Connection</h1>
      {connected ? (
        <div className="space-y-2">
          <div>
            <strong>Address:</strong> {account?.address.toString()}
          </div>
          <div>
            <strong>Public Key:</strong> {account?.publicKey.toString()}
          </div>
          <div>
            <strong>Wallet:</strong> {wallet?.name}
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleDisconnect}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
            >
              Disconnect
            </button>
            {/* Retaining the connect button in case you want to re-connect */}
            <button
              onClick={() => onConnect(wallet?.name || "Petra")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
            >
              Connect Wallet
            </button>
          </div>
          <button
            onClick={handleCreateWallet}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded mt-4"
          >
            Create New Wallet
          </button>
          {createdWallet && (
            <div className="mt-4 border p-4 rounded">
              <h2 className="text-xl font-semibold">New Wallet Details</h2>
              <p>
                <strong>Wallet Address:</strong> {createdWallet.walletAddress}
              </p>
              <p>
                <strong>Encrypted Private Key:</strong> {createdWallet.encryptedPrivateKey}
              </p>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => onConnect(wallet?.name || "Petra")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnectDemo;
