"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, DollarSign, Server, TrendingUp } from "lucide-react"
import { formatPrice, formatPercentage } from "@/lib/utils"

interface DashboardStats {
  totalAssets: number;
  activeNodes: number;
  totalVolume24h: number;
  avgResponseTime: number;
  priceUpdates24h: number;
}

interface RecentPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  lastUpdated: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAssets: 0,
    activeNodes: 0,
    totalVolume24h: 0,
    avgResponseTime: 0,
    priceUpdates24h: 0,
  });
  
  const [recentPrices, setRecentPrices] = useState<RecentPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const [assetsRes, nodesRes] = await Promise.all([
        fetch('/api/assets'),
        fetch('/api/nodes?active=true'),
      ]);

      const assetsData = await assetsRes.json();
      const nodesData = await nodesRes.json();

      setStats({
        totalAssets: assetsData.data?.length || 0,
        activeNodes: nodesData.data?.length || 0,
        totalVolume24h: 1234567.89, // Mock data
        avgResponseTime: 234, // Mock data
        priceUpdates24h: 5678, // Mock data
      });

      // Mock recent prices
      setRecentPrices([
        { symbol: "GOLD", name: "Gold Commodity", price: 2024.56, change24h: 1.23, lastUpdated: new Date().toISOString() },
        { symbol: "REIT1", name: "NYC Real Estate Fund", price: 156.78, change24h: -0.45, lastUpdated: new Date().toISOString() },
        { symbol: "OIL", name: "Crude Oil WTI", price: 78.34, change24h: 2.67, lastUpdated: new Date().toISOString() },
      ]);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Oracle Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAssets}</div>
            <p className="text-xs text-muted-foreground">Active RWA assets</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Nodes</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeNodes}</div>
            <p className="text-xs text-muted-foreground">Oracle validators</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalVolume24h)}</div>
            <p className="text-xs text-muted-foreground">Total query volume</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Price Updates</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.priceUpdates24h.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Price Updates</CardTitle>
          <CardDescription>Latest price feeds from oracle nodes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPrices.map((item) => (
              <div key={item.symbol} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{item.symbol}</span>
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last updated: {new Date(item.lastUpdated).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatPrice(item.price)}</div>
                  <div className={`text-sm ${item.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(item.change24h)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}