import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      throw new Error('URL is required');
    }
    
    const response = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(10000),
    });
    
    const isValid = response.ok;
    const responseTime = Date.now();
    
    let dataFormat = 'unknown';
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      dataFormat = 'json';
    } else if (contentType?.includes('text/xml') || contentType?.includes('application/xml')) {
      dataFormat = 'xml';
    } else if (contentType?.includes('text/csv')) {
      dataFormat = 'csv';
    }
    
    return NextResponse.json({
      data: {
        url,
        isValid,
        statusCode: response.status,
        responseTime,
        dataFormat,
        headers: Object.fromEntries(response.headers.entries()),
      },
      status: 'success',
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to validate source',
        status: 'error',
      },
      { status: 500 }
    );
  }
}