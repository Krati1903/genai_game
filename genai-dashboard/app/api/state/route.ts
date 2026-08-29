// GET: Get current game state
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/state`);
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('[API/state] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get state', details: String(error) },
      { status: 500 }
    );
  }
}



