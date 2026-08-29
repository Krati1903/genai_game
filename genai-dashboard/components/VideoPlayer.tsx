'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Loader2, AlertCircle, Play } from 'lucide-react';

interface VideoPlayerProps {
  videoPath: string | null;
  loading: boolean;
}

export function VideoPlayer({ videoPath, loading }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [videoKey, setVideoKey] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!videoPath) {
      setVideoUrl(null);
      return;
    }

    const generateVideo = async () => {
      try {
        setError(null);
        setVideoUrl(null);
        setIsGenerating(true);

        // Call FastAPI backend to generate video and return its URL
        const response = await fetch(
          `http://localhost:8000/generate-video?prompt=${encodeURIComponent(
            videoPath,
          )}`,
          {
            method: 'POST',
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Failed to generate video');
        }

        // Backend returns something like { url: "/videos/latest_scene.mp4" }
        const url =
          data.url.startsWith('http://') || data.url.startsWith('https://')
            ? data.url
            : `http://localhost:8000${data.url}`;

        setVideoUrl(url);
        setVideoKey(prev => prev + 1);
        setIsGenerating(false);
      } catch (err) {
        console.error('Error generating video:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to generate video',
        );
        setIsGenerating(false);
      }
    };

    generateVideo();
  }, [videoPath]);

  if (!videoUrl && !loading && !isGenerating) {
    return (
      <motion.div
        className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <Film className="w-20 h-20 text-blue-400 mx-auto mb-4" />
          </motion.div>
          <p className="text-white text-xl font-semibold mb-2">Your story begins...</p>
          <p className="text-gray-400 text-sm">Make a choice to continue</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <AnimatePresence mode="wait">
        {isGenerating || loading ? (
          <motion.div
            key="loading"
            className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              </motion.div>
              <p className="text-white text-xl font-semibold mb-2">Generating your scene...</p>
              <p className="text-gray-400 text-sm">This may take a moment</p>
            </motion.div>
          </motion.div>
        ) : videoUrl ? (
          <motion.video
            key={videoKey}
            ref={videoRef}
            src={videoUrl}
            autoPlay
            loop={false}
            controls
            className="w-full h-full object-contain"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            onError={() => setError('Failed to load video')}
            onLoadedData={() => {
              if (videoRef.current) {
                videoRef.current.play().catch(console.error);
              }
            }}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-red-500/20 border border-red-500/50 rounded-xl p-6 max-w-md mx-4"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <p className="text-red-300 font-semibold">Error</p>
              </div>
              <p className="text-red-200">{error}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
