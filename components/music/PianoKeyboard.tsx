'use client';

import { PianoLayout } from '@/lib/midi/pianoLayout';

interface Props {
  activeNotes: number[];
}

export default function PianoKeyboard({ activeNotes }: Props) {
  // Uses a standard full piano layout (A0 to C8, notes = [])
  const layout = new PianoLayout();

  const whiteKeys = layout.keys.filter(k => !k.black);
  const blackKeys = layout.keys.filter(k => k.black);

  return (
    <div className="relative w-full overflow-x-auto rounded-xl border border-slate-700 bg-slate-900 p-4">
      <div
        className="relative mx-auto"
        style={{
          width: `${whiteKeys.length * 24}px`,
          height: "180px",
        }}
      >
        {/* White Keys */}
        {whiteKeys.map(key => (
          <div
            key={key.midi}
            className={`absolute border border-slate-400 rounded-b transition-all duration-75 ${
              activeNotes.includes(key.midi)
                ? "bg-sky-400"
                : "bg-white"
            }`}
            style={{
              left: key.x * 24,
              width: 24,
              height: 180,
            }}
          />
        ))}

        {/* Black Keys */}
        {blackKeys.map(key => (
          <div
            key={key.midi}
            className={`absolute rounded-b z-20 transition-all duration-75 ${
              activeNotes.includes(key.midi)
                ? "bg-amber-400"
                : "bg-black"
            }`}
            style={{
              left: key.x * 24,
              width: 16,
              height: 110,
            }}
          />
        ))}
      </div>
    </div>
  );
}