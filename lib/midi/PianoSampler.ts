import * as Tone from "tone";

// Module-level singleton — created once, reused by all MidiEngine instances.
// Tone.start() is called by MidiEngine.play() before this function is ever
// reached, so the AudioContext is already unlocked here.
let synth: Tone.PolySynth | null = null;
let initialising = false;
let initPromise: Promise<Tone.PolySynth> | null = null;

export function getPianoSampler(): Promise<Tone.PolySynth> {
    // Return existing instance immediately
    if (synth) return Promise.resolve(synth);

    // Deduplicate concurrent calls (e.g. multiple engines playing at once)
    if (initPromise) return initPromise;

    initialising = true;
    initPromise = new Promise<Tone.PolySynth>((resolve) => {
        synth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "triangle" },
            envelope: {
                attack:  0.01,
                decay:   0.15,
                sustain: 0.35,
                release: 1.2,
            },
        }).toDestination();

        synth.maxPolyphony = 32;
        synth.volume.value = -8;
        initialising = false;
        resolve(synth);
    });

    return initPromise;
}