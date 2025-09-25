import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('data_sources')
      .select('*')
      .order('reliability_score', { ascending: false });
    
    if (error) throw error;
    
    return NextResponse.json({
      data,
      status: 'success',
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch data sources', status: 'error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the data source by making a test request
    if (body.api_endpoint) {
      try {
        const response = await fetch(body.api_endpoint, {
          method: 'HEAD',
          signal: AbortSignal.timeout(5000),
        });
        
        if (!response.ok) {
          throw new Error('API endpoint is not accessible');
        }
      } catch {
        throw new Error('Failed to validate API endpoint');
      }
    }
    
    const { data, error } = await supabase
      .from('data_sources')
      .insert([{
        ...body,
        reliability_score: 0.8, // Start with a default score
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
      { error: error instanceof Error ? error.message : 'Failed to add data source', status: 'error' },
      { status: 500 }
    );
  }
}