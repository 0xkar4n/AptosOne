// app/top-pools/page.tsx (or your dedicated client page)
'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import PoolCard from "@/components/PoolCard";

interface Pool {
  name: string;
  tokenAddress: string;
  depositApy?: number;
  extraDepositApy?: number | null;
  stakingAPY?: number | null;
  totalApy?: number;
  borrowApy?: number;
  icon?: string;
}

interface TopPoolsData {
  topLendPools: Pool[];
  topBorrowPools: Pool[];
}

export default function TopPoolsPage() {
  const [data, setData] = useState<TopPoolsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    <div className="space-y-8 p-4">
      <section>
        <h2 className="text-2xl font-bold">Top Lending Pools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {data.topLendPools.map((pool, index) => (
            <PoolCard
              key={index}
              icon={pool.icon || "/placeholder.png"}
              title={pool.name}
              type="Lending"
              depositApy={pool.depositApy || 0}
              extraApy={pool.extraDepositApy || null}
              stakingApy={pool.stakingAPY || null}
              totalApy={pool.totalApy || 0}
            />
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold">Top Borrowing Pools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {data.topBorrowPools.map((pool, index) => (
            <PoolCard
              key={index}
              icon={pool.icon || "/placeholder.png"}
              title={pool.name}
              type="Borrowing"
              borrowApy={pool.borrowApy || 0}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
