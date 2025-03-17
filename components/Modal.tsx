"use client"; // Ensure this is a client component

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy } from "lucide-react"; // Import the Copy icon
import { toast } from "sonner";

interface MessageModalProps {
  privateKey: string; // Accept privateKey as a prop
  isOpen: boolean; // Control modal open/close state
  onOpenChange: (open: boolean) => void; // Handle modal state changes
}

export function MessageModal({ privateKey, isOpen, onOpenChange }: MessageModalProps) {
  const handleCopyPrivateKey = () => {
    navigator.clipboard.writeText(privateKey);
    // alert("Private key copied to clipboard!");
    
    toast.success("Copied wallet address to clipboard.");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {/* Modal Content */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Your Private Key</DialogTitle>
        </DialogHeader>
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <p className="flex-1 break-all  bg-gray-900 p-2 rounded-md">
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