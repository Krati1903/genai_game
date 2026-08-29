'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BehavioralOption } from '@/lib/utils';
import { Send, X, Sparkles } from 'lucide-react';

interface OptionOverlayProps {
  options: BehavioralOption[];
  sceneSummary: string;
  onChoice: (choice: string, customPrompt?: string) => void;
}

export function OptionOverlay({ options, sceneSummary, onChoice }: OptionOverlayProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  const handleOptionClick = (optionId: string) => {
    if (optionId === 'Custom') {
      setShowCustom(true);
    } else {
      onChoice(optionId);
    }
  };

  const handleCustomSubmit = () => {
    if (customPrompt.trim()) {
      onChoice('Custom', customPrompt);
      setShowCustom(false);
      setCustomPrompt('');
    }
  };

  const getButtonColor = (id: string) => {
    switch (id) {
      case 'A': return 'from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700';
      case 'B': return 'from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700';
      case 'C': return 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700';
      case 'D': return 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700';
      default: return 'from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800';
    }
  };

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-8 z-40"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Scene Summary */}
      <AnimatePresence>
        {sceneSummary && (
          <motion.div
            className="mb-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <p className="text-white text-lg font-medium">{sceneSummary}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Prompt Input */}
      <AnimatePresence>
        {showCustom && (
          <motion.div
            className="mb-4 bg-black/60 backdrop-blur-lg rounded-xl p-4 border border-white/20 shadow-xl"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Describe your custom action..."
              className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              autoFocus
            />
            <div className="flex gap-2 mt-3">
              <motion.button
                onClick={handleCustomSubmit}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="w-4 h-4" />
                Submit
              </motion.button>
              <motion.button
                onClick={() => {
                  setShowCustom(false);
                  setCustomPrompt('');
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Options Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {options.map((option, index) => (
          <motion.button
            key={option.id}
            onClick={() => handleOptionClick(option.id)}
            className={`bg-gradient-to-br ${getButtonColor(option.id)} text-white p-6 rounded-xl shadow-lg text-left group relative overflow-hidden`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.05, zIndex: 10 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-white/10"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.5 }}
            />
            <div className="relative z-10">
              <div className="text-2xl font-bold mb-2">{option.id}</div>
              <div className="text-lg font-semibold mb-2">{option.label}</div>
              <div className="text-sm opacity-90 mb-2">{option.description}</div>
              <div className="text-xs opacity-75 italic">{option.consequences_hint || option.hint}</div>
            </div>
          </motion.button>
        ))}

        {/* Custom Option Button */}
        <motion.button
          onClick={() => handleOptionClick('Custom')}
          className="bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white p-6 rounded-xl shadow-lg text-left relative overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: options.length * 0.1, duration: 0.3 }}
          whileHover={{ scale: 1.05, zIndex: 10 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute inset-0 bg-white/10"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.5 }}
          />
          <div className="relative z-10">
            <div className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-lg font-semibold mb-2">Custom</div>
            <div className="text-sm opacity-90">Create your own path</div>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
}
