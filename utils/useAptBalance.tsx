import { useState, useEffect } from 'react';
import axios from 'axios';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

export const useAptBalance = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {account,connected}=useWallet();
  const fetchBalance = async () => {
    try {
      setLoading(true);
      const userWalletAddress = account?.address.toString()
      const response = await axios.get(`/api/get-balance?userWalletAddress=${userWalletAddress}`);
      const rawBalance = response.data.finalAPTbalance;
  
      // Convert rawBalance to string, trim, and then parse it as a float.
      const cleaned = rawBalance ;
      setBalance(parseFloat(cleaned));
      setError(null);
    } catch (err) {
      setError('Failed to fetch APT balance');
      setBalance(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
 if(connected){
    fetchBalance();
 }
  }, [account]);

  return { balance, loading, error };
};
