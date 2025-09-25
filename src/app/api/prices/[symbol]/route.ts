import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    // First get the asset ID from symbol
    const { data: asset, error: assetError } = await supabase
      .from('assets')
      .select('id')
      .eq('symbol', params.symbol.toUpperCase())
      .single();
    
    if (assetError || !asset) {
      throw new Error('Asset not found');
    }
    
    // Get the latest price
    const { data: latestPrice, error: priceError } = await supabase
      .from('price_feeds')
      .select('*')
      .eq('asset_id', asset.id)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();
    
    if (priceError) throw priceError;
    
    // Get 24h ago price for change calculation
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: oldPrice } = await supabase
      .from('price_feeds')
      .select('price')
      .eq('asset_id', asset.id)
      .lte('timestamp', twentyFourHoursAgo)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();
    
    const change24h = oldPrice 
      ? ((latestPrice.price - oldPrice.price) / oldPrice.price) * 100
      : 0;
    
    return NextResponse.json({
      data: {
        symbol: params.symbol.toUpperCase(),
        price: latestPrice.price,
        timestamp: latestPrice.timestamp,
        change24h,
        confidence_score: latestPrice.confidence_score,
        source: latestPrice.source,
      },
      status: 'success',
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch price', status: 'error' },
      { status: 500 }
    );
  }
}