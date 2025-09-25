import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { PriceAggregator } from '@/lib/price-aggregator';

export async function POST(request: NextRequest) {
  try {
    const { symbol, sources } = await request.json();

    if (!symbol || !sources || !Array.isArray(sources)) {
      throw new Error('Invalid request body');
    }

    // Get asset ID
    const { data: asset, error: assetError } = await supabase
      .from('assets')
      .select('id')
      .eq('symbol', symbol.toUpperCase())
      .single();
    
    if (assetError || !asset) {
      throw new Error('Asset not found');
    }

    // Initialize aggregator
    const aggregator = new PriceAggregator();
    
    interface PriceSource {
      name: string;
      price: number;
      timestamp?: string;
      confidence?: number;
    }

    // Prepare price sources
    const priceSources = sources.map((source: PriceSource) => ({
      source: source.name,
      price: source.price,
      timestamp: new Date(source.timestamp || Date.now()),
      confidence: source.confidence || 0.8,
    }));

    // Aggregate prices
    const result = aggregator.aggregatePrices(priceSources, 'weighted_average');

    // Save individual price feeds
    const priceFeeds = priceSources.map(source => ({
      asset_id: asset.id,
      price: source.price,
      source: source.source,
      confidence_score: source.confidence,
    }));

    await supabase.from('price_feeds').insert(priceFeeds);

    // Save aggregation result
    const { error: aggregationError } = await supabase
      .from('price_aggregations')
      .insert([{
        asset_id: asset.id,
        aggregated_price: result.finalPrice,
        price_count: result.sourceCount,
        aggregation_method: result.method,
        standard_deviation: 0, // Calculate if needed
        min_price: Math.min(...priceSources.map(s => s.price)),
        max_price: Math.max(...priceSources.map(s => s.price)),
      }])
      .select()
      .single();

    if (aggregationError) throw aggregationError;

    return NextResponse.json({
      data: {
        symbol,
        aggregatedPrice: result.finalPrice,
        confidenceScore: result.confidenceScore,
        sourceCount: result.sourceCount,
        outliers: result.outliers.length,
        timestamp: new Date().toISOString(),
      },
      status: 'success',
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to aggregate prices', status: 'error' },
      { status: 500 }
    );
  }
}