// GET: Forward to FastAPI backend on HPC
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/options`);
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('[API/get-options] Error:', error);
    
    // Return fallback options
    return NextResponse.json({
      scene_summary: "The story awaits your decision...",
      options: [
        { id: "A", label: "Take Bold Action", description: "Confront directly", hint: "Shows strength" },
        { id: "B", label: "Seek Diplomacy", description: "Find common ground", hint: "Builds trust" },
        { id: "C", label: "Find Another Way", description: "Look for alternatives", hint: "Clever approach" },
        { id: "D", label: "Wait and Observe", description: "Gather information", hint: "Cautious" },
      ]
    });
  }
}
