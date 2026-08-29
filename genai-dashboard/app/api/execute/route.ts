// POST: Forward to FastAPI backend
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward to FastAPI backend
    const response = await fetch(`${BACKEND_URL}/api/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || data.error || 'Failed to execute choice' },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('[API/execute] Error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend', details: String(error) },
      { status: 500 }
    );
  }
}
