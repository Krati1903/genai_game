'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Play, Clapperboard, Dna, Zap, Sparkles, Radio, Home } from 'lucide-react';

const STATS = [
  { value: '∞', label: 'POSSIBLE LIVES', icon: Dna },
  { value: 'AI', label: 'GENERATED VIDEO', icon: Clapperboard },
  { value: '4K', label: 'QUALITY', icon: Sparkles },
  { value: 'RT', label: 'REAL-TIME', icon: Zap },
];

const FEATURES = [
  {
    icon: Clapperboard,
    title: 'AI VIDEO ENGINE',
    desc: 'Real-time cinematic generation from every prompt you write',
    color: 'var(--color-amber-glow)',
  },
  {
    icon: Dna,
    title: 'LIFE SIMULATION',
    desc: 'Every choice branches into infinite parallel lives',
    color: 'var(--color-cyan-glow)',
  },
  {
    icon: Zap,
    title: 'NEURAL NEXUS',
    desc: 'Advanced AI that adapts to your imagination',
    color: 'var(--color-ember)',
  },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen text-white overflow-x-hidden relative scanlines">
      {/* ── Background ─────────────────────────────────────────── */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=80')`,
            animation: 'slowZoom 30s ease-in-out infinite alternate',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-[#05050a]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/40 via-transparent to-cyan-950/30" />
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {mounted &&
          [...Array(40)].map((_, i) => {
            const kind = i % 3;
            const color = kind === 0 ? '#FFB800' : kind === 1 ? '#00F0FF' : '#FFFFFF';
            return (
              <span
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${2 + Math.random() * 3}px`,
                  height: `${2 + Math.random() * 3}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: color,
                  opacity: 0.35 + Math.random() * 0.4,
                  boxShadow: `0 0 8px ${color}`,
                  animation: `floatUp ${10 + Math.random() * 14}s linear infinite`,
                  animationDelay: `${Math.random() * 10}s`,
                }}
              />
            );
          })}
      </div>

      {/* DNA helix */}
      {mounted && (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 opacity-25 pointer-events-none hidden xl:block -z-10">
          <div className="relative h-[520px] w-24">
            {[...Array(21)].map((_, i) => (
              <div key={i} className="absolute w-full" style={{ top: `${i * 25}px` }}>
                <span
                  className="absolute w-3 h-3 rounded-full bg-[#FFB800]"
                  style={{
                    left: `${50 + Math.sin(i * 0.5) * 32}%`,
                    animation: 'dnaFloat 3s ease-in-out infinite',
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
                <span
                  className="absolute w-3 h-3 rounded-full bg-[#00F0FF]"
                  style={{
                    left: `${50 - Math.sin(i * 0.5) * 32}%`,
                    animation: 'dnaFloat 3s ease-in-out infinite',
                    animationDelay: `${i * 0.1 + 0.5}s`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Nav ────────────────────────────────────────────────── */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-[#FFB800] rounded-xl blur-md opacity-50 animate-pulse" />
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#FFB800] to-[#FF8C00] grid place-items-center">
              <span className="text-black font-black text-2xl leading-none">∞</span>
            </div>
          </div>
          <div className="leading-none">
            <div className="font-[family-name:var(--font-display)] font-black text-[#FFB800] text-xl tracking-[0.12em]">
              INFINILIFE
            </div>
            <div className="font-[family-name:var(--font-mono)] text-[#00F0FF] text-[9px] tracking-[0.45em] mt-1">
              NEXUS
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFB800]/10 border border-[#FFB800]/30 text-[#FFB800]">
            <Home className="w-4 h-4" />
            <span className="font-semibold tracking-[0.12em] text-xs">HOME</span>
          </span>
          <span className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
            <Radio className="w-4 h-4" />
            <span className="font-semibold tracking-[0.12em] text-xs">UPDATES</span>
          </span>
          <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/15 border border-green-500/30">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_#4ade80]" />
            <span className="font-[family-name:var(--font-mono)] text-green-400 text-[10px] tracking-wider">
              ONLINE
            </span>
          </span>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-10 pb-16">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#FFB800]/10 blur-[150px] pointer-events-none" />

        {/* Title */}
        <div
          className={`relative transition-all duration-1000 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {glitch && (
            <>
              <h1
                className="absolute inset-0 font-[family-name:var(--font-display)] font-black text-6xl sm:text-8xl lg:text-[9rem] leading-none text-[#00F0FF] opacity-70"
                style={{ transform: 'translate(-4px,-2px)', clipPath: 'inset(20% 0 30% 0)' }}
                aria-hidden
              >
                INFINILIFE
              </h1>
              <h1
                className="absolute inset-0 font-[family-name:var(--font-display)] font-black text-6xl sm:text-8xl lg:text-[9rem] leading-none text-[#FF0080] opacity-70"
                style={{ transform: 'translate(4px,2px)', clipPath: 'inset(50% 0 10% 0)' }}
                aria-hidden
              >
                INFINILIFE
              </h1>
            </>
          )}

          <h1 className="font-[family-name:var(--font-display)] font-black text-6xl sm:text-8xl lg:text-[9rem] leading-none tracking-[-0.03em]">
            <span className="text-white">INFINI</span>
            <span className="bg-gradient-to-r from-[#FFB800] to-[#FF6B00] bg-clip-text text-transparent">
              LIFE
            </span>
          </h1>

          <div className="flex items-center justify-center gap-4 mt-3">
            <span className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-[#00F0FF]" />
            <span
              className="font-[family-name:var(--font-mono)] text-lg sm:text-2xl text-[#00F0FF] tracking-[0.2em]"
              style={{ textShadow: '0 0 30px rgba(0,240,255,0.5)' }}
            >
              : NEXUS
            </span>
            <span className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-[#00F0FF]" />
          </div>
        </div>

        {/* Tagline */}
        <p
          className={`mt-8 max-w-3xl text-lg sm:text-2xl text-white/70 leading-relaxed transition-all duration-1000 delay-200 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="text-[#FFB800] font-semibold">Live infinite lives.</span> A next-gen AI
          simulation where{' '}
          <span className="text-[#00F0FF] font-semibold">you star in your own story</span> —
          generated in real-time.
        </p>

        {/* CTA */}
        <div
          className={`mt-12 flex flex-col sm:flex-row items-center gap-5 transition-all duration-1000 delay-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Link href="/genesis" className="group relative">
            <span className="absolute inset-0 -m-5 rounded-full border border-[#FFB800]/25 animate-ping [animation-duration:2s]" />
            <span className="absolute inset-0 -m-2 rounded-2xl bg-[#FFB800]/25 blur-xl group-hover:bg-[#FFB800]/40 transition-all" />
            <span className="relative flex items-center gap-3 px-10 sm:px-14 py-5 rounded-2xl bg-gradient-to-r from-[#FFB800] to-[#FF8C00] text-black font-[family-name:var(--font-display)] font-black text-xl sm:text-2xl tracking-[0.06em] shadow-2xl shadow-[#FFB800]/30 group-hover:scale-[1.03] transition-transform">
              <Play className="w-6 h-6" fill="currentColor" />
              PLAY NOW
            </span>
          </Link>

          <button className="flex items-center gap-3 px-8 py-4 rounded-xl border-2 border-white/20 hover:border-[#00F0FF]/50 hover:bg-[#00F0FF]/10 transition-all font-[family-name:var(--font-display)] font-bold text-lg text-white/70 hover:text-white tracking-[0.06em]">
            <Clapperboard className="w-5 h-5" />
            WATCH TRAILER
          </button>
        </div>

        {/* Stats */}
        <div
          className={`mt-16 flex flex-wrap items-start justify-center gap-8 sm:gap-14 transition-all duration-1000 delay-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center group cursor-default">
              <div className="flex items-center justify-center gap-2">
                <Icon className="w-4 h-4 text-white/50 group-hover:text-[#FFB800] group-hover:scale-125 transition-all" />
                <span className="font-[family-name:var(--font-display)] font-black text-3xl sm:text-4xl bg-gradient-to-r from-[#FFB800] to-[#00F0FF] bg-clip-text text-transparent">
                  {value}
                </span>
              </div>
              <span className="font-[family-name:var(--font-mono)] text-[9px] sm:text-[10px] text-white/40 tracking-[0.2em]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────── */}
      <section
        className={`relative z-10 px-6 pb-20 transition-all duration-1000 delay-1000 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="group relative p-7 rounded-2xl backdrop-blur-xl bg-white/[0.04] border border-white/10 hover:border-white/25 hover:bg-white/[0.07] transition-all overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `radial-gradient(circle at 30% 0%, ${color}18 0%, transparent 70%)` }}
              />
              <div className="relative flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-2xl grid place-items-center flex-shrink-0"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <Icon className="w-7 h-7" style={{ color }} />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] font-bold text-lg tracking-[0.08em] group-hover:text-[#FFB800] transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-white/45 leading-relaxed mt-1.5">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
