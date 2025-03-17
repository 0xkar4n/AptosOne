import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ReadMePage() {

  return (
    <div className={`min-h-screen p-6  bg-gray-900 text-white`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AptosOne Wallet Guide</h1>
        
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <h2 className="text-2xl font-semibold mb-2">Wallet Connection & Activation</h2>
          <p>Users need to connect their Aptos wallet like Petra, Martian, etc.</p>
          <p>Once connected, they need to click on "Create a new AptosOne Wallet."</p>
          <p>To activate the new wallet, users must fund it with any amount of tokens.</p>
          <p>The activation happens automatically when the wallet receives any transaction.</p>
          <p>Once activated, users can access all platform features.</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-4">
          <h2 className="text-2xl font-semibold mb-2">Features</h2>
          <ul className="list-disc pl-5">
            <li>
              <strong>Staking:</strong> Stake or unstake APT on Thala, Echo, and Amnis using the Move-Agent kit.
            </li>
            <li>
              <strong>Top Pools:</strong> Access top lending and borrowing pools on Joule Finance and invest directly.
            </li>
            <li>
              <strong>AI-Strategy:</strong> Enter a prompt like "APT to USDT" and get the best 3 strategies for yield maximization, including direct lending/borrowing, multi-lending/borrowing, and swapping.
            </li>
            <li>
              <strong>Position Management:</strong> View all positions on Joule Finance.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
