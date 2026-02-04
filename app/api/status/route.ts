import { NextRequest, NextResponse } from 'next/server';
import { checkJobStatus, getLatestVideo } from '@/lib/ssh-client';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const jobId = searchParams.get('jobId');

        if (!jobId) {
            return NextResponse.json(
                { error: 'Job ID is required' },
                { status: 400 }
            );
        }

        const status = await checkJobStatus(jobId);
        
        let videoUrl = null;
        if (status === 'completed') {
            // Get the video path - in production, this would be served via a file server
            const videoPath = await getLatestVideo();
            if (videoPath) {
                // Convert cluster path to accessible URL
                // This assumes you have a file server or proxy set up
                videoUrl = `/api/video?path=${encodeURIComponent(videoPath)}`;
            }
        }

        return NextResponse.json({
            jobId,
            status,
            videoUrl,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Status check error:', error);
        return NextResponse.json(
            { 
                error: 'Failed to check job status',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

