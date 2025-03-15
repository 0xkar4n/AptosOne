"use client";

import React, { useEffect, useRef, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import axios from "axios";
import { toast } from "sonner";
import { fetchAptosOneWallet } from "@/utils/fetchAptosOneWallet";
import { IconCopy, IconLogout, IconDots, IconExternalLink, IconKey, IconClipboard } from "@tabler/icons-react";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { Button } from "./ui/button";
import { BorderBeam } from "./ui/border-beam";

// Helper function to shorten addresses
function shortAddress(addr: string): string {
  if (!addr) return "";
  return addr.startsWith("0x") && addr.length > 10 ? `${addr.slice(0, 6)}..${addr.slice(-4)}` : addr;
}

const SidebarWallet = () => {
  const { account, connect, connected, disconnect, wallet } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [createdWallet, setCreatedWallet] = useState<string | null>(null);
  const [createPrivateKey, setCreatePrivateKey] = useState<string | null>(null);
  const [userWalletAddress, setUserWalletAddress] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [checkingCreatedWallet, setCheckingCreatedWallet] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (account?.address) {
      const addr = account.address.toString();
      setUserWalletAddress(addr);
      const checkCreatedWallet = async () => {
        try {
          setCheckingCreatedWallet(true);
          const response = await fetchAptosOneWallet(addr);

          if (response.success) {
            setCreatedWallet(response.data.aptosOneWalletAddress);
          } else {
            setCreatedWallet(null);
          }
        } catch (error) {
          console.error("Error fetching created wallet:", error);
          setCreatedWallet(null);
        } finally {
          setCheckingCreatedWallet(false);
        }
      };
      checkCreatedWallet();
    }
  }, [account?.address]);

  // Close the menu if clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onConnect = async (walletName: string) => {
    setIsConnecting(true);
    try {
      await connect(walletName);
      if (!connected) {
        toast.success("Wallet Connected");
      } else {
        toast.error("Wallet Not Connected");
      }
    } catch (error) {
      console.error("Failed to connect to wallet:", error);
      toast.error("Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

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

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  const viewOnExplorer = (address: string) => {
    window.open(`https://explorer.aptoslabs.com/account/${address}`, "_blank");
  };

  return (
    <div className="bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800 rounded-xl p-4 shadow-lg border border-gray-700/50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 opacity-30" />
      <h3 className="text-gray-300 text-sm mb-1 font-medium flex align-middle justify-center">Wallet</h3>

      {!connected ? (
        <div className="relative overflow-hidden">
          <RainbowButton
            onClick={() => onConnect(wallet?.name || "Petra")}
            className="bg-black text-white hover:bg-black/80 font-medium py-2 px-4 rounded-lg w-full"
          >
            Connect Wallet
            <BorderBeam size={50} initialOffset={20} className="from-transparent via-yellow-500 to-transparent" />
          </RainbowButton>
        </div>
      ) : (
        <>
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
              <IconLogout size={20} className="text-white transition-transform duration-300 group-hover:rotate-[-10deg]" />
            </button>
          </div>

          {createdWallet ? (
            <div className="flex items-center justify-between bg-neutral-700 p-3 rounded-lg relative">
              <div>
                <p className="text-xs text-gray-400">AptosOne Wallet</p>
                <p className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-amber-200">
                  {shortAddress(createdWallet)}
                </p>
              </div>

              {/* Three-dot menu */}
              <div className="relative" ref={menuRef}>
                <button onClick={() => setShowMenu(!showMenu)} className="hover:text-gray-400">
                  <IconDots size={20} />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-neutral-800 border border-gray-700 rounded-lg shadow-lg z-50">
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-neutral-700"
                      onClick={() => copyToClipboard(createdWallet, "Wallet Address Copied!")}
                    >
                      <IconClipboard size={16} className="mr-2" /> Copy Address
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-neutral-700"
                      onClick={() => copyToClipboard(createPrivateKey || "", "Private Key Copied!")}
                    >
                      <IconKey size={16} className="mr-2" /> Copy Private Key
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-neutral-700"
                      onClick={() => viewOnExplorer(createdWallet)}
                    >
                      <IconExternalLink size={16} className="mr-2" /> View Explorer
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : checkingCreatedWallet ? (
            <div className="bg-neutral-700 p-3 rounded-lg">
              <p className="text-gray-300 text-sm">You haven't created an AptosOne Wallet yet.</p>
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </>
      )}
    </div>
  );
};

export default SidebarWallet;
