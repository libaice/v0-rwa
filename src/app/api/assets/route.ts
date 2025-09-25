import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      throw new Error('Database connection not configured');
    }
    
    const searchParams = request.nextUrl.searchParams;
    const asset_type = searchParams.get('asset_type');
    const status = searchParams.get('status');
    
    let query = supabase.from('assets').select('*');
    
    if (asset_type) {
      query = query.eq('asset_type', asset_type);
    }
    
    if (status) {
      query = query.eq('verification_status', status);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return NextResponse.json({
      data,
      status: 'success',
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch assets', status: 'error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      throw new Error('Database connection not configured');
    }
    
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('assets')
      .insert([body])
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({
      data,
      status: 'success',
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create asset', status: 'error' },
      { status: 500 }
    );
  }
}