'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { getTokenByTokenAddress } from "@/utils/get-pool-name-by-token-name";

export default function WalletPositions() {
  const { account, connected } = useWallet();
  const [positions, setPositions] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPositions = async () => {
    const userWalletAddress = account?.address.toString();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/get-positions?walletAddress=${userWalletAddress}`);
      const data = response.data;

      // Flatten the nested positions data into a flat array
      const allPositionsData = data.allPositionsData || [];
      const flattenedPositions: any[] = [];

      allPositionsData.forEach((positionObj: any) => {
        const positionsMap = positionObj.positions_map;
        if (positionsMap && Array.isArray(positionsMap.data)) {
          positionsMap.data.forEach((item: any) => {
            const positionId = item.key;
            const { position_name, lend_positions, borrow_positions } = item.value;

            // Process lend positions
            if (lend_positions && Array.isArray(lend_positions.data)) {
              lend_positions.data.forEach((lend: any) => {
                // Use the utility function to get token data by address
                const tokenData = getTokenByTokenAddress(lend.key);
                const decimals = tokenData ? tokenData.decimals : 0;
                const normalizedAmount = parseFloat(lend.value) / Math.pow(10, decimals);
                flattenedPositions.push({
                  id: positionId,
                  positionName: position_name,
                  asset: lend.key,
                  amount: normalizedAmount,
                  type: "lend"
                });
              });
            }

            // Process borrow positions
            if (borrow_positions && Array.isArray(borrow_positions.data)) {
              borrow_positions.data.forEach((borrow: any) => {
                const tokenData = getTokenByTokenAddress(borrow.key);
                const decimals = tokenData ? tokenData.decimals : 0;
                const normalizedAmount = parseFloat(borrow.value) / Math.pow(10, decimals);
                flattenedPositions.push({
                  id: positionId,
                  positionName: position_name,
                  asset: borrow.key,
                  amount: normalizedAmount,
                  type: "borrow"
                });
              });
            }
          });
        }
      });

      console.log(flattenedPositions);
      setPositions(flattenedPositions);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (connected) {
      fetchPositions();
    }
  }, [account, connected]);

  return (
    <div className="w-full flex mx-auto p-4 h-full bg-gradient-to-r from-gray-900/20 to-gray-800/10">
      <Card className="w-full">
        <CardContent className="p-4 space-y-4 flex flex-row justify-between items-center">
          <Button onClick={fetchPositions} disabled={loading}>
            {loading ? "Loading..." : "Fetch Positions"}
          </Button>
          {error && <p className="text-red-500">{error}</p>}



        </CardContent>
      </Card>

      {positions.length > 0 && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position ID</TableHead>
                  <TableHead>Position Name</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.map((position, index) => (
                  <TableRow key={index}>
                    <TableCell>{position.id}</TableCell>
                    <TableCell>{position.positionName}</TableCell>
                    <TableCell>{position.asset}</TableCell>
                    <TableCell>{position.amount}</TableCell>
                    <TableCell>{position.type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
