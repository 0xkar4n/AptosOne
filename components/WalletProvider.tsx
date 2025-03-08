// components/WalletProvider.tsx
"use client";

import React from "react";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";

interface WalletProviderProps {
  children: React.ReactNode;
}

const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  return (
    <AptosWalletAdapterProvider
      // Use the wallet names you wish to support; here we’re opting in to Petra
      optInWallets={["Petra"]}
      autoConnect={false}
      dappConfig={{ network: Network.MAINNET }}
      onError={(error) => {
        console.error("Wallet error:", error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};

export default WalletProvider;
