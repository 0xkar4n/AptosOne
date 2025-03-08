// app/top-pools/page.tsx (or your dedicated client page)
'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import PoolCard from "@/components/PoolCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ShineBorder } from "@/components/ui/shine-border";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface Pool {
  name: string;
  tokenAddress: string;
  depositApy?: number;
  extraDepositApy?: number | null;
  borrowApy?: number;
  icon?: string;
}

interface TopPoolsData {
  topLendPools: Pool[];
  topBorrowPools: Pool[];
}

function LoadingPoolList() {
  return (
    <section>
      <Skeleton className="h-8 w-48 mb-4" /> {/* Section Title */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {[1, 2, 3].map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative"
          >
            <ShineBorder
              shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
              className="rounded-lg"
            />
            <Card className="bg-neutral-800 border-neutral-700">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-10 w-10 rounded-lg" /> {/* Icon */}
                  <Skeleton className="h-6 w-32" /> {/* Pool name */}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-48" /> {/* APY */}
                <Skeleton className="h-4 w-24" /> {/* Extra APY */}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
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

  if (loading) return (
    <div className="space-y-8 p-4">
      <LoadingPoolList /> {/* Lending Pools */}
      <LoadingPoolList /> {/* Borrowing Pools */}
    </div>
  );
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
              apy={pool.depositApy || 0}
              extraApy={pool.extraDepositApy || null}
              type="Lending"
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
              apy={pool.borrowApy || 0}
              type="Borrowing"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
