import { NextRequest, NextResponse } from 'next/server';
import { submitJob, executeCommand } from '@/lib/ssh-client';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, prompt, context, genesisPrompt } = body;

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        let result;

        switch (action) {
            case 'genesis':
                // Initial video generation from genesis prompt
                result = await submitJob(prompt);
                break;

            case 'continue':
                // Continue the story with context
                result = await submitJob(
                    genesisPrompt || prompt,
                    context,
                    prompt
                );
                break;

            case 'custom':
                // Custom command execution (for admin/debug)
                const output = await executeCommand(prompt);
                return NextResponse.json({ output });

            default:
                return NextResponse.json(
                    { error: 'Invalid action' },
                    { status: 400 }
                );
        }

        return NextResponse.json({
            success: true,
            jobId: result.jobId,
            outputPath: result.outputPath,
            message: `Job ${result.jobId} submitted successfully`
        });

    } catch (error) {
        console.error('SSH execution error:', error);
        return NextResponse.json(
            { 
                error: 'Failed to execute command on cluster',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

