'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LoopPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [sceneNumber, setSceneNumber] = useState(1);
    const [choices, setChoices] = useState<string[]>([]);
    const [customInput, setCustomInput] = useState('');
    const [genesisPrompt, setGenesisPrompt] = useState('');
    const [chapters, setChapters] = useState<string[]>([]);
    const [loadingPhase, setLoadingPhase] = useState(0);

    const loadingMessages = ['Initializing neural pathways...', 'Weaving narrative threads...', 'Rendering your reality...', 'Synchronizing timelines...', 'Materializing your chapter...'];

    useEffect(() => {
        const prompt = sessionStorage.getItem('genesisPrompt') || 'A mysterious traveler';
        setGenesisPrompt(prompt);
        setChapters([prompt]);
        
        const phaseInterval = setInterval(() => setLoadingPhase(p => (p + 1) % loadingMessages.length), 700);
        const timer = setTimeout(() => {
            setIsLoading(false);
            clearInterval(phaseInterval);
            setChoices(['Explore your surroundings', 'Speak to someone nearby', 'Examine your belongings', 'Take a moment to observe']);
        }, 4000);

        return () => { clearTimeout(timer); clearInterval(phaseInterval); };
    }, []);

    const handleChoice = (choice: string) => {
        setIsLoading(true);
        setChoices([]);
        setCustomInput('');
        setChapters(prev => [...prev, choice]);
        setLoadingPhase(0);
        
        const phaseInterval = setInterval(() => setLoadingPhase(p => (p + 1) % loadingMessages.length), 700);
        setTimeout(() => {
            setSceneNumber(prev => prev + 1);
            setIsLoading(false);
            clearInterval(phaseInterval);
            setChoices(['Continue forward', 'Change your approach', 'Investigate further', 'Try something unexpected']);
        }, 4000);
    };

    return (
        <div className="h-screen w-screen bg-black text-white overflow-hidden flex">
            
            {/* Main Area */}
            <div className="flex-1 flex flex-col relative">
                
                {/* Video Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-cover bg-center scale-110" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80')`, animation: 'cinematicZoom 40s ease-in-out infinite alternate' }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/10 animate-pulse" style={{ animationDuration: '5s' }} />
                </div>

                {/* Scanlines */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)' }} />

                {/* Loading */}
                {isLoading && (
                    <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center">
                        <div className="relative w-48 h-48 mb-10">
                            <div className="absolute inset-0 rounded-full border-2 border-[#FFB800]/20" style={{ animation: 'spin 10s linear infinite' }} />
                            <div className="absolute inset-4 rounded-full border-2 border-[#00F0FF]/30" style={{ animation: 'spin 8s linear infinite reverse' }} />
                            <div className="absolute inset-8 rounded-full border border-[#FFB800]/40" style={{ animation: 'spin 6s linear infinite' }} />
                            <div className="absolute inset-12 rounded-full border border-[#00F0FF]/50" style={{ animation: 'spin 4s linear infinite reverse' }} />
                            <div className="absolute inset-16 rounded-full bg-gradient-to-br from-[#FFB800]/30 to-[#00F0FF]/30 animate-pulse" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="font-title text-7xl text-[#FFB800] animate-pulse" style={{ textShadow: '0 0 40px #FFB800, 0 0 80px #FFB800' }}>∞</span>
                            </div>
                            {[0, 1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="absolute w-3 h-3 rounded-full" style={{ background: i % 2 === 0 ? '#FFB800' : '#00F0FF', boxShadow: `0 0 15px ${i % 2 === 0 ? '#FFB800' : '#00F0FF'}`, top: '50%', left: '50%', transform: `rotate(${i * 60}deg) translateX(90px)`, animation: `orbit ${3 + i * 0.5}s linear infinite` }} />
                            ))}
                        </div>

                        <p className="font-title text-4xl text-white mb-3">The AI is weaving your next chapter...</p>
                        <p className="font-mono text-[#00F0FF] text-sm animate-pulse" style={{ textShadow: '0 0 20px #00F0FF' }}>{loadingMessages[loadingPhase]}</p>
                        <div className="mt-6 px-6 py-2 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/30">
                            <span className="font-mono text-[#FFB800] text-sm tracking-[0.2em]">SCENE {sceneNumber}</span>
                        </div>
                    </div>
                )}

                {/* Top HUD */}
                <div className="relative z-20 flex items-center justify-between p-5">
                    <Link href="/" className="group flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#FFB800] rounded-xl blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
                            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFB800] to-[#FF8C00] flex items-center justify-center">
                                <span className="text-black font-bold text-xl font-tech">∞</span>
                            </div>
                        </div>
                        <span className="font-heading text-xl text-white/60 group-hover:text-[#FFB800] tracking-wider transition-colors">EXIT</span>
                    </Link>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/30">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50" />
                            <span className="font-mono text-green-400 text-xs">LIVE</span>
                        </div>
                        <div className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FFB800]/20 to-[#00F0FF]/20 border border-[#FFB800]/30">
                            <span className="font-mono text-[#FFB800] tracking-[0.2em]">SCENE {sceneNumber}</span>
                        </div>
                    </div>
                </div>

                {/* Video Content */}
                {!isLoading && (
                    <div className="flex-1 relative z-10 flex items-center justify-center p-10">
                        <div className="text-center max-w-3xl">
                            <p className="font-title text-5xl md:text-6xl lg:text-7xl text-white leading-tight" style={{ textShadow: '0 4px 30px rgba(0,0,0,0.8)' }}>
                                {genesisPrompt}
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-3">
                                <span className="text-2xl">🎬</span>
                                <span className="font-mono text-white/30 text-sm tracking-[0.2em]">AI VIDEO GENERATION</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Choices */}
                {!isLoading && choices.length > 0 && (
                    <div className="relative z-20 p-8 bg-gradient-to-t from-black via-black/95 to-transparent">
                        <p className="font-mono text-center text-[#FFB800] text-sm mb-6 tracking-[0.4em]">⚡ WHAT DO YOU DO? ⚡</p>

                        <div className="max-w-5xl mx-auto grid grid-cols-2 gap-4 mb-6">
                            {choices.map((choice, index) => (
                                <button key={index} onClick={() => handleChoice(choice)} className="group relative p-5 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-[#FFB800]/50 hover:bg-[#FFB800]/10 transition-all text-left overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFB800]/0 via-[#FFB800]/5 to-[#FFB800]/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative flex items-center gap-4">
                                        <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFB800]/20 to-[#FF8C00]/20 flex items-center justify-center font-title text-2xl text-[#FFB800] group-hover:from-[#FFB800] group-hover:to-[#FF8C00] group-hover:text-black transition-all shadow-lg">
                                            {index + 1}
                                        </span>
                                        <span className="font-heading text-xl text-white/80 group-hover:text-white tracking-wide transition-colors">{choice}</span>
                                        <svg className="w-5 h-5 ml-auto text-white/30 group-hover:text-[#FFB800] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="max-w-3xl mx-auto">
                            <p className="font-mono text-center text-white/30 text-xs tracking-[0.2em] mb-3">OR FORGE YOUR OWN PATH</p>
                            <div className="flex gap-4">
                                <div className="flex-1 relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-[#FFB800]/30 to-[#00F0FF]/30 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                    <input
                                        type="text"
                                        value={customInput}
                                        onChange={(e) => setCustomInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && customInput.trim() && handleChoice(customInput)}
                                        placeholder="Type any action you can imagine..."
                                        className="relative w-full px-6 py-4 rounded-xl backdrop-blur-xl bg-white/5 border-2 border-white/10 focus:border-[#00F0FF]/50 font-ui text-white text-lg placeholder-white/20 focus:outline-none transition-all"
                                    />
                                </div>
                                <button
                                    onClick={() => customInput.trim() && handleChoice(customInput)}
                                    disabled={!customInput.trim()}
                                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#FFB800] to-[#FF8C00] text-black font-action text-xl tracking-wider hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all shadow-xl shadow-[#FFB800]/30"
                                >
                                    ▶
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Sidebar */}
            <div className="w-96 bg-black/90 backdrop-blur-xl border-l border-white/10 flex flex-col">
                <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[#FFB800]/10 to-transparent">
                    <h2 className="font-title text-2xl text-[#FFB800] flex items-center gap-3">
                        <span className="text-2xl">📜</span>
                        STORY CHRONICLE
                    </h2>
                    <p className="font-ui text-white/30 text-sm mt-1">Your journey through the nexus</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chapters.map((chapter, index) => (
                        <div key={index} className={`relative p-5 rounded-2xl border transition-all ${index === chapters.length - 1 ? 'bg-gradient-to-r from-[#FFB800]/10 to-transparent border-[#FFB800]/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                            {index === chapters.length - 1 && <div className="absolute -left-px top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FFB800] rounded-r-full" />}
                            <div className="flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-title text-xl ${index === chapters.length - 1 ? 'bg-gradient-to-br from-[#FFB800] to-[#FF8C00] text-black shadow-lg shadow-[#FFB800]/30' : 'bg-white/10 text-white/50'}`}>
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="font-ui text-white/80 line-clamp-3 leading-relaxed">{chapter}</p>
                                    {index === chapters.length - 1 && (
                                        <div className="flex items-center gap-2 mt-3">
                                            <div className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse shadow-lg shadow-[#00F0FF]/50" />
                                            <span className="font-mono text-[#00F0FF] text-xs tracking-[0.15em]">NOW PLAYING</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-6 border-t border-white/10 bg-gradient-to-r from-transparent to-[#00F0FF]/5 text-center">
                    <p className="font-title text-xl text-transparent bg-gradient-to-r from-[#FFB800] to-[#00F0FF] bg-clip-text">INFINILIFE</p>
                    <p className="font-ui text-white/20 text-xs mt-1">Your story, infinite possibilities</p>
                </div>
            </div>

            <style jsx>{`
                @keyframes cinematicZoom { 0% { transform: scale(1.1); } 100% { transform: scale(1.2); } }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes orbit { from { transform: rotate(0deg) translateX(90px) rotate(0deg); } to { transform: rotate(360deg) translateX(90px) rotate(-360deg); } }
            `}</style>
        </div>
    );
}
