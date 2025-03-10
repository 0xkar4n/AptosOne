import { useState, useEffect } from 'react';
import axios from 'axios';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

export const useAptBalance = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {account}=useWallet();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        const response = await axios.post('/api/get-balance',{userWalletAddress:account?.address.toString()});
        const rawBalance = response.data.finalAPTbalance;
        console.log("raw balance:", rawBalance, typeof rawBalance);
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

    fetchBalance();
  }, []);

  return { balance, loading, error };
};
