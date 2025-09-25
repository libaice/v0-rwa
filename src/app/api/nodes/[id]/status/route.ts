import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { is_active } = body;
    
    if (typeof is_active !== 'boolean') {
      throw new Error('is_active must be a boolean value');
    }
    
    const { data, error } = await supabase
      .from('oracle_nodes')
      .update({ is_active })
      .eq('id', (await params).id)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({
      data,
      status: 'success',
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update node status', status: 'error' },
      { status: 500 }
    );
  }
}