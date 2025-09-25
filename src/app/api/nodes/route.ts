import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const active = searchParams.get('active');
    
    let query = supabase.from('oracle_nodes').select('*');
    
    if (active !== null) {
      query = query.eq('is_active', active === 'true');
    }
    
    const { data, error } = await query.order('reputation_score', { ascending: false });
    
    if (error) throw error;
    
    return NextResponse.json({
      data,
      status: 'success',
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch nodes', status: 'error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate Ethereum address format
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!addressRegex.test(body.address)) {
      throw new Error('Invalid Ethereum address format');
    }
    
    const { data, error } = await supabase
      .from('oracle_nodes')
      .insert([{
        ...body,
        reputation_score: 100.00,
        is_active: true,
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({
      data,
      status: 'success',
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to register node', status: 'error' },
      { status: 500 }
    );
  }
}