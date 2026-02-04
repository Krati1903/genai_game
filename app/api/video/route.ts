import { NextRequest, NextResponse } from 'next/server';
import { connectToCluster } from '@/lib/ssh-client';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const videoPath = searchParams.get('path');

        if (!videoPath) {
            return NextResponse.json(
                { error: 'Video path is required' },
                { status: 400 }
            );
        }

        // Security: Validate the path is within expected directory
        if (!videoPath.startsWith('/output/') || videoPath.includes('..')) {
            return NextResponse.json(
                { error: 'Invalid video path' },
                { status: 403 }
            );
        }

        const ssh = await connectToCluster();
        
        // Use SFTP to get the file
        const sftp = await ssh.requestSFTP();
        
        return new Promise<NextResponse>((resolve) => {
            const chunks: Buffer[] = [];
            
            const readStream = sftp.createReadStream(videoPath);
            
            readStream.on('data', (chunk: Buffer) => {
                chunks.push(chunk);
            });
            
            readStream.on('end', () => {
                const videoBuffer = Buffer.concat(chunks);
                
                resolve(new NextResponse(videoBuffer, {
                    status: 200,
                    headers: {
                        'Content-Type': 'video/mp4',
                        'Content-Length': videoBuffer.length.toString(),
                        'Cache-Control': 'public, max-age=3600',
                        'Accept-Ranges': 'bytes'
                    }
                }));
            });
            
            readStream.on('error', (err: Error) => {
                console.error('SFTP read error:', err);
                resolve(NextResponse.json(
                    { error: 'Failed to read video file' },
                    { status: 500 }
                ));
            });
        });

    } catch (error) {
        console.error('Video streaming error:', error);
        return NextResponse.json(
            { 
                error: 'Failed to stream video',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

