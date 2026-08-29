'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BehavioralOption } from '@/lib/utils';
import { Send, X, ChevronRight, Zap } from 'lucide-react';

interface OptionOverlayProps {
  options: BehavioralOption[];
  onChoice: (choice: string, customPrompt?: string) => void;
}

export function OptionOverlay({ options, onChoice }: OptionOverlayProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  const submitCustom = () => {
    if (customPrompt.trim()) {
      onChoice('Custom', customPrompt);
      setShowCustom(false);
      setCustomPrompt('');
    }
  };

  return (
    <div className="absolute inset-x-0 bottom-0 z-40 px-6 sm:px-10 pb-5 pt-28 bg-gradient-to-t from-black via-black/85 to-transparent">
      <div className="max-w-4xl mx-auto">
        {/* Prompt header */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <Zap className="w-3.5 h-3.5 text-[#FFB800]" fill="currentColor" />
          <span className="font-[family-name:var(--font-mono)] text-[#FFB800] text-xs sm:text-sm tracking-[0.4em]">
            WHAT DO YOU DO?
          </span>
          <Zap className="w-3.5 h-3.5 text-[#FFB800]" fill="currentColor" />
        </div>

        {/* Custom path */}
        <AnimatePresence>
          {showCustom && (
            <motion.div
              className="mb-4 bg-black/80 backdrop-blur-lg rounded-xl p-4 border border-[#FFB800]/30"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    submitCustom();
                  }
                }}
                placeholder="Describe your own action..."
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-white/25 focus:outline-none focus:border-[#FFB800]/50 resize-none font-[family-name:var(--font-mono)] text-sm"
                rows={3}
                autoFocus
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={submitCustom}
                  className="flex-1 bg-gradient-to-r from-[#FFB800] to-[#FF8C00] text-black font-[family-name:var(--font-display)] font-black py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-xs tracking-[0.1em] hover:brightness-110 transition-all"
                >
                  <Send className="w-4 h-4" />
                  FORGE PATH
                </button>
                <button
                  onClick={() => {
                    setShowCustom(false);
                    setCustomPrompt('');
                  }}
                  className="px-4 py-2 text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Options 2×2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {options.map((option, index) => (
            <motion.button
              key={option.id}
              onClick={() => onChoice(option.id)}
              className="group relative flex items-center gap-4 px-4 py-4 rounded-xl bg-white/[0.05] border border-white/[0.09] hover:border-[#FFB800]/50 hover:bg-white/[0.09] transition-colors text-left"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.3 }}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              title={option.consequences_hint || option.hint}
            >
              <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#FFB800]/15 border border-[#FFB800]/25 grid place-items-center font-[family-name:var(--font-display)] font-black text-[#FFB800] group-hover:bg-[#FFB800] group-hover:text-black transition-colors">
                {index + 1}
              </span>

              <span className="flex-1 min-w-0 font-semibold text-[15px] text-white truncate">
                {option.label}
              </span>

              <ChevronRight className="flex-shrink-0 w-5 h-5 text-white/25 group-hover:text-[#FFB800] group-hover:translate-x-0.5 transition-all" />
            </motion.button>
          ))}
        </div>

        {/* Forge own path */}
        {!showCustom && (
          <button
            onClick={() => setShowCustom(true)}
            className="w-full mt-5 font-[family-name:var(--font-mono)] text-[10px] sm:text-[11px] tracking-[0.35em] text-white/25 hover:text-[#FFB800] transition-colors"
          >
            OR FORGE YOUR OWN PATH
          </button>
        )}
      </div>
    </div>
  );
}
