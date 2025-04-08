"use client"; // Ensure this is a client component

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy } from "lucide-react"; // Import the Copy icon
import { toast } from "sonner";
import Confetti from "react-confetti"; // Import Confetti

interface MessageModalProps {
  privateKey: string; // Accept privateKey as a prop
  isOpen: boolean; // Control modal open/close state
  onOpenChange: (open: boolean) => void; // Handle modal state changes
}

export function MessageModal({ privateKey, isOpen, onOpenChange }: MessageModalProps) {
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfetti(true); // Start confetti when the modal opens
      const timer = setTimeout(() => setConfetti(false), 5000); // Stop confetti after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleCopyPrivateKey = () => {
    navigator.clipboard.writeText(privateKey);
    toast.success("Copied wallet address to clipboard.");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {/* Confetti */}
      {confetti && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          <Confetti
            width={window.innerWidth} // Set confetti width to viewport width
            height={window.innerHeight} // Set confetti height to viewport height
            numberOfPieces={200} // Adjust the number of confetti pieces
            recycle={false} // Stop confetti after falling
            gravity={0.1} // Adjust the falling speed
          />
        </div>
      )}

      {/* Modal Content */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Your Private Key</DialogTitle>
          <p className="text-sm text-gray-500">
           Note : Please fund your wallet with any amount of token to activate in Aptos network.
          </p>
        </DialogHeader>
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <p className="flex-1 break-all bg-gray-900 p-2 rounded-md">
              {privateKey}
            </p>
            <Button onClick={handleCopyPrivateKey} size="icon" variant="outline">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Please securely store your private key. Do not share it with anyone.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}