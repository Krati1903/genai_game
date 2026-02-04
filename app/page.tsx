'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function LandingPage() {
    const [mounted, setMounted] = useState(false);
    const [glitchText, setGlitchText] = useState(false);

    useEffect(() => {
        setMounted(true);
        const glitchInterval = setInterval(() => {
            setGlitchText(true);
            setTimeout(() => setGlitchText(false), 150);
        }, 4000);
        return () => clearInterval(glitchInterval);
    }, []);

    return (
        <div className="min-h-screen text-white overflow-hidden relative">
            
            {/* Background */}
            <div className="absolute inset-0">
                <div 
                    className="absolute inset-0 bg-cover bg-center scale-110"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=80')`,
                        animation: 'slowZoom 30s ease-in-out infinite alternate'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 via-transparent to-cyan-900/20 animate-pulse" style={{ animationDuration: '4s' }} />
            </div>

            {/* Scanlines */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
            }} />

            {/* DNA Helix - Only render on client to avoid hydration mismatch */}
            {mounted && (
                <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none hidden lg:block">
                    <div className="relative h-[500px] w-20">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="absolute w-full" style={{ top: `${i * 25}px` }}>
                                <div className="w-4 h-4 rounded-full bg-[#FFB800] absolute" style={{ left: `${50 + Math.sin(i * 0.5) * 30}%`, animation: `dnaFloat 3s ease-in-out infinite`, animationDelay: `${i * 0.1}s` }} />
                                <div className="w-4 h-4 rounded-full bg-[#00F0FF] absolute" style={{ left: `${50 - Math.sin(i * 0.5) * 30}%`, animation: `dnaFloat 3s ease-in-out infinite`, animationDelay: `${i * 0.1 + 0.5}s` }} />
                                <div className="absolute w-full h-px bg-gradient-to-r from-[#FFB800]/50 via-white/20 to-[#00F0FF]/50" style={{ top: '8px' }} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {mounted && [...Array(40)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute rounded-full ${i % 3 === 0 ? 'bg-[#FFB800]' : i % 3 === 1 ? 'bg-[#00F0FF]' : 'bg-white'}`}
                        style={{
                            width: `${2 + Math.random() * 4}px`,
                            height: `${2 + Math.random() * 4}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            opacity: 0.4 + Math.random() * 0.4,
                            animation: `floatUp ${8 + Math.random() * 12}s linear infinite`,
                            animationDelay: `${Math.random() * 8}s`,
                            boxShadow: i % 3 === 0 ? '0 0 10px #FFB800' : i % 3 === 1 ? '0 0 10px #00F0FF' : '0 0 5px white'
                        }}
                    />
                ))}
            </div>

            {/* Navigation */}
            <nav className="relative z-20 flex items-center justify-between p-6">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-0 bg-[#FFB800] rounded-xl blur-md opacity-50 animate-pulse" />
                        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFB800] to-[#FF8C00] flex items-center justify-center">
                            <span className="text-black font-bold text-2xl font-tech">∞</span>
                        </div>
                    </div>
                    <div>
                        <span className="font-title text-[#FFB800] text-2xl tracking-wider">INFINILIFE</span>
                        <span className="font-tech text-[#00F0FF] text-[10px] block tracking-[0.4em]">NEXUS</span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <Link href="/" className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFB800]/10 border border-[#FFB800]/30 hover:bg-[#FFB800]/20 transition-all">
                        <span className="text-[#FFB800]">🏠</span>
                        <span className="font-ui font-semibold text-[#FFB800] tracking-wider text-sm">HOME</span>
                    </Link>
                    <Link href="#" className="group flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-all">
                        <span>📡</span>
                        <span className="font-ui font-semibold text-white/60 group-hover:text-white tracking-wider text-sm">UPDATES</span>
                    </Link>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50" />
                        <span className="font-mono text-green-400 text-xs">ONLINE</span>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#FFB800]/10 blur-[150px] animate-pulse pointer-events-none" />

                {/* Title */}
                <div className={`relative transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    {glitchText && (
                        <>
                            <h1 className="absolute inset-0 font-title text-8xl md:text-[10rem] lg:text-[12rem] text-[#00F0FF] opacity-70" style={{ transform: 'translate(-4px, -2px)', clipPath: 'inset(20% 0 30% 0)' }}>INFINILIFE</h1>
                            <h1 className="absolute inset-0 font-title text-8xl md:text-[10rem] lg:text-[12rem] text-[#FF0080] opacity-70" style={{ transform: 'translate(4px, 2px)', clipPath: 'inset(50% 0 10% 0)' }}>INFINILIFE</h1>
                        </>
                    )}
                    
                    <h1 className="font-title text-8xl md:text-[10rem] lg:text-[12rem] leading-none relative">
                        <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">INFINI</span>
                        <span className="bg-gradient-to-r from-[#FFB800] to-[#FF6B00] bg-clip-text text-transparent">LIFE</span>
                    </h1>
                    
                    <div className="flex items-center justify-center gap-4 mt-2">
                        <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#00F0FF]" />
                        <h2 className="font-tech text-2xl md:text-3xl text-[#00F0FF]" style={{ textShadow: '0 0 30px rgba(0,240,255,0.5)' }}>
                            : NEXUS
                        </h2>
                        <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#00F0FF]" />
                    </div>
                </div>

                {/* Tagline */}
                <div className={`mt-8 mb-12 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <p className="font-ui text-xl md:text-2xl text-white/70 max-w-3xl leading-relaxed">
                        <span className="text-[#FFB800] font-semibold">Live infinite lives.</span> A next-gen AI simulation where 
                        <span className="text-[#00F0FF] font-semibold"> you star in your own story</span> — 
                        generated in real-time.
                    </p>
                </div>

                {/* CTA */}
                <div className={`flex flex-col sm:flex-row items-center gap-6 transition-all duration-1000 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <Link href="/genesis" className="group relative">
                        <div className="absolute inset-0 -m-6 rounded-full border border-[#FFB800]/30 animate-ping" style={{ animationDuration: '2s' }} />
                        <div className="absolute inset-0 -m-4 rounded-full border border-[#FFB800]/40 animate-pulse" />
                        <div className="absolute inset-0 -m-2 rounded-full bg-[#FFB800]/20 blur-xl group-hover:bg-[#FFB800]/30 transition-all" />
                        
                        <div className="relative flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-[#FFB800] to-[#FF8C00] text-black font-action text-2xl tracking-wider rounded-2xl hover:scale-105 transition-transform shadow-2xl shadow-[#FFB800]/30">
                            <svg className="w-8 h-8 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            PLAY NOW
                        </div>
                    </Link>

                    <button className="group flex items-center gap-3 px-8 py-4 rounded-xl border-2 border-white/20 hover:border-[#00F0FF]/50 hover:bg-[#00F0FF]/10 transition-all font-heading text-xl text-white/70 hover:text-white tracking-wider">
                        <span className="text-xl">🎬</span>
                        WATCH TRAILER
                    </button>
                </div>

                {/* Stats */}
                <div className={`mt-16 flex items-center gap-10 transition-all duration-1000 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    {[
                        { value: '∞', label: 'POSSIBLE LIVES', icon: '🧬' },
                        { value: 'AI', label: 'GENERATED VIDEO', icon: '🎬' },
                        { value: '4K', label: 'QUALITY', icon: '✨' },
                        { value: 'RT', label: 'REAL-TIME', icon: '⚡' }
                    ].map((stat) => (
                        <div key={stat.label} className="text-center group cursor-pointer">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <span className="text-lg group-hover:scale-125 transition-transform">{stat.icon}</span>
                                <span className="font-title text-4xl bg-gradient-to-r from-[#FFB800] to-[#00F0FF] bg-clip-text text-transparent">
                                    {stat.value}
                                </span>
                            </div>
                            <span className="font-mono text-[10px] text-white/40 tracking-wider">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Feature Cards */}
            <div className={`relative z-10 px-6 pb-10 transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: '🎬', title: 'AI VIDEO ENGINE', desc: 'Real-time cinematic generation powered by A100 GPUs', color: '#FFB800' },
                        { icon: '🧬', title: 'LIFE SIMULATION', desc: 'Every choice branches into infinite parallel lives', color: '#00F0FF' },
                        { icon: '⚡', title: 'NEURAL NEXUS', desc: 'Advanced AI that adapts to your imagination', color: '#FF6B00' }
                    ].map((feature) => (
                        <div key={feature.title} className="group relative p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer overflow-hidden">
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `radial-gradient(circle at center, ${feature.color}10 0%, transparent 70%)` }} />
                            
                            <div className="relative flex items-start gap-5">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl" style={{ backgroundColor: `${feature.color}20` }}>
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="font-heading text-2xl tracking-wider group-hover:text-[#FFB800] transition-colors mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="font-ui text-sm text-white/50 leading-relaxed">{feature.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes slowZoom { 0% { transform: scale(1.1); } 100% { transform: scale(1.2); } }
                @keyframes floatUp { 0% { transform: translateY(100vh) rotate(0deg); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; } }
                @keyframes dnaFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
            `}</style>
        </div>
    );
}
