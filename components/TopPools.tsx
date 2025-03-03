'use client'
import { useEffect, useState } from "react";
import axios from "axios";

interface Pool {
  name: string;
  tokenAddress: string;
  depositApy?: number;
  extraDepositApy?: number | null;
  borrowApy?: number;
}

interface TopPoolsData {
  topLendPools: Pool[];
  topBorrowPools: Pool[];
}

export default function TopPools() {
  const [data, setData] = useState<TopPoolsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchPools() {
      try {
        const response = await axios.get("/api/v1/top-pools");
        setData(response.data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchPools();
  }, []);

  if (loading) return <p>Loading pools...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return null;

  return (
    <div>
      <h2>Top Lending Pools</h2>
      <ul>
        {data.topLendPools.map((pool, index) => (
          <li key={index}>
            <strong>{pool.name}</strong> — Deposit APY: {pool.depositApy}
            {pool.extraDepositApy && ` (Extra: ${pool.extraDepositApy})`}
          </li>
        ))}
      </ul>

      <h2>Top Borrowing Pools</h2>
      <ul>
        {data.topBorrowPools.map((pool, index) => (
          <li key={index}>
            <strong>{pool.name}</strong> — Borrow APY: {pool.borrowApy}
          </li>
        ))}
      </ul>
    </div>
  );
}
