"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatPrice, formatPercentage } from "@/lib/utils"

interface PriceData {
  timestamp: string;
  price: number;
  high: number;
  low: number;
}

export default function PricesPage() {
  const [selectedAsset, setSelectedAsset] = useState("GOLD");
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([]);
  const [currentPrice, setCurrentPrice] = useState<any>(null);
  const [timeRange, setTimeRange] = useState("24h");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPriceData();
  }, [selectedAsset, timeRange]);

  const fetchPriceData = async () => {
    try {
      // Mock data for demonstration
      const mockHistory = generateMockPriceHistory(timeRange);
      setPriceHistory(mockHistory);
      
      setCurrentPrice({
        price: mockHistory[mockHistory.length - 1].price,
        change24h: 2.45,
        high24h: Math.max(...mockHistory.map(p => p.high)),
        low24h: Math.min(...mockHistory.map(p => p.low)),
        volume24h: 1234567.89,
      });
    } catch (error) {
      console.error("Failed to fetch price data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockPriceHistory = (range: string) => {
    const now = new Date();
    const points = range === "24h" ? 24 : range === "7d" ? 168 : 30;
    const interval = range === "24h" ? 3600000 : range === "7d" ? 3600000 : 86400000;
    
    return Array.from({ length: points }, (_, i) => {
      const timestamp = new Date(now.getTime() - (points - i) * interval);
      const basePrice = 2000 + Math.random() * 100;
      return {
        timestamp: timestamp.toISOString(),
        price: basePrice,
        high: basePrice + Math.random() * 20,
        low: basePrice - Math.random() * 20,
      };
    });
  };

  const assets = [
    { symbol: "GOLD", name: "Gold Commodity" },
    { symbol: "SILVER", name: "Silver Commodity" },
    { symbol: "REIT1", name: "NYC Real Estate Fund" },
    { symbol: "OIL", name: "Crude Oil WTI" },
    { symbol: "WHEAT", name: "Wheat Futures" },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Price Oracle</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Assets</CardTitle>
              <CardDescription>Select an asset to view prices</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {assets.map((asset) => (
                  <button
                    key={asset.symbol}
                    onClick={() => setSelectedAsset(asset.symbol)}
                    className={`w-full text-left px-4 py-3 hover:bg-accent transition-colors ${
                      selectedAsset === asset.symbol ? 'bg-accent' : ''
                    }`}
                  >
                    <div className="font-medium">{asset.symbol}</div>
                    <div className="text-sm text-muted-foreground">{asset.name}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {currentPrice && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{selectedAsset}</CardTitle>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-3xl font-bold">{formatPrice(currentPrice.price)}</span>
                      <span className={`text-lg ${currentPrice.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPercentage(currentPrice.change24h)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-sm">
                      <span className="text-muted-foreground">24h High:</span> {formatPrice(currentPrice.high24h)}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">24h Low:</span> {formatPrice(currentPrice.low24h)}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">24h Volume:</span> {formatPrice(currentPrice.volume24h)}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Price Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={timeRange} onValueChange={setTimeRange}>
                <TabsList className="mb-4">
                  <TabsTrigger value="24h">24H</TabsTrigger>
                  <TabsTrigger value="7d">7D</TabsTrigger>
                  <TabsTrigger value="30d">30D</TabsTrigger>
                </TabsList>
                
                <TabsContent value={timeRange} className="space-y-4">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={priceHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="timestamp" 
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return timeRange === "24h" 
                              ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                              : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                          }}
                        />
                        <YAxis 
                          domain={['dataMin - 50', 'dataMax + 50']}
                          tickFormatter={(value) => `$${value.toFixed(0)}`}
                        />
                        <Tooltip 
                          formatter={(value: any) => formatPrice(value)}
                          labelFormatter={(label) => new Date(label).toLocaleString()}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="price" 
                          stroke="#2563eb" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}