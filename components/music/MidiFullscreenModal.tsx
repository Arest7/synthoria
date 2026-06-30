'use client';

import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, Play, Pause, Square, Music2 } from 'lucide-react';
import { MidiEngine } from '@/lib/midi/MidiEngine';
import { MidiNote } from '@/lib/midi/types';
import MidiVisualizer from './MidiVisualizer';

interface Props {
  engine: MidiEngine;
  notes: MidiNote[];
  title: string;
  composer: string;
  onClose: () => void;
}

export default function MidiFullscreenModal({ engine, notes, title, composer, onClose }: Props) {
  const [playing,     setPlaying]     = useState(false);
  const [progress,    setProgress]    = useState(0);
  const [duration,    setDuration]    = useState(engine.duration);
  const [activeNotes, setActiveNotes] = useState<number[]>([]);
  const [mounted,     setMounted]     = useState(false);

  // Portal requires document — wait for client mount
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    setDuration(engine.duration);

    const unsubNotes    = engine.onNotes(setActiveNotes);
    const unsubProgress = engine.onProgress((p) => setProgress(p * 100));
    const unsubState    = engine.onStateChange(setPlaying);

    // Close on Escape key
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);

    // Lock body scroll while open
    document.body.style.overflow = 'hidden';

    return () => {
      unsubNotes();
      unsubProgress();
      unsubState();
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [engine, onClose]);

  const playPause = async () => {
    if (playing) { engine.pause(); return; }
    await engine.play();
  };

  const fmt = useCallback((s: number) => {
    const m   = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }, []);

  if (!mounted) return null;

  const modal = (
    <>
      {/* CSS animation keyframes injected once */}
      <style>{`
        @keyframes fsSlideUp {
          from { opacity: 0; transform: scale(0.97) translateY(24px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        @keyframes fsBackdrop {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .fs-backdrop { animation: fsBackdrop 0.2s ease forwards; }
        .fs-panel    { animation: fsSlideUp  0.3s cubic-bezier(0.34,1.56,0.64,1) forwards; }
      `}</style>

      {/* Backdrop */}
      <div
        className="fs-backdrop"
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(2,6,23,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      />

      {/* Panel */}
      <div
        className="fs-panel"
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', flexDirection: 'column',
          padding: '16px',
          pointerEvents: 'none',
        }}
      >
        {/* Inner container */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            maxWidth: 960,
            width: '100%',
            margin: '0 auto',
            borderRadius: 24,
            overflow: 'hidden',
            pointerEvents: 'all',
            background: 'linear-gradient(160deg,#0d1b2e 0%,#080f1e 100%)',
            border: '1px solid rgba(99,179,237,0.15)',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.5), 0 40px 80px rgba(0,0,0,0.8), 0 0 60px rgba(56,189,248,0.06)',
          }}
        >
          {/* ── Top bar ─────────────────────────────────────────────── */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '18px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              background: 'rgba(255,255,255,0.02)',
              flexShrink: 0,
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                background: 'linear-gradient(135deg,#38bdf8,#6366f1)',
                boxShadow: '0 0 20px rgba(56,189,248,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Music2 size={20} color="white" />
            </div>

            {/* Song info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: 'white', fontWeight: 800, fontSize: 18, margin: 0, lineHeight: 1.2 }}>
                {title}
              </p>
              <p style={{ color: 'rgba(148,163,184,0.8)', fontSize: 13, margin: 0, lineHeight: 1.4 }}>
                {composer}
              </p>
            </div>

            {/* Hint */}
            <span style={{ color: 'rgba(100,116,139,0.6)', fontSize: 11, display: 'none' }}
              className="sm:block">
              Esc yoki ×
            </span>

            {/* Close */}
            <button
              onClick={onClose}
              style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#94a3b8',
                transition: 'all 0.15s',
              }}
              title="Yopish (Esc)"
            >
              <X size={18} />
            </button>
          </div>

          {/* ── Visualizer — flex-1 fills remaining height ──────────── */}
          <div style={{ flex: 1, padding: '12px 16px 0', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <MidiVisualizer
              notes={notes}
              activeNotes={activeNotes}
              getTime={() => engine.getPlaybackTime()}
              playing={playing}
              className="w-full rounded-xl block"
              style={{ flex: 1, minHeight: 0 }}
            />
          </div>

          {/* ── Transport controls ───────────────────────────────────── */}
          <div
            style={{
              padding: '18px 24px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', gap: 16,
              background: 'rgba(0,0,0,0.2)',
              flexShrink: 0,
            }}
          >
            {/* Play / Pause */}
            <button
              onClick={playPause}
              style={{
                width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg,#38bdf8,#6366f1)',
                boxShadow: playing ? '0 0 28px rgba(56,189,248,0.55)' : '0 0 14px rgba(56,189,248,0.3)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              {playing
                ? <Pause size={22} color="white" fill="white" />
                : <Play  size={22} color="white" fill="white" style={{ marginLeft: 3 }} />
              }
            </button>

            {/* Stop */}
            <button
              onClick={() => engine.stop()}
              style={{
                width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Square size={16} color="#94a3b8" fill="#94a3b8" />
            </button>

            {/* Progress */}
            <div style={{ flex: 1 }}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}
              >
                <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: 12, fontFamily: 'monospace' }}>
                  {fmt(engine.getPlaybackTime())}
                </span>
                <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: 12, fontFamily: 'monospace' }}>
                  {fmt(duration)}
                </span>
              </div>

              {/* Track bar — click to seek (future feature placeholder) */}
              <div
                style={{
                  position: 'relative', height: 6, borderRadius: 99,
                  background: 'rgba(255,255,255,0.08)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute', inset: '0 auto 0 0',
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg,#38bdf8,#6366f1)',
                    boxShadow: '0 0 10px rgba(56,189,248,0.7)',
                    transition: 'width 0.1s linear',
                    borderRadius: 99,
                  }}
                />
              </div>
            </div>

            {/* Download */}
            <a
              href={notes.length ? undefined : '#'}
              style={{
                fontSize: 12, fontWeight: 700, color: '#38bdf8',
                textDecoration: 'none', flexShrink: 0,
                padding: '8px 16px', borderRadius: 10,
                background: 'rgba(56,189,248,0.1)',
                border: '1px solid rgba(56,189,248,0.2)',
              }}
            >
              ↓ MIDI
            </a>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modal, document.body);
}
