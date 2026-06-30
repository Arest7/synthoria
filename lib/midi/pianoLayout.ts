import { MidiNote } from "./types";

export interface PianoKeyGeometry {
    midi: number;
    black: boolean;
    /** White-key unit X (0 = leftmost white key). Black keys use fractional positions. */
    x: number;
    /** Width in white-key units: 1.0 for white, ~0.58 for black */
    width: number;
}

const BLACK_PITCHES = new Set([1, 3, 6, 8, 10]);
const BLACK_OFFSETS: Record<number, number> = {
    1:  0.67,   // C#/Db — right of C
    3:  1.67,   // D#/Eb — right of D
    6:  3.67,   // F#/Gb — right of F
    8:  4.67,   // G#/Ab — right of G
    10: 5.67,   // A#/Bb — right of A
};

export class PianoLayout {
    readonly startNote: number;
    readonly endNote: number;
    readonly keys: PianoKeyGeometry[];
    readonly whiteKeysCount: number;

    constructor(notes: MidiNote[] = []) {
        let lo: number;
        let hi: number;

        if (notes.length > 0) {
            const pitches = notes.map(n => n.note);
            const fileMin = Math.min(...pitches);
            const fileMax = Math.max(...pitches);

            // Snap to octave boundaries (C = pitch 0 mod 12)
            const octLo = Math.floor(fileMin / 12);
            const octHi = Math.floor(fileMax / 12);

            lo = octLo * 12;
            hi = octHi * 12 + 11;

            // Enforce a minimum of 2 octaves for visual comfort
            while (hi - lo < 24) {
                if (lo > 24) lo -= 12; else hi += 12;
            }

            // Clamp to the standard 88-key piano range
            lo = Math.max(21, lo);
            hi = Math.min(108, hi);
        } else {
            // Sensible default when no MIDI is loaded yet: C3–B5 (3 octaves)
            lo = 48;  // C3
            hi = 83;  // B5
        }

        this.startNote = lo;
        this.endNote   = hi;

        const keys: PianoKeyGeometry[] = [];
        let whiteIdx = 0;

        // Build white keys first so we know their indices
        for (let midi = lo; midi <= hi; midi++) {
            const pitch = midi % 12;
            if (!BLACK_PITCHES.has(pitch)) {
                keys.push({ midi, black: false, x: whiteIdx, width: 1.0 });
                whiteIdx++;
            }
        }

        // Build black keys using precise fractional offsets within each octave group
        for (let midi = lo; midi <= hi; midi++) {
            const pitch = midi % 12;
            if (!BLACK_PITCHES.has(pitch)) continue;

            // Which octave (in note space) does this black key live in?
            // Find the C-note at the start of this octave group
            const octaveStart = Math.floor(midi / 12) * 12;
            // Index of the C key of this octave within our white key array
            const cOfOctave = keys.find(k => !k.black && k.midi === octaveStart);
            if (!cOfOctave) continue;

            const offset = BLACK_OFFSETS[pitch] ?? 0;
            keys.push({
                midi,
                black: true,
                x: cOfOctave.x + offset,
                width: 0.58,
            });
        }

        this.whiteKeysCount = whiteIdx;
        this.keys = keys;
    }

    /** Returns pixel x and pixel width for a given MIDI note given a total canvas width */
    getNotePosition(midi: number, canvasWidth: number): { x: number; width: number; black: boolean } | null {
        const key = this.keys.find(k => k.midi === midi);
        if (!key) return null;
        const scale = canvasWidth / this.whiteKeysCount;
        return {
            x: key.x * scale,
            width: key.width * scale,
            black: key.black,
        };
    }
}
