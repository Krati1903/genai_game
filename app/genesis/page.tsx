'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function GenesisPage() {
    const router = useRouter();
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [typedText, setTypedText] = useState('');
    const fullText = 'INITIALIZING LIFE SIMULATION...';

    useEffect(() => {
        setMounted(true);
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < fullText.length) {
                setTypedText(fullText.slice(0, i + 1));
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 80);
        return () => clearInterval(typeInterval);
    }, []);

    const handleSubmit = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        sessionStorage.setItem('genesisPrompt', prompt);
        try {
            await fetch('/api/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'genesis', prompt })
            });
        } catch {}
        router.push('/loop');
    };

    const presets = [
        { name: 'SPACE EXPLORER', icon: '🚀', desc: 'Traverse the cosmos', color: '#00F0FF' },
        { name: 'CYBER HACKER', icon: '💻', desc: 'Rule the net', color: '#FF00FF' },
        { name: 'MEDIEVAL HERO', icon: '⚔️', desc: 'Forge your legend', color: '#FFB800' },
        { name: 'ROCK STAR', icon: '🎸', desc: 'Chase the fame', color: '#FF6B00' },
        { name: 'MAD SCIENTIST', icon: '🔬', desc: 'Break reality', color: '#00FF88' },
        { name: 'NOIR DETECTIVE', icon: '🔍', desc: 'Solve mysteries', color: '#8B5CF6' }
    ];

    return (
        <div className="min-h-screen text-white overflow-hidden relative">
            
            {/* Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80')`, animation: 'slowPan 60s linear infinite alternate' }} />
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-purple-900/50 to-black/90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
            </div>

            {/* Matrix effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
                {mounted && [...Array(20)].map((_, i) => (
                    <div key={i} className="absolute font-mono text-[#00F0FF] text-xs" style={{ left: `${i * 5}%`, animation: `matrixFall ${5 + Math.random() * 10}s linear infinite`, animationDelay: `${Math.random() * 5}s` }}>
                        {[...Array(30)].map((_, j) => (<div key={j} style={{ opacity: 1 - j * 0.03 }}>{String.fromCharCode(0x30A0 + Math.random() * 96)}</div>))}
                    </div>
                ))}
            </div>

            {/* Orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#FFB800]/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00F0FF]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Nav */}
            <nav className="relative z-20 flex items-center justify-between p-6">
                <Link href="/" className="group flex items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-0 bg-[#FFB800] rounded-xl blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
                        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFB800] to-[#FF8C00] flex items-center justify-center">
                            <span className="text-black font-bold text-2xl font-tech">∞</span>
                        </div>
                    </div>
                    <span className="font-heading text-xl text-white/60 group-hover:text-[#FFB800] tracking-wider transition-colors">← BACK</span>
                </Link>
                
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30">
                        <span className="font-mono text-[#00F0FF] text-sm tracking-wider">STEP 1/2</span>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-12 h-2 rounded-full bg-[#FFB800]" />
                        <div className="w-12 h-2 rounded-full bg-white/20" />
                    </div>
                </div>
            </nav>

            {/* Main */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-6 py-10">
                
                {/* Header */}
                <div className={`text-center mb-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/30 mb-6">
                        <span className="text-3xl animate-pulse">🧬</span>
                        <span className="font-tech text-[#FFB800] text-sm tracking-[0.2em]">GENESIS PROTOCOL</span>
                    </div>
                    
                    <h1 className="font-title text-6xl md:text-8xl mb-4">
                        <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">CREATE YOUR </span>
                        <span className="bg-gradient-to-r from-[#FFB800] to-[#FF6B00] bg-clip-text text-transparent">LIFE</span>
                    </h1>
                    
                    <p className="font-mono text-[#00F0FF] text-sm" style={{ textShadow: '0 0 20px rgba(0,240,255,0.5)' }}>
                        {typedText}<span className="animate-pulse">_</span>
                    </p>
                </div>

                {/* Terminal */}
                <div className={`w-full max-w-4xl transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#FFB800]/50 via-[#00F0FF]/50 to-[#FFB800]/50 rounded-3xl blur-xl opacity-30" />
                        
                        <div className="relative rounded-2xl overflow-hidden border border-white/20 backdrop-blur-xl">
                            <div className="flex items-center justify-between px-6 py-4 bg-black/60 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-lg shadow-[#ff5f56]/50" />
                                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-lg shadow-[#ffbd2e]/50" />
                                        <div className="w-3 h-3 rounded-full bg-[#27ca40] shadow-lg shadow-[#27ca40]/50" />
                                    </div>
                                    <span className="font-mono text-white/40 text-sm ml-4">NEXUS://IDENTITY_CORE</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    <span className="font-mono text-green-400 text-xs">CONNECTED</span>
                                </div>
                            </div>

                            <div className="p-8 bg-black/80">
                                <div className="font-mono text-[#00F0FF] text-sm mb-2">{'>'} AWAITING IDENTITY INPUT...</div>
                                <div className="font-ui text-white/40 mb-6 text-sm">{'>'} Describe who you want to become in this simulation</div>

                                <div className="flex items-start gap-4">
                                    <span className="font-mono text-[#FFB800] text-2xl">$</span>
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
                                        disabled={isLoading}
                                        placeholder="A visionary architect in Neo Tokyo, designing structures that defy physics..."
                                        className="flex-1 h-28 bg-transparent font-ui text-white text-lg resize-none focus:outline-none placeholder-white/20"
                                        style={{ caretColor: '#FFB800' }}
                                    />
                                </div>

                                <div className="mt-8 flex items-center justify-between">
                                    <span className="font-mono text-white/30 text-xs tracking-wide">PRESS ENTER OR CLICK TO INITIALIZE</span>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isLoading || !prompt.trim()}
                                        className="group relative px-10 py-4 bg-gradient-to-r from-[#FFB800] to-[#FF8C00] text-black font-action text-lg tracking-wider rounded-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all shadow-xl shadow-[#FFB800]/30"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-3">
                                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                                GENERATING...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-3">
                                                INITIALIZE LIFE
                                                <span className="text-xl group-hover:translate-x-1 transition-transform">▶</span>
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Presets */}
                <div className={`mt-12 w-full max-w-5xl transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <p className="font-mono text-center text-white/40 text-xs tracking-[0.3em] mb-6">⚡ QUICK LIFE TEMPLATES ⚡</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {presets.map((preset) => (
                            <button
                                key={preset.name}
                                onClick={() => setPrompt(`${preset.name.toLowerCase()} - ${preset.desc}`)}
                                className="group p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center"
                                style={{ borderColor: `${preset.color}30` }}
                            >
                                <span className="text-4xl block mb-2 group-hover:scale-125 transition-transform">{preset.icon}</span>
                                <span className="font-heading text-sm tracking-wider block" style={{ color: preset.color }}>{preset.name}</span>
                                <span className="font-ui text-[10px] text-white/40 block mt-1">{preset.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes slowPan { 0% { transform: scale(1.1) translateX(0); } 100% { transform: scale(1.2) translateX(-5%); } }
                @keyframes matrixFall { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
            `}</style>
        </div>
    );
}
