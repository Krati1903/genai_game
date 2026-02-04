'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeColors {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
}

interface ThemeContextType {
    colors: ThemeColors;
    prompt: string;
    setPrompt: (prompt: string) => void;
    storyContext: string;
    appendToStory: (scene: string) => void;
    resetStory: () => void;
}

const defaultColors: ThemeColors = {
    primary: '#8b5cf6',    // violet
    secondary: '#6366f1',  // indigo
    accent: '#a78bfa',     // lighter violet
    glow: 'rgba(139, 92, 246, 0.4)'
};

// Keyword to color mapping for dynamic theming
const themeKeywords: Record<string, ThemeColors> = {
    ocean: {
        primary: '#0891b2',
        secondary: '#06b6d4',
        accent: '#22d3ee',
        glow: 'rgba(8, 145, 178, 0.4)'
    },
    sea: {
        primary: '#0891b2',
        secondary: '#06b6d4',
        accent: '#22d3ee',
        glow: 'rgba(8, 145, 178, 0.4)'
    },
    water: {
        primary: '#0284c7',
        secondary: '#0ea5e9',
        accent: '#38bdf8',
        glow: 'rgba(2, 132, 199, 0.4)'
    },
    fire: {
        primary: '#dc2626',
        secondary: '#ef4444',
        accent: '#f87171',
        glow: 'rgba(220, 38, 38, 0.4)'
    },
    lava: {
        primary: '#ea580c',
        secondary: '#f97316',
        accent: '#fb923c',
        glow: 'rgba(234, 88, 12, 0.4)'
    },
    forest: {
        primary: '#16a34a',
        secondary: '#22c55e',
        accent: '#4ade80',
        glow: 'rgba(22, 163, 74, 0.4)'
    },
    nature: {
        primary: '#15803d',
        secondary: '#16a34a',
        accent: '#22c55e',
        glow: 'rgba(21, 128, 61, 0.4)'
    },
    space: {
        primary: '#7c3aed',
        secondary: '#8b5cf6',
        accent: '#a78bfa',
        glow: 'rgba(124, 58, 237, 0.4)'
    },
    cosmic: {
        primary: '#6d28d9',
        secondary: '#7c3aed',
        accent: '#8b5cf6',
        glow: 'rgba(109, 40, 217, 0.4)'
    },
    desert: {
        primary: '#d97706',
        secondary: '#f59e0b',
        accent: '#fbbf24',
        glow: 'rgba(217, 119, 6, 0.4)'
    },
    sand: {
        primary: '#ca8a04',
        secondary: '#eab308',
        accent: '#facc15',
        glow: 'rgba(202, 138, 4, 0.4)'
    },
    night: {
        primary: '#4338ca',
        secondary: '#4f46e5',
        accent: '#6366f1',
        glow: 'rgba(67, 56, 202, 0.4)'
    },
    dark: {
        primary: '#374151',
        secondary: '#4b5563',
        accent: '#6b7280',
        glow: 'rgba(55, 65, 81, 0.4)'
    },
    ice: {
        primary: '#0e7490',
        secondary: '#06b6d4',
        accent: '#67e8f9',
        glow: 'rgba(14, 116, 144, 0.4)'
    },
    snow: {
        primary: '#64748b',
        secondary: '#94a3b8',
        accent: '#cbd5e1',
        glow: 'rgba(100, 116, 139, 0.4)'
    },
    blood: {
        primary: '#991b1b',
        secondary: '#b91c1c',
        accent: '#dc2626',
        glow: 'rgba(153, 27, 27, 0.4)'
    },
    gold: {
        primary: '#b45309',
        secondary: '#d97706',
        accent: '#fbbf24',
        glow: 'rgba(180, 83, 9, 0.4)'
    },
    neon: {
        primary: '#d946ef',
        secondary: '#e879f9',
        accent: '#f0abfc',
        glow: 'rgba(217, 70, 239, 0.4)'
    },
    cyberpunk: {
        primary: '#ec4899',
        secondary: '#f472b6',
        accent: '#06b6d4',
        glow: 'rgba(236, 72, 153, 0.4)'
    },
    sunset: {
        primary: '#e11d48',
        secondary: '#f43f5e',
        accent: '#fb7185',
        glow: 'rgba(225, 29, 72, 0.4)'
    },
    dawn: {
        primary: '#db2777',
        secondary: '#ec4899',
        accent: '#f472b6',
        glow: 'rgba(219, 39, 119, 0.4)'
    }
};

function deriveColorsFromPrompt(prompt: string): ThemeColors {
    const lowerPrompt = prompt.toLowerCase();
    
    for (const [keyword, colors] of Object.entries(themeKeywords)) {
        if (lowerPrompt.includes(keyword)) {
            return colors;
        }
    }
    
    return defaultColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [prompt, setPromptState] = useState('');
    const [colors, setColors] = useState<ThemeColors>(defaultColors);
    const [storyContext, setStoryContext] = useState('');

    const setPrompt = (newPrompt: string) => {
        setPromptState(newPrompt);
        setColors(deriveColorsFromPrompt(newPrompt));
    };

    const appendToStory = (scene: string) => {
        setStoryContext(prev => prev ? `${prev}\n\n${scene}` : scene);
    };

    const resetStory = () => {
        setStoryContext('');
        setPromptState('');
        setColors(defaultColors);
    };

    // Apply CSS variables when colors change
    useEffect(() => {
        document.documentElement.style.setProperty('--color-primary', colors.primary);
        document.documentElement.style.setProperty('--color-secondary', colors.secondary);
        document.documentElement.style.setProperty('--color-accent', colors.accent);
        document.documentElement.style.setProperty('--color-glow', colors.glow);
    }, [colors]);

    return (
        <ThemeContext.Provider value={{ 
            colors, 
            prompt, 
            setPrompt, 
            storyContext, 
            appendToStory,
            resetStory 
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

