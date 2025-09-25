"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { web3Service } from "@/lib/web3"
import { shortenAddress } from "@/lib/utils"

export function WalletButton() {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    // Check if already connected
    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        });
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const chainId = await web3Service.getChainId();
          setChainId(chainId);
        }
      }
    } catch (error) {
      console.error('Failed to check connection:', error);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount(null);
      setChainId(null);
    } else {
      setAccount(accounts[0]);
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const connect = async () => {
    try {
      setConnecting(true);
      const address = await web3Service.connect();
      setAccount(address);
      const chainId = await web3Service.getChainId();
      setChainId(chainId);
    } catch (error) {
      console.error('Failed to connect:', error);
      alert(error instanceof Error ? error.message : 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    await web3Service.disconnect();
    setAccount(null);
    setChainId(null);
  };

  const getChainName = (id: number) => {
    const chains: Record<number, string> = {
      1: 'Ethereum',
      137: 'Polygon',
      56: 'BSC',
      43114: 'Avalanche',
      42161: 'Arbitrum',
      10: 'Optimism',
    };
    return chains[id] || `Chain ${id}`;
  };

  if (account) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {getChainName(chainId || 1)}
        </span>
        <Button variant="outline" onClick={disconnect}>
          {shortenAddress(account)}
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={connect} disabled={connecting}>
      {connecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
}