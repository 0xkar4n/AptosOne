"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Zap, BarChart } from "lucide-react";

export default function ReadMePage() {
  return (
    <div className="min-h-screen bg-neutral-800/90 backdrop-blur-md p-6 border-r border-gray-700/50 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">AptosOne Wallet Guide</h1>
      </div>

      {/* Wallet Connection & Activation */}
      <Card className="mb-6 hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Wallet className="h-8 w-8 mr-3 text-blue-500" />
            <h2 className="text-2xl font-semibold">Wallet Connection & Activation</h2>
          </div>
          <p className="mb-2">
            Users need to connect their Aptos wallet like Petra, Martian, etc.
          </p>
          <p className="mb-2">
            Once connected, they need to click on{" "}
            <span className="font-semibold text-blue-500">"Create a new AptosOne Wallet."</span>
          </p>
          <p className="mb-2">
            To activate the new wallet, users must fund it with any amount of tokens.
          </p>
          <p className="mb-2">
            The activation happens automatically when the wallet receives any transaction.
          </p>
          <p>Once activated, users can access all platform features.</p>
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="mb-6 hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Zap className="h-8 w-8 mr-3 text-purple-500" />
            <h2 className="text-2xl font-semibold">Features</h2>
          </div>
          <ul className="list-disc pl-5 space-y-3">
            <li>
              <strong className="text-blue-500">Staking:</strong> Stake or unstake APT on Thala, Echo, and Amnis using the Move-Agent kit.
            </li>
            <li>
              <strong className="text-purple-500">Top Pools:</strong> Access top lending and borrowing pools on Joule Finance and invest directly.
            </li>
            <li>
              <strong className="text-green-500">AI-Strategy:</strong> Enter a prompt like{" "}
              <span className="font-semibold">"APT to USDT"</span> and get the best 3 strategies for yield maximization, including direct lending/borrowing, multi-lending/borrowing, and swapping.
            </li>
            <li>
              <strong className="text-orange-500">Position Management:</strong> View all positions on Joule Finance.
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Additional Section for Visual Appeal */}
      <Card className="mb-6 hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <BarChart className="h-8 w-8 mr-3 text-green-500" />
            <h2 className="text-2xl font-semibold">Why Choose AptosOne?</h2>
          </div>
          <p className="mb-2">
            AptosOne is designed to simplify your DeFi experience. With intuitive features and powerful tools, you can maximize your yield and manage your assets effortlessly.
          </p>
          <p>
            Whether you're staking, lending, or exploring AI-driven strategies, AptosOne has you covered.
          </p>
        </CardContent>
      </Card>

      {/* Padding to Ensure Last Card is Visible */}
      <div className="pb-8"></div>
    </div>
  );
}