'use client';

import { useEffect, useRef, useMemo } from "react";
import { MidiNote } from "@/lib/midi/types";
import { PianoLayout } from "@/lib/midi/pianoLayout";

interface Props {
  notes: MidiNote[];
  activeNotes: number[];
  /** Called every RAF frame — returns current playback position in seconds from the audio clock. */
  getTime: () => number;
  /** Whether the midi is currently playing. If false, we pause the requestAnimationFrame loop. */
  playing: boolean;
  /** Override canvas CSS class. Defaults to card size (h-[420px]). */
  className?: string;
  /** Additional inline style for the canvas element. */
  style?: React.CSSProperties;
}

// How many seconds of notes are visible above the keyboard
const LOOK_AHEAD_SECONDS = 3.5;
// Minimum white-key pixel width for readability
const MIN_KEY_WIDTH = 14;
const KEYBOARD_HEIGHT_RATIO = 0.22; // keyboard takes 22% of canvas height
const BLACK_KEY_HEIGHT_RATIO = 0.62;

export default function MidiVisualizer({ notes, activeNotes, getTime, playing, className, style }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layout = useMemo(() => new PianoLayout(notes), [notes]);

  const keyOpacitiesRef  = useRef<Record<number, number>>({});
  const drawRef          = useRef<() => void>();

  // Keep latest refs so the stable RAF loop can read them without restarting
  const getTimeRef       = useRef(getTime);
  const activeNotesRef   = useRef(activeNotes);
  getTimeRef.current     = getTime;
  activeNotesRef.current = activeNotes;

  // Trigger a single redraw frame when active notes change while paused/stopped
  useEffect(() => {
    if (!playing && drawRef.current) {
      drawRef.current();
    }
  }, [activeNotes, playing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    // Set initial size of backing store
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    let rafId = 0;
    let lastT = performance.now();

    const draw = () => {
      if (playing) {
        rafId = requestAnimationFrame(draw);
      }

      const W = width;
      const H = height;
      const kbdH = Math.round(H * KEYBOARD_HEIGHT_RATIO);
      const rollH = H - kbdH;

      const now = performance.now();
      const dt = now - lastT;
      lastT = now;

      // Read the audio clock directly every frame — sub-millisecond precision, zero lag
      const t = getTimeRef.current();
      const active = activeNotesRef.current;

      // ── Compute key pixel scale ─────────────────────────────────────────────
      // Each white key gets at least MIN_KEY_WIDTH px; if the canvas is wide
      // enough, we let them grow so they fill the width.
      const whiteW = Math.max(MIN_KEY_WIDTH, W / layout.whiteKeysCount);
      const totalW = whiteW * layout.whiteKeysCount;
      // Centre the keyboard if it's narrower than the canvas
      const offsetX = Math.max(0, (W - totalW) / 2);

      function keyPx(key: { x: number; width: number; black: boolean }) {
        return {
          x: offsetX + key.x * whiteW,
          w: key.width * whiteW,
        };
      }

      // ── Update key-press opacities ──────────────────────────────────────────
      const fadeInStep  = dt / 60;   // reach 1 in ~60ms
      const fadeOutStep = dt / 150;  // reach 0 in ~150ms
      layout.keys.forEach(k => {
        const target = active.includes(k.midi) ? 1 : 0;
        const cur = keyOpacitiesRef.current[k.midi] ?? 0;
        if (cur < target) keyOpacitiesRef.current[k.midi] = Math.min(1, cur + fadeInStep);
        else if (cur > target) keyOpacitiesRef.current[k.midi] = Math.max(0, cur - fadeOutStep);
      });

      // ══════════════════════════════════════════════════════════════════════
      // DRAW
      // ══════════════════════════════════════════════════════════════════════

      // 1. Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, rollH);
      bgGrad.addColorStop(0, "#060b13");
      bgGrad.addColorStop(1, "#090f1a");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // 2. Alternating key lanes (extremely subtle shading for white keys, NO hard divider lines)
      layout.keys.forEach(k => {
        const { x, w } = keyPx(k);
        
        // Draw very soft track for white keys to differentiate lanes without distracting
        if (!k.black) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.008)";
          ctx.fillRect(x, 0, w, rollH);
        }
      });

      // 3. Active beam glow (rising stage glow, restricted to 30% of visualizer height)
      layout.keys.forEach(k => {
        const op = keyOpacitiesRef.current[k.midi] ?? 0;
        if (op <= 0) return;
        const { x, w } = keyPx(k);
        const hue = (k.midi % 12) / 12 * 360;
        
        const glowH = rollH * 0.3; // 30% of canvas height
        const g = ctx.createLinearGradient(0, rollH, 0, rollH - glowH);
        g.addColorStop(0, `hsla(${hue}, 100%, 60%, ${op * 0.25})`);
        g.addColorStop(0.5, `hsla(${hue}, 100%, 60%, ${op * 0.08})`);
        g.addColorStop(1, `hsla(${hue}, 100%, 60%, 0)`);
        
        ctx.fillStyle = g;
        ctx.fillRect(x, rollH - glowH, w, glowH);
      });

      // 4. Falling notes
      const pxPerSec = rollH / LOOK_AHEAD_SECONDS;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, W, rollH);
      ctx.clip();

      notes.forEach(n => {
        // Fast range check: skip notes that are off-screen immediately before doing any lookups
        if (n.start + n.duration < t || n.start > t + LOOK_AHEAD_SECONDS) return;

        const key = layout.keys.find(k => k.midi === n.note);
        if (!key) return;

        // Calculate the note's horizontal center and width to prevent adjacent key overlaps
        const keyCenterX = offsetX + (key.black ? key.x + 0.29 : key.x + 0.5) * whiteW;
        const noteW = (key.black ? 0.40 : 0.48) * whiteW;
        const noteX = keyCenterX - noteW / 2;

        const rawH = n.duration * pxPerSec;
        // Keep note height at least 6px for visibility, and subtract a 2px visual gap at the top
        const h = Math.max(6, rawH - 2);

        // Position the note's bottom edge relative to the play line
        const noteBottom = rollH - (n.start - t) * pxPerSec;
        const noteTop = noteBottom - h;

        if (noteBottom < 0 || noteTop > rollH) return;

        const hue = (n.note % 12) / 12 * 360;
        const isActive = active.includes(n.note);
        const r = Math.min(5, noteW / 2);

        // Glow shadow
        ctx.shadowBlur = isActive ? 20 : 10;
        ctx.shadowColor = `hsla(${hue},100%,65%,0.8)`;

        // Note body gradient
        const ng = ctx.createLinearGradient(noteX, noteTop, noteX, noteBottom);
        ng.addColorStop(0, `hsl(${hue},100%,75%)`);
        ng.addColorStop(1, `hsl(${hue},90%,50%)`);
        ctx.fillStyle = ng;

        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(noteX, noteTop, noteW, h, r);
        } else {
          ctx.rect(noteX, noteTop, noteW, h);
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        // Shine highlight at top of note
        const shine = ctx.createLinearGradient(noteX, noteTop, noteX, noteTop + h * 0.35);
        shine.addColorStop(0, "rgba(255,255,255,0.35)");
        shine.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = shine;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(noteX, noteTop, noteW, h * 0.35, r);
        } else {
          ctx.rect(noteX, noteTop, noteW, h * 0.35);
        }
        ctx.fill();
      });
      ctx.restore();

      // 5. Play-line glow
      const lineY = rollH;
      const lineGrad = ctx.createLinearGradient(0, lineY - 3, 0, lineY + 3);
      lineGrad.addColorStop(0, "rgba(99,179,237,0)");
      lineGrad.addColorStop(0.5, "rgba(99,179,237,0.9)");
      lineGrad.addColorStop(1, "rgba(99,179,237,0)");
      ctx.fillStyle = lineGrad;
      ctx.fillRect(0, lineY - 2, W, 4);

      // 6. Keyboard shadow overlay (top edge of keyboard)
      const shadowGrad = ctx.createLinearGradient(0, rollH, 0, rollH + 18);
      shadowGrad.addColorStop(0, "rgba(0,0,0,0.55)");
      shadowGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = shadowGrad;
      ctx.fillRect(0, rollH, W, 18);

      // 7. Keyboard background
      ctx.fillStyle = "#111827";
      ctx.fillRect(0, rollH, W, kbdH);

      // ── White keys ─────────────────────────────────────────────────────────
      layout.keys.filter(k => !k.black).forEach(k => {
        const { x, w } = keyPx(k);
        const kh = kbdH;
        const op = keyOpacitiesRef.current[k.midi] ?? 0;
        const hue = (k.midi % 12) / 12 * 360;
        const r = 4;

        // Key body
        ctx.fillStyle = op > 0
          ? `hsl(${hue},90%,${70 + op * 10}%)`
          : "#f1f5f9";
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x + 1, rollH + 1, w - 2, kh - 2, [0, 0, r, r]);
        } else {
          ctx.rect(x + 1, rollH + 1, w - 2, kh - 2);
        }
        ctx.fill();

        // Active glow
        if (op > 0) {
          ctx.shadowBlur = 16;
          ctx.shadowColor = `hsla(${hue},100%,65%,${op})`;
          ctx.fillStyle = `hsla(${hue},100%,75%,${op * 0.5})`;
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(x + 1, rollH + 1, w - 2, kh - 2, [0, 0, r, r]);
          } else {
            ctx.rect(x + 1, rollH + 1, w - 2, kh - 2);
          }
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Inset border
        ctx.strokeStyle = op > 0 ? `hsl(${hue},70%,50%)` : "#cbd5e1";
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x + 1, rollH + 1, w - 2, kh - 2, [0, 0, r, r]);
        } else {
          ctx.rect(x + 1, rollH + 1, w - 2, kh - 2);
        }
        ctx.stroke();

        // Shine
        if (w > 10) {
          const shine = ctx.createLinearGradient(x + 1, rollH + 1, x + 1, rollH + kh * 0.4);
          shine.addColorStop(0, "rgba(255,255,255,0.55)");
          shine.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = shine;
          ctx.beginPath();
          ctx.rect(x + 1, rollH + 1, w - 2, kh * 0.4);
          ctx.fill();
        }
      });

      // ── Black keys (drawn on top) ───────────────────────────────────────────
      layout.keys.filter(k => k.black).forEach(k => {
        const { x, w } = keyPx(k);
        const kh = kbdH * BLACK_KEY_HEIGHT_RATIO;
        const op = keyOpacitiesRef.current[k.midi] ?? 0;
        const hue = (k.midi % 12) / 12 * 360;
        const r = 3;

        // Key shadow
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(0,0,0,0.8)";

        // Key body
        if (op > 0) {
          const g = ctx.createLinearGradient(x, rollH, x, rollH + kh);
          g.addColorStop(0, `hsl(${hue},100%,55%)`);
          g.addColorStop(1, `hsl(${hue},80%,30%)`);
          ctx.fillStyle = g;
        } else {
          const g = ctx.createLinearGradient(x, rollH, x, rollH + kh);
          g.addColorStop(0, "#374151");
          g.addColorStop(1, "#1f2937");
          ctx.fillStyle = g;
        }
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, rollH, w, kh, [0, 0, r, r]);
        } else {
          ctx.rect(x, rollH, w, kh);
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        // Active glow
        if (op > 0) {
          ctx.shadowBlur = 18;
          ctx.shadowColor = `hsla(${hue},100%,65%,${op})`;
          ctx.fillStyle = `hsla(${hue},100%,70%,${op * 0.4})`;
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(x, rollH, w, kh, [0, 0, r, r]);
          } else {
            ctx.rect(x, rollH, w, kh);
          }
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Shine on top of black key
        if (w > 6) {
          const shine = ctx.createLinearGradient(x, rollH, x, rollH + kh * 0.3);
          shine.addColorStop(0, "rgba(255,255,255,0.18)");
          shine.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = shine;
          ctx.beginPath();
          ctx.rect(x + 1, rollH, w - 2, kh * 0.3);
          ctx.fill();
        }
      });
    };

    drawRef.current = draw;

    // Watch for size changes without forcing reflows in the hot path
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      const newW = entry.contentRect.width;
      const newH = entry.contentRect.height;
      if (newW > 0 && newH > 0) {
        width = newW;
        height = newH;
        canvas.width = newW * dpr;
        canvas.height = newH * dpr;
        ctx.scale(dpr, dpr);
        // Force a redraw once if size changed while paused/stopped
        if (!playing) {
          draw();
        }
      }
    });
    resizeObserver.observe(canvas);

    // Trigger the draw function once. If playing, it will schedule subsequent frames.
    draw();
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      drawRef.current = undefined;
    };
  // Re-run the visualizer whenever layout, notes, or playing state changes
  }, [notes, layout, playing]);

  return (
    <canvas
      ref={canvasRef}
      className={className ?? "w-full h-[420px] rounded-xl block"}
      style={{ background: "#070d1a", ...style }}
    />
  );
}
