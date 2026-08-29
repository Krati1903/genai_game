'use client';

import { useState, useEffect } from 'react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { OptionOverlay } from '@/components/OptionOverlay';
import { BehavioralOption } from '@/lib/utils';

interface GameState {
  videoPath: string | null;
  options: BehavioralOption[];
  sceneSummary: string;
  loading: boolean;
  error: string | null;
}

export default function LoopPage() {
  const [gameState, setGameState] = useState<GameState>({
    videoPath: null,
    options: [],
    sceneSummary: '',
    loading: false,
    error: null,
  });

  // Load initial options on mount
  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const response = await fetch('/api/get-options');
      const data = await response.json();
      
      setGameState(prev => ({
        ...prev,
        options: data.options || [],
        sceneSummary: data.scene_summary || '',
      }));
    } catch (err) {
      console.error('Failed to load options:', err);
    }
  };

  const handleChoice = async (choice: string, customPrompt?: string) => {
    setGameState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          choice,
          custom_prompt: customPrompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to execute choice');
      }

      // Update state with new video and options
      setGameState({
        videoPath: data.video_path,
        options: data.options?.options || [],
        sceneSummary: data.options?.scene_summary || '',
        loading: false,
        error: null,
      });
    } catch (err) {
      setGameState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to execute choice',
      }));
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Video Player */}
      <VideoPlayer 
        videoPath={gameState.videoPath}
        loading={gameState.loading}
      />

      {/* Loading Overlay */}
      {gameState.loading && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white text-xl">Generating your story...</p>
            <p className="text-gray-400 text-sm mt-2">This may take a moment</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {gameState.error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {gameState.error}
        </div>
      )}

      {/* Options Overlay */}
      {!gameState.loading && gameState.options.length > 0 && (
        <OptionOverlay
          options={gameState.options}
          sceneSummary={gameState.sceneSummary}
          onChoice={handleChoice}
        />
      )}
    </div>
  );
}
