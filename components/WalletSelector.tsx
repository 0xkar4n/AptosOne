"use client";

import {
  APTOS_CONNECT_ACCOUNT_URL,
  AboutAptosConnect,
  AboutAptosConnectEducationScreen,
  AdapterNotDetectedWallet,
  AdapterWallet,
  AptosPrivacyPolicy,
  WalletItem,
  WalletSortingOptions,
  groupAndSortWallets,
  isAptosConnectWallet,
  isInstallRequired,
  truncateAddress,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Copy,
  LogOut,
  User,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";
import { BorderBeam } from "./ui/border-beam";
import axios from "axios";
import { fetchAptosOneWallet } from "@/utils/fetchAptosOneWallet";
import { IconClipboard, IconCopy, IconDots, IconExternalLink } from "@tabler/icons-react";
import { RainbowButton } from "./ui/rainbow-button";
import decryptKey from "@/utils/decryptKey";
import { MessageModal } from "./Modal";

export function WalletSelector(walletSortingOptions: WalletSortingOptions) {
  const { account, connected, disconnect, wallet } = useWallet();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [createdWallet, setCreatedWallet] = useState<string | null>(null);
  const [userWalletAddress, setUserWalletAddress] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const closeDialog = useCallback(() => setIsDialogOpen(false), []);
  const [loading, setLoading] = useState(true); // Add a loading state
  const menuRef = useRef<HTMLDivElement>(null);
  const [isPrivateKeyModalOpen, setIsPrivateKeyModalOpen] = useState(false);
  const [privateKey, setPrivateKey] = useState("");

  useEffect(() => {
    if (account?.address) {
      const addr = account.address.toString();
      setUserWalletAddress(addr);
      const checkCreatedWallet = async () => {
        try {
          setLoading(true);
          const response = await fetchAptosOneWallet(addr);
          console.log("respone value in walletconnect usefe", response)
          if (response.success) {
            setCreatedWallet(response.data.aptosOneWalletAddress);
          } else {
            setCreatedWallet(null);
          }
        } catch (error) {
          console.error("Error fetching created wallet:", error);
          setCreatedWallet(null);
        }
        finally {
          setLoading(false);
        }
      };
      checkCreatedWallet();
    }
    else {
      setLoading(false);
    }
  }, [account?.address]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };
  const viewOnExplorer = (address: string) => {
    window.open(`https://explorer.aptoslabs.com/account/${address}`, "_blank");
  };
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
  const copyAddress = useCallback(async () => {
    if (!account?.address) return;
    try {
      await navigator.clipboard.writeText(account.address.toString());
      toast.success("Copied wallet address to clipboard.");
    } catch {
      toast.success("Failed to copy wallet address.");
    }
  }, [account?.address, toast]);
  // Create a new AptosOne wallet via your backend API
  const handleCreateWallet = async () => {
    try {
      if (!userWalletAddress) return;
      toast.loading("Creating your AptosOne Wallet...");
      const response = await axios.post("/api/wallet", { userWalletAddress });
      const data = response.data;
  
      if (data.success) {
        setCreatedWallet(data.createdRecord.aptosOneWalletAddress);
        const createdPrivateKey = data.privateKey;
  
        // Open the modal with the private key
        setIsPrivateKeyModalOpen(true);
        setPrivateKey(createdPrivateKey);
  
        toast.dismiss();
        toast.success("AptosOne Wallet created successfully!");
      } else {
        alert("Error creating wallet: " + data.error);
        toast.dismiss();
      }
    } catch (error) {
      console.error("Error creating wallet:", error);
      alert("Error creating wallet");
      toast.dismiss();
    }
  };

  return connected ? (
    <div className="bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800 rounded-xl p-4 shadow-lg border border-gray-700/50 relative overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 opacity-30" />
      <h3 className="text-gray-300 text-sm mb-1 font-medium flex align-middle justify-center">Wallet</h3>
      <DropdownMenu >
        <DropdownMenuTrigger asChild >
          <div className="flex items-center justify-between bg-neutral-700 p-3 rounded-lg">
            <div className="flex justify-center align-middle text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-amber-200">


              <Button className="flex justify-center align-middle text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-amber-200">
                {account?.ansName ||
                  truncateAddress(account?.address?.toString()) ||
                  "Unknown"}
              </Button>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={copyAddress} className="gap-2">
            <Copy className="h-4 w-4" /> Copy address
          </DropdownMenuItem>
          {wallet && isAptosConnectWallet(wallet) && (
            <DropdownMenuItem asChild>
              <a
                href={APTOS_CONNECT_ACCOUNT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2"
              >
                <User className="h-4 w-4" /> Account
              </a>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={disconnect} className="gap-2">
            <LogOut className="h-4 w-4" /> Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {loading ? ( // Show loading state while the request is processing
        <div className="bg-neutral-700 p-3 rounded-lg max-w-full box-border flex items-center justify-center m-5">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        </div>
      ) :
        createdWallet ? (
          <div className="flex items-center mt-2 justify-between bg-neutral-700 p-3 rounded-lg">
            <div>
              <p className="text-xs text-gray-400">AptosOne Wallet</p>
              <p className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-amber-200">
                {truncateAddress(createdWallet)}
              </p>
            </div>

            <div className="relative" ref={menuRef}>
  <button onClick={() => setShowMenu(!showMenu)} className="hover:text-gray-400">
    <IconDots size={20} />
  </button>

  {showMenu && (
    <div className="absolute right-0 bottom-full mb-2 w-40 bg-neutral-800 border border-gray-700 rounded-lg shadow-lg z-50">
      <button
        className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-neutral-700"
        onClick={() => copyToClipboard(createdWallet)}
      >
        <IconClipboard size={16} className="mr-2" /> Copy Address
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
        ) : (
          <div className="bg-neutral-700 p-1 rounded-lg max-w-full box-border m-2">
            <p className="text-gray-300 text-sm ">
              You haven't created an AptosOne Wallet yet.
            </p>
            <RainbowButton onClick={handleCreateWallet} className="w-full max-w-full">
              <span className="text-white text-sm whitespace-nowrap">Create AptosOne Wallet</span>
              
            </RainbowButton>
          </div>
        )}
        <MessageModal
                privateKey={privateKey}
                isOpen={isPrivateKeyModalOpen}
                onOpenChange={setIsPrivateKeyModalOpen}
              />
    </div>
  ) : (
    <div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div className="bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800 rounded-xl p-4 shadow-lg border border-gray-700/50 relative overflow-hidden">
            {/* Background overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 opacity-30" />
            <h3 className="text-gray-300 text-sm mb-1 font-medium flex align-middle justify-center">Wallet</h3>
            <div className="relative overflow-hidden">
              <Button className="bg-black text-white hover:bg-black/80 font-medium py-2 px-4 rounded-lg w-full">
                Connect a Wallet

                <BorderBeam
                  size={50}
                  initialOffset={20}
                  className="from-transparent via-yellow-500 to-transparent"
                  transition={{
                    type: "spring",
                    stiffness: 60,
                    damping: 20,
                  }} />
              </Button>
            </div>
          </div>

        </DialogTrigger>
        <ConnectWalletDialog close={closeDialog} {...walletSortingOptions} />
      </Dialog>

    </div>
  );
}

interface ConnectWalletDialogProps extends WalletSortingOptions {
  close: () => void;
}

function ConnectWalletDialog({
  close,
  ...walletSortingOptions
}: ConnectWalletDialogProps) {
  const { wallets = [], notDetectedWallets = [] } = useWallet();

  const { aptosConnectWallets, availableWallets, installableWallets } =
    groupAndSortWallets(
      [...wallets, ...notDetectedWallets],
      walletSortingOptions
    );

  const hasAptosConnectWallets = !!aptosConnectWallets.length;

  return (
    <DialogContent className="max-h-screen overflow-auto">
      <AboutAptosConnect renderEducationScreen={renderEducationScreen}>
        <DialogHeader>
          <DialogTitle className="flex flex-col text-center leading-snug">
            {hasAptosConnectWallets ? (
              <>
                <span>Log in or sign up</span>
                <span>with Social + Aptos Connect</span>
              </>
            ) : (
              "Connect Wallet"
            )}
          </DialogTitle>
        </DialogHeader>

        {hasAptosConnectWallets && (
          <div className="flex flex-col gap-2 pt-3">
            {aptosConnectWallets.map((wallet) => (
              <AptosConnectWalletRow
                key={wallet.name}
                wallet={wallet}
                onConnect={close}
              />
            ))}
            <p className="flex gap-1 justify-center items-center text-muted-foreground text-sm">
              Learn more about{" "}
              <AboutAptosConnect.Trigger className="flex gap-1 py-3 items-center text-foreground">
                Aptos Connect <ArrowRight size={16} />
              </AboutAptosConnect.Trigger>
            </p>
            <AptosPrivacyPolicy className="flex flex-col items-center py-1">
              <p className="text-xs leading-5">
                <AptosPrivacyPolicy.Disclaimer />{" "}
                <AptosPrivacyPolicy.Link className="text-muted-foreground underline underline-offset-4" />
                <span className="text-muted-foreground">.</span>
              </p>
              <AptosPrivacyPolicy.PoweredBy className="flex gap-1.5 items-center text-xs leading-5 text-muted-foreground" />
            </AptosPrivacyPolicy>
            <div className="flex items-center gap-3 pt-4 text-muted-foreground">
              <div className="h-px w-full bg-secondary" />
              Or
              <div className="h-px w-full bg-secondary" />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-3">
          {availableWallets.map((wallet) => (
            <WalletRow key={wallet.name} wallet={wallet} onConnect={close} />
          ))}
          {!!installableWallets.length && (
            <Collapsible className="flex flex-col gap-3">
              <CollapsibleTrigger asChild>
                <Button size="sm" variant="ghost" className="gap-2">
                  More wallets <ChevronDown />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-col gap-3">
                {installableWallets.map((wallet) => (
                  <WalletRow
                    key={wallet.name}
                    wallet={wallet}
                    onConnect={close}
                  />
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </AboutAptosConnect>
    </DialogContent>
  );
}

interface WalletRowProps {
  wallet: AdapterWallet | AdapterNotDetectedWallet;
  onConnect?: () => void;
}

function WalletRow({ wallet, onConnect }: WalletRowProps) {
  return (
    <WalletItem
      wallet={wallet}
      onConnect={onConnect}
      className="flex items-center justify-between px-4 py-3 gap-4 border rounded-md"
    >
      <div className="flex items-center gap-4">
        <WalletItem.Icon className="h-6 w-6" />
        <WalletItem.Name className="text-base font-normal" />
      </div>
      {isInstallRequired(wallet) ? (
        <Button size="sm" variant="ghost" asChild>
          <WalletItem.InstallLink />
        </Button>
      ) : (
        <WalletItem.ConnectButton asChild>
          <Button size="sm">Connect</Button>
        </WalletItem.ConnectButton>
      )}
    </WalletItem>
  );
}

function AptosConnectWalletRow({ wallet, onConnect }: WalletRowProps) {
  return (
    <WalletItem wallet={wallet} onConnect={onConnect}>
      <WalletItem.ConnectButton asChild>
        <Button size="lg" variant="outline" className="w-full gap-4">
          <WalletItem.Icon className="h-5 w-5" />
          <WalletItem.Name className="text-base font-normal" />
        </Button>
      </WalletItem.ConnectButton>
    </WalletItem>
  );
}

function renderEducationScreen(screen: AboutAptosConnectEducationScreen) {
  return (
    <>
      <DialogHeader className="grid grid-cols-[1fr_4fr_1fr] items-center space-y-0">
        <Button variant="ghost" size="icon" onClick={screen.cancel}>
          <ArrowLeft />
        </Button>
        <DialogTitle className="leading-snug text-base text-center">
          About Aptos Connect
        </DialogTitle>
      </DialogHeader>

      <div className="flex h-[162px] pb-3 items-end justify-center">
        <screen.Graphic />
      </div>
      <div className="flex flex-col gap-2 text-center pb-4">
        <screen.Title className="text-xl" />
        <screen.Description className="text-sm text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a]:text-foreground" />
      </div>

      <div className="grid grid-cols-3 items-center">
        <Button
          size="sm"
          variant="ghost"
          onClick={screen.back}
          className="justify-self-start"
        >
          Back
        </Button>
        <div className="flex items-center gap-2 place-self-center">
          {screen.screenIndicators.map((ScreenIndicator, i) => (
            <ScreenIndicator key={i} className="py-4">
              <div className="h-0.5 w-6 transition-colors bg-muted [[data-active]>&]:bg-foreground" />
            </ScreenIndicator>
          ))}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={screen.next}
          className="gap-2 justify-self-end"
        >
          {screen.screenIndex === screen.totalScreens - 1 ? "Finish" : "Next"}
          <ArrowRight size={16} />
        </Button>
      </div>
    </>
  );
}