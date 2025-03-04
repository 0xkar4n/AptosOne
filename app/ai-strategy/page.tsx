'use client';
import React, { useState } from 'react';
import StrategyCard from '@/components/StrategyCard';
import StrategySearch from '@/components/StrategySearch';

export interface APYBreakdown {
  depositToken: string;
  depositApy: number;
  borrowToken: string;
  borrowCost: number;
}

export interface StrategyData {
  title: string;
  description?: string;
  apyBreakdowns: APYBreakdown[];
  netApy: number;
  icon: string;
}

function App() {
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<StrategyData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Example strategy data (will be replaced by API response)
  const defaultStrategy: StrategyData = {
    title: "ABTC-APT-USDT Strategy",
    description: "Leverage multiple assets to maximize yield",
    icon: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    apyBreakdowns: [
      {
        depositToken: "ABTC",
        depositApy: 15.67,
        borrowToken: "APT",
        borrowCost: 3.18
      },
      {
        depositToken: "APT",
        depositApy: 1.77,
        borrowToken: "USDT",
        borrowCost: 5.28
      },
      {
        depositToken: "USDT",
        depositApy: 2.79,
        borrowToken: "",
        borrowCost: 0
      }
    ],
    netApy: 11.77
  };

  return (
    <div className='flex items-center justify-center p-6'>
      <div className="w-full max-w-md ">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-amber-400">
            Yield Strategies
          </span>
        </h1>
        
        <StrategySearch 
          onSearch={setStrategy} 
          setLoading={setLoading} 
          setError={setError}
        />
        
        {loading ? (
          <div className="mt-8 flex flex-col items-center justify-center">
            <LoadingSpinner />
            <p className="text-gray-400 mt-4">Generating optimal strategy...</p>
          </div>
        ) : error ? (
          <div className="mt-8 p-4 bg-red-900/20 border border-red-800 rounded-lg text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : strategy ? (
          <div className="mt-8">
            <StrategyCard 
              title={strategy.title}
              description={strategy.description}
              icon={strategy.icon}
              apyBreakdowns={strategy.apyBreakdowns}
              netApy={strategy.netApy}
            />
          </div>
        ) : (
          <div className="mt-8">
            <StrategyCard 
              title={defaultStrategy.title}
              description={defaultStrategy.description}
              icon={defaultStrategy.icon}
              apyBreakdowns={defaultStrategy.apyBreakdowns}
              netApy={defaultStrategy.netApy}
            />
          </div>
        )}
      </div>
      </div>
  );
}

const LoadingSpinner = () => {
  return (
    <div className="relative w-20 h-20">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-500/20 rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-l-amber-500 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-purple-500/20 to-amber-500/20 rounded-full flex items-center justify-center">
        <div className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full"></div>
      </div>
    </div>
  );
};

export default App;