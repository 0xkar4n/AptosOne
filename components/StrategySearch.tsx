import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ShineBorder } from './ui/shine-border';
import axios from 'axios';

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

interface StrategySearchProps {
  onSearch: (strategy: StrategyData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const StrategySearch: React.FC<StrategySearchProps> = ({ 
  onSearch, 
  setLoading, 
  setError 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a strategy to search');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API call with timeout
      // In production, replace with actual API call
      setTimeout(async () => {
        try {
          // Uncomment for real API integration
          // const response = await axios.post('/api/ai-magic', { query: searchQuery });
          // onSearch(response.data);
          
          // Mock response for demo
          const mockResponse = generateMockStrategy(searchQuery);
          onSearch(mockResponse);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching strategy:', error);
          setError('Failed to generate strategy. Please try again.');
          setLoading(false);
        }
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  // Generate a mock strategy based on the search query
  const generateMockStrategy = (query: string): StrategyData => {
    const tokens = query.toUpperCase().split(/[\s-]+TO[\s-]+/i);
    const fromToken = tokens[0] || 'ETH';
    const toToken = tokens[1] || 'USDT';
    
    // Generate random APY values
    const depositApy1 = parseFloat((Math.random() * 10 + 5).toFixed(2));
    const borrowCost1 = parseFloat((Math.random() * 5).toFixed(2));
    const depositApy2 = parseFloat((Math.random() * 8).toFixed(2));
    const borrowCost2 = parseFloat((Math.random() * 4).toFixed(2));
    const depositApy3 = parseFloat((Math.random() * 6).toFixed(2));
    
    // Calculate net APY
    const netApy = parseFloat((depositApy1 - borrowCost1 + depositApy2 - borrowCost2 + depositApy3).toFixed(2));
    
    // Generate intermediate token
    const intermediateToken = ['BTC', 'ETH', 'SOL', 'APT', 'AVAX'].filter(
      t => t !== fromToken && t !== toToken
    )[0] || 'BTC';
    
    return {
      title: `${fromToken}-${intermediateToken}-${toToken} Strategy`,
      description: `Optimize yield by leveraging ${fromToken}, ${intermediateToken}, and ${toToken}`,
      icon: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      apyBreakdowns: [
        {
          depositToken: fromToken,
          depositApy: depositApy1,
          borrowToken: intermediateToken,
          borrowCost: borrowCost1
        },
        {
          depositToken: intermediateToken,
          depositApy: depositApy2,
          borrowToken: toToken,
          borrowCost: borrowCost2
        },
        {
          depositToken: toToken,
          depositApy: depositApy3,
          borrowToken: "",
          borrowCost: 0
        }
      ],
      netApy: netApy
    };
  };

  return (
    <div className="relative">
      <div className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
        isFocused ? 'ring-2 ring-purple-500/50' : ''
      }`}>
        <div className="relative flex items-center">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter strategy (e.g., ETH to USDT)"
            className="w-full pl-12 pr-4 py-4 border border-neutral-700 rounded-xl bg-neutral-800/70 text-white text-md backdrop-blur-sm"
          />
          <div className="absolute left-4 text-gray-400">
            <Search size={18} />
          </div>
        </div>
      </div>
      
      <div className="mt-3">
        <ShineBorder
          shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
          className="rounded-lg"
        >
          <Button 
            onClick={handleSearch}
            className="w-full bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white font-medium py-3 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300"
          >
            <Sparkles size={16} className="mr-2" />
            <span>Generate Optimal Strategy</span>
          </Button>
        </ShineBorder>
      </div>
      
      <div 
        className="absolute -z-10 top-0 left-0 right-0 h-40 rounded-full opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(120, 119, 198, 0.3) 0%, rgba(255, 255, 255, 0) 70%)"
        }}
      />
      
      <div className="mt-3 flex flex-wrap gap-2 justify-center">
        <SuggestionTag label="ETH to USDT" onClick={() => setSearchQuery("ETH to USDT")} />
        <SuggestionTag label="BTC to USDC" onClick={() => setSearchQuery("BTC to USDC")} />
        <SuggestionTag label="SOL to ETH" onClick={() => setSearchQuery("SOL to ETH")} />
      </div>
    </div>
  );
};

const SuggestionTag: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 text-xs bg-neutral-800/70 hover:bg-neutral-700/70 text-gray-300 rounded-full border border-neutral-700/50 transition-colors duration-200"
    >
      {label}
    </button>
  );
};

export default StrategySearch;