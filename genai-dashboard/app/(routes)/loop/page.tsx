'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoPlayer } from '@/components/VideoPlayer';
import { OptionOverlay } from '@/components/OptionOverlay';
import { BehavioralOption } from '@/lib/utils';
import { ScrollText, AlertCircle } from 'lucide-react';

interface ChronicleEntry {
  id: number;
  label: string;
}

export default function LoopPage() {
  const [videoPath, setVideoPath] = useState<string | null>(null);
  const [options, setOptions] = useState<BehavioralOption[]>([]);
  const [genesisPrompt, setGenesisPrompt] = useState('');
  const [sceneId, setSceneId] = useState(0);
  const [chronicle, setChronicle] = useState<ChronicleEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hydrate from the state /api/genesis already generated (script + video + options).
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/state');
        const state = await res.json();

        setGenesisPrompt(state.genesis_prompt || '');
        setVideoPath(state.current_video || null);
        setSceneId(state.current_scene || 0);
        setOptions(state.current_options?.options || []);
        setChronicle(
          (state.history || []).map((h: { scene_id: number; choice_label: string }) => ({
            id: h.scene_id,
            label: h.choice_label,
          }))
        );
      } catch {
        setError('Could not reach the backend. Is it running on port 8000?');
      }
    })();
  }, []);

  const handleChoice = async (choice: string, customPrompt?: string) => {
    setLoading(true);
    setError(null);

    const chosenLabel =
      customPrompt || options.find((o) => o.id === choice)?.label || choice;

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice, custom_prompt: customPrompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to execute choice');

      setChronicle((prev) => [...prev, { id: data.scene_id, label: chosenLabel }]);
      setVideoPath(data.video_path);
      setSceneId(data.scene_id);
      setOptions(data.options?.options || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute choice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#05050a] overflow-hidden text-white">
      {/* ── Stage ──────────────────────────────────────────────── */}
      <div className="relative flex-1 overflow-hidden scanlines">
        <VideoPlayer videoPath={videoPath} loading={loading} />

        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-[#FFB800] rounded-xl blur-md opacity-50" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFB800] to-[#FF8C00] grid place-items-center">
                <span className="text-black font-black text-xl leading-none">∞</span>
              </div>
            </div>
            <span className="font-[family-name:var(--font-display)] font-bold tracking-[0.12em] text-sm text-white/70 group-hover:text-white transition-colors">
              EXIT
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-green-500/15 border border-green-500/30">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_#4ade80]" />
              <span className="font-[family-name:var(--font-mono)] text-green-400 text-[11px] tracking-[0.15em]">
                LIVE
              </span>
            </span>
            <span className="px-4 py-2 rounded-lg bg-[#FFB800]/15 border border-[#FFB800]/30 font-[family-name:var(--font-mono)] text-[#FFB800] text-sm tracking-[0.15em]">
              SCENE {sceneId}
            </span>
          </div>
        </div>

        {/* Scene title */}
        {genesisPrompt && (
          <div className="absolute inset-x-0 top-[16%] z-20 px-10 pointer-events-none">
            <motion.h1
              key={genesisPrompt}
              className="font-[family-name:var(--font-title)] font-bold uppercase text-center text-3xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-[0.01em] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              {genesisPrompt}
            </motion.h1>
          </div>
        )}

        {/* Error toast */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="absolute top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-red-500/90 text-white px-5 py-3 rounded-xl shadow-xl text-sm max-w-md"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Choices */}
        {!loading && options.length > 0 && (
          <OptionOverlay options={options} onChoice={handleChoice} />
        )}
      </div>

      {/* ── Story Chronicle ────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-[380px] flex-shrink-0 border-l border-white/[0.08] bg-[#0a0a12]">
        <div className="px-5 py-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <ScrollText className="w-5 h-5 text-[#FFB800]" />
            <h2 className="font-[family-name:var(--font-display)] font-black tracking-[0.12em] text-[#FFB800]">
              STORY CHRONICLE
            </h2>
          </div>
          <p className="text-white/30 text-xs mt-2">Your journey through the nexus</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5">
          {chronicle.length === 0 && (
            <p className="text-white/20 text-sm text-center mt-10 px-4 leading-relaxed">
              Your chronicle is empty. Make a choice to begin writing it.
            </p>
          )}

          {chronicle.map((entry, i) => {
            const isCurrent = i === chronicle.length - 1;
            return (
              <motion.div
                key={`${entry.id}-${i}`}
                className={`relative flex items-center gap-3.5 p-4 rounded-xl border transition-colors ${
                  isCurrent
                    ? 'bg-[#FFB800]/[0.09] border-[#FFB800]/35'
                    : 'bg-white/[0.03] border-white/[0.07]'
                }`}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {isCurrent && (
                  <span className="absolute -left-px top-3 bottom-3 w-[3px] rounded-r bg-[#FFB800]" />
                )}
                <span
                  className={`flex-shrink-0 w-9 h-9 rounded-lg grid place-items-center font-[family-name:var(--font-display)] font-black text-sm ${
                    isCurrent
                      ? 'bg-[#FFB800] text-black'
                      : 'bg-white/[0.05] text-white/35 border border-white/10'
                  }`}
                >
                  {entry.id}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] text-white/90 truncate">{entry.label}</p>
                  {isCurrent && (
                    <p className="font-[family-name:var(--font-mono)] text-[10px] text-[#00F0FF] tracking-[0.18em] mt-1">
                      ● NOW PLAYING
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="px-5 py-5 border-t border-white/[0.08] text-center">
          <p className="font-[family-name:var(--font-display)] font-black tracking-[0.15em] text-[#FFB800]">
            INFINILIFE
          </p>
          <p className="text-white/25 text-xs mt-1.5">Your story, infinite possibilities</p>
        </div>
      </aside>
    </div>
  );
}
