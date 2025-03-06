'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShineBorder } from "@/components/ui/shine-border";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

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

function PoolList({ pools, type }: { pools: Pool[]; type: 'lend' | 'borrow' }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">
        Top {type === 'lend' ? 'Lending' : 'Borrowing'} Pools
      </h2>
      <div className="grid gap-4">
        {pools.map((pool, index) => (
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
                <CardTitle className="text-white">{pool.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  {type === 'lend' ? (
                    <>
                      Deposit APY: {pool.depositApy}%
                      {pool.extraDepositApy && (
                        <span className="text-green-400 ml-2">
                          (Extra: {pool.extraDepositApy}%)
                        </span>
                      )}
                    </>
                  ) : (
                    <>Borrow APY: {pool.borrowApy}%</>
                  )}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function LoadingPoolList() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" /> {/* Title */}
      <div className="grid gap-4">
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
                <Skeleton className="h-6 w-32" /> {/* Pool name */}
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-48" /> {/* APY */}
                <Skeleton className="h-4 w-24" /> {/* Extra APY */}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
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

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-8">
          <LoadingPoolList /> {/* For Lending Pools */}
          <LoadingPoolList /> {/* For Borrowing Pools */}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-red-500 p-4 rounded-lg bg-red-500/10">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-8">
        <PoolList pools={data.topLendPools} type="lend" />
        <PoolList pools={data.topBorrowPools} type="borrow" />
      </div>
    </div>
  );
}
