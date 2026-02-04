import { NextRequest, NextResponse } from 'next/server';

interface Choice {
    id: number;
    text: string;
}

// In production, this would call an LLM API (GPT-4, Claude, etc.)
// For now, we generate contextual choices based on the prompt
async function generateChoices(context: string, genesisPrompt: string): Promise<Choice[]> {
    // Extract key themes from the prompts
    const combinedText = `${genesisPrompt} ${context}`.toLowerCase();
    
    // Theme-based choice templates
    const themeChoices: Record<string, Choice[]> = {
        forest: [
            { id: 1, text: 'Follow the winding path deeper into the ancient woods' },
            { id: 2, text: 'Climb to the highest branch to survey the landscape' },
            { id: 3, text: 'Investigate the strange glowing fungi nearby' },
            { id: 4, text: 'Rest beneath the whispering canopy' }
        ],
        ocean: [
            { id: 1, text: 'Dive beneath the crystalline waves' },
            { id: 2, text: 'Follow the coastline toward the distant lighthouse' },
            { id: 3, text: 'Signal the mysterious ship on the horizon' },
            { id: 4, text: 'Explore the tidal caves revealed by low tide' }
        ],
        space: [
            { id: 1, text: 'Navigate toward the pulsing nebula' },
            { id: 2, text: 'Investigate the derelict station drifting nearby' },
            { id: 3, text: 'Respond to the cryptic transmission' },
            { id: 4, text: 'Enter the asteroid field for cover' }
        ],
        city: [
            { id: 1, text: 'Descend into the neon-lit underground' },
            { id: 2, text: 'Scale the megastructure to reach the upper levels' },
            { id: 3, text: 'Follow the mysterious figure into the alley' },
            { id: 4, text: 'Blend into the crowded marketplace' }
        ],
        desert: [
            { id: 1, text: 'Press onward toward the mirage-like oasis' },
            { id: 2, text: 'Seek shelter in the ancient ruins' },
            { id: 3, text: 'Follow the caravan tracks in the sand' },
            { id: 4, text: 'Investigate the half-buried artifact' }
        ],
        mountain: [
            { id: 1, text: 'Ascend the treacherous peak' },
            { id: 2, text: 'Enter the dark cave mouth' },
            { id: 3, text: 'Follow the mountain stream to its source' },
            { id: 4, text: 'Approach the distant monastery' }
        ]
    };

    // Detect theme
    const themes = Object.keys(themeChoices);
    for (const theme of themes) {
        if (combinedText.includes(theme)) {
            return themeChoices[theme];
        }
    }

    // Generic fallback choices
    return [
        { id: 1, text: 'Move forward and embrace the unknown' },
        { id: 2, text: 'Retreat and seek a different path' },
        { id: 3, text: 'Observe and gather more information' },
        { id: 4, text: 'Call out to see if anyone responds' }
    ];
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { context = '', genesisPrompt = '' } = body;

        // In production, integrate with actual LLM
        // const llmResponse = await callLLM({
        //     system: "Generate 4 narrative choices for a choose-your-own-adventure story...",
        //     user: `Context: ${context}\nGenesis: ${genesisPrompt}`
        // });

        const choices = await generateChoices(context, genesisPrompt);

        return NextResponse.json({
            success: true,
            choices,
            generatedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('Choice generation error:', error);
        return NextResponse.json(
            { 
                error: 'Failed to generate choices',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

