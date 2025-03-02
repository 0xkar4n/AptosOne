import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAptBalance = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/get-balance');
        setBalance(response.data.APTbalance);
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
