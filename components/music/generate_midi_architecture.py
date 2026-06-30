from pathlib import Path
import textwrap

PROJECT_ROOT = Path(".")

FILES = {
    "lib/midi/types.ts": """
export interface MidiNote {

    note: number;

    velocity: number;

    start: number;

    duration: number;

}

export interface MidiSong {

    duration: number;

    notes: MidiNote[];

}
""",

    "lib/midi/MidiLoader.ts": """
import { Midi } from "@tonejs/midi";
import { MidiSong } from "./types";

export async function loadMidi(url: string): Promise<MidiSong> {

    const response = await fetch(url);

    if (!response.ok)
        throw new Error(`Unable to load MIDI: ${url}`);

    const buffer = await response.arrayBuffer();

    const midi = new Midi(buffer);

    const notes = midi.tracks.flatMap(track =>

        track.notes.map(note => ({

            note: note.midi,

            velocity: note.velocity,

            start: note.time,

            duration: note.duration,

        }))

    );

    notes.sort((a, b) => a.start - b.start);

    return {

        duration: midi.duration,

        notes,

    };

}
""",

    "lib/midi/PianoSampler.ts": """
import * as Tone from "tone";

let sampler: Tone.Sampler | null = null;

export async function getPianoSampler() {

    if (sampler)
        return sampler;

    await Tone.start();

    sampler = new Tone.Sampler({

        urls: {

            A0: "A0.mp3",

            C1: "C1.mp3",
            "D#1": "Ds1.mp3",
            "F#1": "Fs1.mp3",

            A1: "A1.mp3",

            C2: "C2.mp3",
            "D#2": "Ds2.mp3",
            "F#2": "Fs2.mp3",

            A2: "A2.mp3",

            C3: "C3.mp3",
            "D#3": "Ds3.mp3",
            "F#3": "Fs3.mp3",

            A3: "A3.mp3",

            C4: "C4.mp3",
            "D#4": "Ds4.mp3",
            "F#4": "Fs4.mp3",

            A4: "A4.mp3",

            C5: "C5.mp3",
            "D#5": "Ds5.mp3",
            "F#5": "Fs5.mp3",

            A5: "A5.mp3",

            C6: "C6.mp3",
            "D#6": "Ds6.mp3",
            "F#6": "Fs6.mp3",

            A6: "A6.mp3",

            C7: "C7.mp3",

            A7: "A7.mp3",

            C8: "C8.mp3",

        },

        release: 1,

        baseUrl: "https://tonejs.github.io/audio/salamander/",

    }).toDestination();

    await Tone.loaded();

    return sampler;

}
""",

    "lib/midi/index.ts": """
export * from "./types";
export * from "./MidiLoader";
export * from "./PianoSampler";
""",

    "components/music/index.ts": """
export {};
""",

    "components/music/MidiCard.tsx": """
'use client';

export default function MidiCard() {
    return null;
}
""",

    "components/music/PianoKeyboard.tsx": """
'use client';

export default function PianoKeyboard() {
    return null;
}
""",

    "components/music/PlaybackControls.tsx": """
'use client';

export default function PlaybackControls() {
    return null;
}
""",

    "components/music/MidiVisualizer.tsx": """
'use client';

export default function MidiVisualizer() {
    return null;
}
"""
}


def write_file(path: str, content: str):
    p = PROJECT_ROOT / path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(textwrap.dedent(content).strip() + "\n", encoding="utf-8")
    print(f"✔ {path}")


def main():
    print("Generating MIDI architecture...\n")

    for path, content in FILES.items():
        write_file(path, content)

    print("\nDone.")


if __name__ == "__main__":
    main()