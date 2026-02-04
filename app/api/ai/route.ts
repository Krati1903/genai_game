import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const data = await request.json();
    
    // Handle AI-related functionality here
    // For example, you might call an AI service with the data received

    return NextResponse.json({ message: 'AI request processed', data });
}

export async function GET() {
    // Handle GET requests if needed
    return NextResponse.json({ message: 'AI API is working' });
}