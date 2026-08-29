// POST: Initialize game with genesis prompt
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${BACKEND_URL}/api/genesis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('[API/genesis] Error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize game', details: String(error) },
      { status: 500 }
    );
  }
}



