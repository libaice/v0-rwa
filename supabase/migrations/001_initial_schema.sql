-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Assets table
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  symbol VARCHAR(50) UNIQUE NOT NULL,
  asset_type VARCHAR(100) NOT NULL CHECK (asset_type IN ('real_estate', 'commodity', 'stock', 'bond', 'other')),
  description TEXT,
  location VARCHAR(255),
  verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Price feeds table
CREATE TABLE price_feeds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  price DECIMAL(20,8) NOT NULL,
  source VARCHAR(255) NOT NULL,
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  block_number BIGINT,
  transaction_hash VARCHAR(66),
  INDEX idx_price_feeds_asset_timestamp (asset_id, timestamp DESC)
);

-- Oracle nodes table
CREATE TABLE oracle_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  address VARCHAR(42) UNIQUE NOT NULL,
  name VARCHAR(255),
  reputation_score DECIMAL(5,2) DEFAULT 100.00 CHECK (reputation_score >= 0),
  stake_amount DECIMAL(20,8),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data sources table
CREATE TABLE data_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  api_endpoint VARCHAR(500),
  reliability_score DECIMAL(3,2) CHECK (reliability_score >= 0 AND reliability_score <= 1),
  is_active BOOLEAN DEFAULT true
);

-- Price aggregation results table
CREATE TABLE price_aggregations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  aggregated_price DECIMAL(20,8) NOT NULL,
  price_count INTEGER NOT NULL,
  standard_deviation DECIMAL(20,8),
  min_price DECIMAL(20,8),
  max_price DECIMAL(20,8),
  aggregation_method VARCHAR(50) CHECK (aggregation_method IN ('weighted_average', 'median', 'mean')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_assets_symbol ON assets(symbol);
CREATE INDEX idx_assets_verification_status ON assets(verification_status);
CREATE INDEX idx_oracle_nodes_active ON oracle_nodes(is_active);
CREATE INDEX idx_data_sources_active ON data_sources(is_active);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();