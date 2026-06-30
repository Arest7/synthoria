'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, Square, Loader2, Maximize2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { MidiEngine } from '@/lib/midi/MidiEngine';
import { MidiNote } from '@/lib/midi/types';
import MidiVisualizer from './MidiVisualizer';
import MidiFullscreenModal from './MidiFullscreenModal';

interface MidiPlayerProps {
  fileUrl: string;
  title: string;
  composer: string;
}

export default function MidiPlayer({ fileUrl, title, composer }: MidiPlayerProps) {
  const { t } = useLanguage();

  const engine = useMemo(() => new MidiEngine(fileUrl), [fileUrl]);
  const containerRef = useRef<HTMLDivElement>(null);

  const [visible,      setVisible]      = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [playing,      setPlaying]      = useState(false);
  const [progress,     setProgress]     = useState(0);
  const [duration,     setDuration]     = useState(0);
  const [activeNotes,  setActiveNotes]  = useState<number[]>([]);
  const [notes,        setNotes]        = useState<MidiNote[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ── Lazy-load via IntersectionObserver ─────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── Load MIDI data once card scrolls into view ──────────────────────────
  useEffect(() => {
    if (!visible) return;
    let mounted = true;

    async function init() {
      setLoading(true);
      try { await engine.loadData(); } catch { /* silent */ }
      if (!mounted) return;
      setDuration(engine.duration);
      setNotes(engine.notes);
      setLoading(false);
    }

    init();

    const unsubNotes    = engine.onNotes(setActiveNotes);
    const unsubProgress = engine.onProgress((p) => setProgress(p * 100));
    const unsubState    = engine.onStateChange(setPlaying);

    return () => {
      mounted = false;
      engine.stop();
      unsubNotes();
      unsubProgress();
      unsubState();
    };
  }, [engine, visible]);

  const playPause = async () => {
    if (playing) { engine.pause(); return; }
    await engine.play();
  };

  const fmt = (s: number) => {
    const m   = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <>
      <div
        ref={containerRef}
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg,#0d1b2e 0%,#0a1628 100%)',
          border: '1px solid rgba(99,179,237,0.12)',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.4),0 20px 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* ── Header ───────────────────────────────────────────────── */}
        <div
          className="flex items-center gap-3 px-5 pt-4 pb-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
            style={{
              background: playing
                ? 'linear-gradient(135deg,#38bdf8,#6366f1)'
                : 'linear-gradient(135deg,#1e3a5f,#1e293b)',
              boxShadow: playing ? '0 0 16px rgba(56,189,248,0.5)' : 'none',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M9 19V6l12-3v13M9 19c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-3c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z"/>
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm truncate leading-tight">{title}</p>
            <p className="text-xs leading-tight" style={{ color: 'rgba(148,163,184,0.8)' }}>{composer}</p>
          </div>

          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded-md flex-shrink-0"
            style={{
              background: 'rgba(56,189,248,0.1)',
              color: '#38bdf8',
              border: '1px solid rgba(56,189,248,0.2)',
            }}
          >
            MIDI
          </span>
        </div>

        {/* ── Visualizer + expand button ─────────────────────────── */}
        <div className="px-4 pt-3 relative group">
          {loading ? (
            <div
              className="w-full rounded-xl flex items-center justify-center"
              style={{ height: 420, background: '#070d1a' }}
            >
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={28} className="animate-spin" style={{ color: '#38bdf8' }} />
                <span className="text-xs" style={{ color: 'rgba(148,163,184,0.5)' }}>Loading…</span>
              </div>
            </div>
          ) : (
            <>
              <MidiVisualizer
                notes={notes}
                activeNotes={activeNotes}
                getTime={() => engine.getPlaybackTime()}
                playing={playing}
              />

              {/* Expand button — appears on hover */}
              <button
                onClick={() => setIsFullscreen(true)}
                title="Katta ekranda ko'rish"
                className="absolute top-6 right-7 opacity-0 group-hover:opacity-100 transition-all duration-200"
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(7,13,26,0.85)',
                  border: '1px solid rgba(99,179,237,0.3)',
                  backdropFilter: 'blur(8px)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  color: '#38bdf8',
                  zIndex: 10,
                }}
              >
                <Maximize2 size={16} />
              </button>

              {/* Tap-to-fullscreen overlay hint */}
              <div
                onClick={() => setIsFullscreen(true)}
                className="absolute inset-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ borderRadius: 12, background: 'rgba(0,0,0,0.0)' }}
                title="Katta ekranda ko'rish"
              />
            </>
          )}
        </div>

        {/* ── Transport controls ──────────────────────────────────── */}
        <div className="px-5 py-4 flex items-center gap-4">
          <button
            onClick={playPause}
            disabled={loading}
            style={{
              width: 44, height: 44, borderRadius: '50%',
              background: loading
                ? 'rgba(56,189,248,0.15)'
                : 'linear-gradient(135deg,#38bdf8,#6366f1)',
              boxShadow: loading ? 'none' : '0 0 20px rgba(56,189,248,0.4)',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'all 0.2s',
            }}
          >
            {playing
              ? <Pause size={18} color="white" fill="white" />
              : <Play  size={18} color="white" fill="white" style={{ marginLeft: 2 }} />
            }
          </button>

          <button
            onClick={() => engine.stop()}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Square size={14} color="#94a3b8" fill="#94a3b8" />
          </button>

          <div className="flex-1">
            <div className="flex justify-between text-[10px] mb-1.5 font-mono"
              style={{ color: 'rgba(148,163,184,0.7)' }}>
              <span>{fmt(engine.getPlaybackTime())}</span>
              <span>{fmt(duration)}</span>
            </div>
            <div className="relative h-1.5 rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg,#38bdf8,#6366f1)',
                  boxShadow: '0 0 8px rgba(56,189,248,0.6)',
                  transition: 'width 0.1s linear',
                }}
              />
            </div>
          </div>

          {/* Expand icon button in transport row too */}
          <button
            onClick={() => setIsFullscreen(true)}
            title="Katta ekranda ko'rish"
            style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: 'rgba(56,189,248,0.08)',
              border: '1px solid rgba(56,189,248,0.2)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#38bdf8',
            }}
          >
            <Maximize2 size={14} />
          </button>
        </div>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 pb-4">
          <span className="text-[10px]" style={{ color: 'rgba(100,116,139,0.8)' }}>
            {t.common.compatibleSoftware}: SeeMusic · Synthesia · Midiano
          </span>
          <a href={fileUrl} download className="text-[11px] font-semibold" style={{ color: '#38bdf8' }}>
            ↓ Download
          </a>
        </div>
      </div>

      {/* ── Fullscreen modal (portal to document.body) ──────────────────── */}
      {isFullscreen && (
        <MidiFullscreenModal
          engine={engine}
          notes={notes}
          title={title}
          composer={composer}
          onClose={() => setIsFullscreen(false)}
        />
      )}
    </>
  );
}
