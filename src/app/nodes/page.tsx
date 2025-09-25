"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { OracleNode } from "@/types"
import { shortenAddress } from "@/lib/utils"
import { Server, Shield, Activity, AlertCircle } from "lucide-react"

export default function NodesPage() {
  const [nodes, setNodes] = useState<OracleNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNodes();
  }, []);

  const fetchNodes = async () => {
    try {
      const response = await fetch('/api/nodes');
      const data = await response.json();
      if (data.status === 'success') {
        setNodes(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch nodes:", error);
    } finally {
      setLoading(false);
    }
  };

  const getNodeStatusColor = (node: OracleNode) => {
    if (!node.is_active) return "text-red-600 bg-red-50";
    if (node.reputation_score >= 90) return "text-green-600 bg-green-50";
    if (node.reputation_score >= 70) return "text-yellow-600 bg-yellow-50";
    return "text-orange-600 bg-orange-50";
  };

  const getNodeStatus = (node: OracleNode) => {
    if (!node.is_active) return "Inactive";
    if (node.reputation_score >= 90) return "Excellent";
    if (node.reputation_score >= 70) return "Good";
    return "Fair";
  };

  const stats = {
    totalNodes: nodes.length,
    activeNodes: nodes.filter(n => n.is_active).length,
    avgReputation: nodes.length > 0 
      ? nodes.reduce((sum, n) => sum + n.reputation_score, 0) / nodes.length 
      : 0,
    totalStaked: nodes.reduce((sum, n) => sum + (n.stake_amount || 0), 0),
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Oracle Nodes</h1>
        <Button>Register Node</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nodes</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNodes}</div>
            <p className="text-xs text-muted-foreground">Registered validators</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Nodes</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeNodes}</div>
            <p className="text-xs text-muted-foreground">Currently validating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Reputation</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgReputation.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Network health score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staked</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStaked.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Security deposit</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Node Directory</CardTitle>
          <CardDescription>Active oracle nodes and their performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading nodes...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Node</th>
                    <th className="text-left p-4">Address</th>
                    <th className="text-center p-4">Status</th>
                    <th className="text-center p-4">Reputation</th>
                    <th className="text-right p-4">Stake</th>
                    <th className="text-center p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {nodes.map((node) => (
                    <tr key={node.id} className="border-b hover:bg-accent">
                      <td className="p-4">
                        <div className="font-medium">{node.name || 'Unnamed Node'}</div>
                        <div className="text-sm text-muted-foreground">
                          Joined {new Date(node.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <code className="text-sm">{shortenAddress(node.address)}</code>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${getNodeStatusColor(node)}`}>
                          {getNodeStatus(node)}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="font-medium">{node.reputation_score.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground">/100</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-medium">{node.stake_amount?.toLocaleString() || '0'}</div>
                        <div className="text-xs text-muted-foreground">Tokens</div>
                      </td>
                      <td className="p-4 text-center">
                        <Button size="sm" variant="outline">View Details</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}