// GET: Proxy video from FastAPI backend
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    
    if (!path) {
      return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 });
    }
    
    // Proxy the video file from backend
    const response = await fetch(`${BACKEND_URL}/api/video?path=${encodeURIComponent(path)}`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }
    
    const videoBuffer = await response.arrayBuffer();
    
    return new NextResponse(videoBuffer, {
      headers: {
        'Content-Type': 'video/mp4',
        'Cache-Control': 'public, max-age=3600',
      },
    });
    
  } catch (error) {
    console.error('[API/get-video] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get video', details: String(error) },
      { status: 500 }
    );
  }
}
