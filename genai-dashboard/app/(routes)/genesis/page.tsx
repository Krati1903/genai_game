'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Dna, Play } from 'lucide-react';

export default function GenesisPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cursorOn, setCursorOn] = useState(true);
  const [mounted, setMounted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setCursorOn((c) => !c), 500);
    return () => clearInterval(id);
  }, []);

  const submit = async () => {
    if (!prompt.trim()) {
      setError('Describe who you want to become in this simulation');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/genesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initialize life simulation');
      router.push('/loop');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize');
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden scanlines">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80')`,
            animation: 'slowZoom 30s ease-in-out infinite alternate',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-[#05050a]" />
      </div>

      {/* Right accent bar (as in mockup) */}
      <div className="fixed right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00F0FF] via-transparent to-[#FFB800] opacity-60 -z-10" />

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-[#FFB800] rounded-xl blur-md opacity-50" />
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#FFB800] to-[#FF8C00] grid place-items-center">
              <span className="text-black font-black text-2xl leading-none">∞</span>
            </div>
          </div>
          <span className="flex items-center gap-2 text-white/60 group-hover:text-white transition-colors font-[family-name:var(--font-display)] font-bold tracking-[0.12em] text-sm">
            <ArrowLeft className="w-4 h-4" />
            BACK
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="px-4 py-2 rounded-lg border border-[#00F0FF]/30 bg-[#00F0FF]/10 text-[#00F0FF] font-[family-name:var(--font-mono)] text-xs tracking-[0.15em]">
            STEP 1/2
          </span>
          <span className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden block">
            <span className="block h-full w-1/2 bg-gradient-to-r from-[#FFB800] to-[#FF8C00] rounded-full" />
          </span>
        </div>
      </nav>

      {/* Content */}
      <div
        className={`relative z-10 flex flex-col items-center px-6 pt-6 pb-20 transition-all duration-1000 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="inline-flex items-center gap-2.5 px-5 py-2 mb-8 rounded-full border border-[#FFB800]/30 bg-[#FFB800]/10 backdrop-blur-sm">
          <Dna className="w-4 h-4 text-[#FFB800]" />
          <span className="font-[family-name:var(--font-display)] font-bold text-[#FFB800] text-xs tracking-[0.25em]">
            GENESIS PROTOCOL
          </span>
        </div>

        <h1 className="font-[family-name:var(--font-display)] font-black text-4xl sm:text-6xl lg:text-7xl tracking-[-0.03em] text-center">
          <span className="text-white">CREATE YOUR </span>
          <span className="bg-gradient-to-r from-[#FFB800] to-[#FF6B00] bg-clip-text text-transparent">
            LIFE
          </span>
        </h1>

        <p className="mt-5 font-[family-name:var(--font-mono)] text-[#00F0FF] text-sm tracking-[0.15em]">
          {loading ? 'INITIALIZING LIFE SIMULATION...' : 'AWAITING IDENTITY INPUT...'}
          <span className={cursorOn ? 'opacity-100' : 'opacity-0'}>_</span>
        </p>

        {/* Terminal */}
        <div className="w-full max-w-3xl mt-10 rounded-2xl overflow-hidden border border-white/10 bg-black/75 backdrop-blur-xl shadow-2xl">
          {/* Title bar */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-white/[0.04] border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <span className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <span className="font-[family-name:var(--font-mono)] text-xs text-white/45 tracking-[0.12em]">
                NEXUS://IDENTITY_CORE
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_#4ade80]" />
              <span className="font-[family-name:var(--font-mono)] text-[10px] text-green-400 tracking-[0.15em]">
                CONNECTED
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-7 font-[family-name:var(--font-mono)] text-sm">
            <p className="text-[#00F0FF]">&gt; AWAITING IDENTITY INPUT...</p>
            <p className="text-white/45 mt-2">
              &gt; Describe who you want to become in this simulation
            </p>

            <div className="flex items-start gap-3 mt-5">
              <span className="text-[#FFB800] text-lg leading-7">$</span>
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="A visionary architect in Neo Tokyo, designing structures that defy physics..."
                className="flex-1 bg-transparent text-white placeholder-white/25 focus:outline-none resize-none leading-7 min-h-[84px]"
                disabled={loading}
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs mt-3">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-4 pt-5 mt-5 border-t border-white/10">
              <span className="text-white/25 text-[11px] tracking-[0.15em] hidden sm:inline">
                PRESS ENTER OR CLICK TO INITIALIZE
              </span>
              <button
                onClick={submit}
                disabled={loading}
                className="ml-auto flex items-center gap-2.5 px-7 py-3 rounded-xl bg-gradient-to-r from-[#FFB800] to-[#FF8C00] text-black font-[family-name:var(--font-display)] font-black text-sm tracking-[0.08em] shadow-lg shadow-[#FFB800]/25 hover:scale-[1.03] active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    INITIALIZING...
                  </>
                ) : (
                  <>
                    INITIALIZE LIFE
                    <Play className="w-3.5 h-3.5" fill="currentColor" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <p className="mt-7 text-white/35 text-xs font-[family-name:var(--font-mono)] tracking-wide text-center max-w-md leading-relaxed">
            Generating your opening scene — script, cinematic video and first choices.
            <br />
            This takes 15–30 seconds.
          </p>
        )}
      </div>
    </div>
  );
}
