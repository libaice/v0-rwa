import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const interval = searchParams.get('interval') || '1h';
    
    // Get asset ID from symbol
    const { data: asset, error: assetError } = await supabase
      .from('assets')
      .select('id')
      .eq('symbol', (await params).symbol.toUpperCase())
      .single();
    
    if (assetError || !asset) {
      throw new Error('Asset not found');
    }
    
    let query = supabase
      .from('price_feeds')
      .select('price, timestamp, source')
      .eq('asset_id', asset.id)
      .order('timestamp', { ascending: true });
    
    if (from) {
      query = query.gte('timestamp', from);
    }
    
    if (to) {
      query = query.lte('timestamp', to);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Aggregate data based on interval
    const aggregatedData = aggregateByInterval(data, interval);
    
    return NextResponse.json({
      data: aggregatedData,
      status: 'success',
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch price history', status: 'error' },
      { status: 500 }
    );
  }
}

interface PriceFeedItem {
  price: number;
  timestamp: string;
  source: string;
}

function aggregateByInterval(
  data: PriceFeedItem[],
  interval: string
): Array<{ timestamp: string; price: number; high: number; low: number; count: number }> {
  if (!data || data.length === 0) return [];
  
  const intervalMs = {
    '1m': 60 * 1000,
    '5m': 5 * 60 * 1000,
    '15m': 15 * 60 * 1000,
    '30m': 30 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '4h': 4 * 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000,
  }[interval] || 60 * 60 * 1000;
  
  const buckets = new Map<number, PriceFeedItem[]>();
  
  data.forEach(item => {
    const bucketTime = Math.floor(new Date(item.timestamp).getTime() / intervalMs) * intervalMs;
    
    if (!buckets.has(bucketTime)) {
      buckets.set(bucketTime, []);
    }
    
    buckets.get(bucketTime)!.push(item);
  });
  
  return Array.from(buckets.entries()).map(([timestamp, items]) => {
    const prices = items.map(item => item.price);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    
    return {
      timestamp: new Date(timestamp).toISOString(),
      price: avgPrice,
      high: Math.max(...prices),
      low: Math.min(...prices),
      count: items.length,
    };
  });
}