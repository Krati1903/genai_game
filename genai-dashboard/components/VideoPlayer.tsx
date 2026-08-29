'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clapperboard, AlertCircle } from 'lucide-react';

interface VideoPlayerProps {
  videoPath: string | null;
  loading: boolean;
}

export function VideoPlayer({ videoPath, loading }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [videoKey, setVideoKey] = useState(0);

  useEffect(() => {
    if (!videoPath) {
      setVideoUrl(null);
      return;
    }
    // The scene video was already generated server-side by /api/genesis or
    // /api/execute; videoPath is the local file the backend returned, so just
    // stream it through /api/get-video rather than re-triggering generation.
    setError(null);
    setVideoUrl(`/api/get-video?path=${encodeURIComponent(videoPath)}`);
    setVideoKey((k) => k + 1);
  }, [videoPath]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Starfield fallback backdrop */}
      <div className="absolute inset-0 bg-[#05050a]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
      </div>

      {/* Video */}
      <AnimatePresence>
        {videoUrl && !loading && (
          <motion.video
            key={videoKey}
            ref={videoRef}
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            onError={() => setError('Failed to load video')}
            onLoadedData={() => videoRef.current?.play().catch(() => {})}
          />
        )}
      </AnimatePresence>

      {/* Cinematic vignette so overlaid text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70 pointer-events-none" />

      {/* Center play badge / generating state */}
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <div className="flex flex-col items-center gap-5">
          <motion.div
            className="w-24 h-24 rounded-full bg-black/35 backdrop-blur-sm border border-white/15 grid place-items-center"
            animate={loading ? { scale: [1, 1.06, 1] } : {}}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            {loading ? (
              <span className="w-9 h-9 border-[3px] border-[#00F0FF]/25 border-t-[#00F0FF] rounded-full animate-spin" />
            ) : (
              <span className="w-0 h-0 border-y-[15px] border-y-transparent border-l-[24px] border-l-white/85 ml-2" />
            )}
          </motion.div>

          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-white/25" />
            <span className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[10px] sm:text-[11px] text-white/45 tracking-[0.35em]">
              <Clapperboard className="w-3.5 h-3.5" />
              {loading ? 'GENERATING SCENE...' : 'AI VIDEO GENERATION'}
            </span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-white/25" />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            className="absolute inset-0 grid place-items-center bg-black/90 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-red-500/15 border border-red-500/40 rounded-xl p-6 max-w-md mx-4">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <p className="text-red-300 font-semibold">Error</p>
              </div>
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
