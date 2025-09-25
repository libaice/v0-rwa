import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabase) {
      throw new Error('Database connection not configured');
    }
    
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('id', (await params).id)
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({
      data,
      status: 'success',
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Asset not found', status: 'error' },
      { status: 404 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabase) {
      throw new Error('Database connection not configured');
    }
    
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('assets')
      .update(body)
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
      { error: error instanceof Error ? error.message : 'Failed to update asset', status: 'error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabase) {
      throw new Error('Database connection not configured');
    }
    
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', (await params).id);
    
    if (error) throw error;
    
    return NextResponse.json({
      message: 'Asset deleted successfully',
      status: 'success',
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete asset', status: 'error' },
      { status: 500 }
    );
  }
}