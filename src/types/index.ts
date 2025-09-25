export type AssetType = 'real_estate' | 'commodity' | 'stock' | 'bond' | 'other';

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  asset_type: AssetType;
  description?: string;
  location?: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  created_at: Date;
  updated_at: Date;
}

export interface PriceFeed {
  id: string;
  asset_id: string;
  price: number;
  source: string;
  confidence_score: number;
  timestamp: Date;
  block_number?: bigint;
  transaction_hash?: string;
}

export interface OracleNode {
  id: string;
  address: string;
  name: string;
  reputation_score: number;
  stake_amount: number;
  is_active: boolean;
  created_at: Date;
}

export interface DataSource {
  id: string;
  name: string;
  api_endpoint?: string;
  reliability_score: number;
  is_active: boolean;
}

export interface PriceData {
  symbol: string;
  price: number;
  timestamp: number;
  change24h: number;
  volume24h: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: 'success' | 'error';
}