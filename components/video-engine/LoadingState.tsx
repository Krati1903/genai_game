'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';

interface LoadingStateProps {
    status: 'pending' | 'running' | 'completed' | 'failed';
    sceneNumber: number;
}

const statusMessages = {
    pending: 'Queuing neural pathways...',
    running: 'AI is dreaming your scene...',
    completed: 'Rendering complete',
    failed: 'Dream interrupted'
};

const dreamingPhrases = [
    'Weaving narrative threads...',
    'Painting with photons...',
    'Sculpting temporal sequences...',
    'Harmonizing visual frequencies...',
    'Crystallizing imagination...',
    'Rendering infinite possibilities...',
    'Manifesting your vision...',
    'Dreaming in frames...'
];

export default function LoadingState({ status, sceneNumber }: LoadingStateProps) {
    const { colors } = useTheme();
    
    const randomPhrase = dreamingPhrases[Math.floor(Math.random() * dreamingPhrases.length)];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-[#050508] flex flex-col items-center justify-center"
        >
            {/* Background Animation */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Pulsing Gradient Orbs */}
                <motion.div
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px]"
                    style={{ backgroundColor: colors.primary }}
                />
                <motion.div
                    animate={{ 
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ 
                        duration: 5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 1
                    }}
                    className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full blur-[100px]"
                    style={{ backgroundColor: colors.secondary }}
                />

                {/* Floating Particles */}
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full"
                        style={{ backgroundColor: `${colors.accent}80` }}
                        initial={{
                            x: `${Math.random() * 100}vw`,
                            y: `${Math.random() * 100}vh`,
                        }}
                        animate={{
                            y: [`${Math.random() * 100}vh`, `${Math.random() * 100}vh`],
                            x: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 5 + Math.random() * 5,
                            repeat: Infinity,
                            ease: 'linear',
                            delay: Math.random() * 3
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 text-center">
                {/* Animated Logo/Icon */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    className="relative w-32 h-32 mx-auto mb-12"
                >
                    {/* Outer Ring */}
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-dashed"
                        style={{ borderColor: `${colors.primary}40` }}
                        animate={{ rotate: -360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                    />
                    
                    {/* Middle Ring */}
                    <motion.div
                        className="absolute inset-4 rounded-full border"
                        style={{ borderColor: `${colors.accent}60` }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                    />
                    
                    {/* Inner Glow */}
                    <motion.div
                        className="absolute inset-8 rounded-full"
                        style={{ backgroundColor: colors.primary }}
                        animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    
                    {/* Center Symbol */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.span
                            className="text-4xl"
                            animate={{ 
                                opacity: [0.7, 1, 0.7],
                                scale: [0.9, 1, 0.9]
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            ◈
                        </motion.span>
                    </div>
                </motion.div>

                {/* Status Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 
                        className="text-2xl md:text-3xl font-serif font-light mb-4"
                        style={{ color: colors.accent }}
                    >
                        {status === 'running' ? randomPhrase : statusMessages[status]}
                    </h2>
                    
                    <p className="text-gray-500 text-sm tracking-widest uppercase">
                        Generating Scene {sceneNumber}
                    </p>
                </motion.div>

                {/* Progress Indicator */}
                <motion.div
                    className="mt-12 flex items-center gap-2 justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: colors.primary }}
                            animate={{ 
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 1, 0.3]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                        />
                    ))}
                </motion.div>

                {/* Estimated Time */}
                <motion.p
                    className="mt-8 text-gray-600 text-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    Estimated generation time: 30-50 seconds
                </motion.p>
            </div>
        </motion.div>
    );
}

