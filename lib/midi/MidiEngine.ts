import * as Tone from "tone";

import { loadMidi } from "./MidiLoader";
import { getPianoSampler } from "./PianoSampler";
import { MidiSong, MidiNote } from "./types";

type NoteListener     = (notes: number[]) => void;
type ProgressListener = (progress: number, current: number) => void;
type StateListener    = (playing: boolean) => void;

export class MidiEngine {
    private static activeEngine: MidiEngine | null = null;

    private song: MidiSong | null = null;
    private sampler: Tone.PolySynth | null = null;

    /** performance.now() timestamp at which playback started (wall-clock ms) */
    private wallStartMs  = 0;
    /** Seconds into the song at which we (re)started */
    private pausedAt     = 0;
    private playing      = false;

    // Look-ahead Scheduler variables
    private schedulerInterval: ReturnType<typeof setInterval> | null = null;
    private nextNoteIndex = 0;
    private scheduleAheadTime = 0.150; // Look ahead 150ms to keep stop/pause responsive

    private timers: ReturnType<typeof setTimeout>[] = [];
    private progressTimer: ReturnType<typeof setInterval> | null = null;

    private noteListeners:     NoteListener[]     = [];
    private progressListeners: ProgressListener[] = [];
    private stateListeners:    StateListener[]    = [];
    
    // Track active note counts per pitch to support concurrent/overlapping identical pitches correctly
    private activeNotesCount = new Map<number, number>();

    constructor(private readonly url: string) {}

    // ── Public subscription API ─────────────────────────────────────────────

    onNotes(cb: NoteListener) {
        this.noteListeners.push(cb);
        return () => { this.noteListeners = this.noteListeners.filter(f => f !== cb); };
    }
    onProgress(cb: ProgressListener) {
        this.progressListeners.push(cb);
        return () => { this.progressListeners = this.progressListeners.filter(f => f !== cb); };
    }
    onStateChange(cb: StateListener) {
        this.stateListeners.push(cb);
        cb(this.playing);
        return () => { this.stateListeners = this.stateListeners.filter(f => f !== cb); };
    }

    // ── Loading ─────────────────────────────────────────────────────────────

    /** Loads only the MIDI file. No AudioContext touch — safe on mount. */
    async loadData(): Promise<void> {
        if (this.song) return;
        this.song = await loadMidi(this.url);
    }

    private async ensureSampler(): Promise<void> {
        if (this.sampler) return;
        this.sampler = await getPianoSampler();
    }

    // ── Playback ────────────────────────────────────────────────────────────

    async play() {
        if (MidiEngine.activeEngine && MidiEngine.activeEngine !== this) {
            MidiEngine.activeEngine.stop();
        }
        MidiEngine.activeEngine = this;

        if (!this.song) await this.loadData();
        if (!this.song) return;

        await this.ensureSampler();
        if (!this.sampler) return;

        this.stopTimers(); // cancel previous run

        await Tone.start();

        // ── CRITICAL: record wall-clock start AFTER all async work is done ──
        this.wallStartMs = performance.now();
        this.playing     = true;
        this.emitState(true);

        const resumeFrom = this.pausedAt; // seconds into song

        // Initialize the scheduler pointer to skip past notes
        this.nextNoteIndex = 0;
        while (
            this.nextNoteIndex < this.song.notes.length &&
            this.song.notes[this.nextNoteIndex].start < resumeFrom
        ) {
            this.nextNoteIndex++;
        }

        // Run the scheduler immediately and then every 30ms
        this.scheduleNotes();
        this.schedulerInterval = setInterval(() => {
            this.scheduleNotes();
        }, 30);

        // Progress bar updates
        this.progressTimer = setInterval(() => {
            const elapsed = this.getPlaybackTime();
            this.emitProgress(elapsed / this.song!.duration, elapsed);
            if (elapsed >= this.song!.duration) this.stop();
        }, 33);
    }

    private scheduleNotes() {
        if (!this.playing || !this.song) return;

        const currentSongTime = this.getPlaybackTime();
        const lookAheadEnd = currentSongTime + this.scheduleAheadTime;

        while (this.nextNoteIndex < this.song.notes.length) {
            const note = this.song.notes[this.nextNoteIndex];

            // If the note starts beyond our lookahead window, stop scheduling for this tick
            if (note.start > lookAheadEnd) {
                break;
            }

            // 1. Audio Timing: Schedule audio directly on Web Audio timeline with absolute precision
            const delaySec = note.start - currentSongTime;
            const playTime = Tone.now() + Math.max(0, delaySec);
            
            this.sampler!.triggerAttackRelease(
                Tone.Midi(note.note).toNote(),
                note.duration,
                playTime,
                note.velocity,
            );

            // 2. Visual Timing: Schedule key glow updates on JS thread
            const delayMs = delaySec * 1000;
            let onTimer: ReturnType<typeof setTimeout> | null = null;
            let offTimer: ReturnType<typeof setTimeout> | null = null;

            onTimer = setTimeout(() => {
                if (!this.playing) return;

                // Update active notes for visualizer
                const currentCount = this.activeNotesCount.get(note.note) ?? 0;
                this.activeNotesCount.set(note.note, currentCount + 1);
                this.emitNotes(Array.from(this.activeNotesCount.keys()));

                offTimer = setTimeout(() => {
                    const current = this.activeNotesCount.get(note.note) ?? 0;
                    if (current > 1) {
                        this.activeNotesCount.set(note.note, current - 1);
                    } else {
                        this.activeNotesCount.delete(note.note);
                    }
                    this.emitNotes(Array.from(this.activeNotesCount.keys()));
                    
                    // Clean up offTimer reference
                    if (offTimer) {
                        this.timers = this.timers.filter(t => t !== offTimer);
                    }
                }, note.duration * 1000);

                this.timers.push(offTimer);

                // Clean up onTimer reference
                if (onTimer) {
                    this.timers = this.timers.filter(t => t !== onTimer);
                }
            }, Math.max(0, delayMs));

            this.timers.push(onTimer);
            this.nextNoteIndex++;
        }
    }

    pause() {
        this.pausedAt = this.getPlaybackTime();
        this.stopTimers();
        this.playing = false;
        this.emitState(false);
    }

    stop() {
        this.stopTimers();
        this.pausedAt = 0;
        this.playing  = false;
        this.emitProgress(0, 0);
        this.emitNotes([]);
        this.emitState(false);
        if (MidiEngine.activeEngine === this) MidiEngine.activeEngine = null;
    }

    // ── Accessors ───────────────────────────────────────────────────────────

    get duration(): number  { return this.song?.duration ?? 0; }
    get notes(): MidiNote[] { return this.song?.notes    ?? []; }
    get isPlaying(): boolean { return this.playing; }

    /**
     * Returns the exact current playback position in seconds,
     * derived from performance.now() on the same clock as the audio timers.
     */
    getPlaybackTime(): number {
        if (!this.playing) return this.pausedAt;
        return this.pausedAt + (performance.now() - this.wallStartMs) / 1000;
    }

    // ── Internals ───────────────────────────────────────────────────────────

    private stopTimers() {
        // Cancel all pending timeouts
        this.timers.forEach(clearTimeout);
        this.timers = [];
        
        if (this.schedulerInterval) {
            clearInterval(this.schedulerInterval);
            this.schedulerInterval = null;
        }
        if (this.progressTimer) {
            clearInterval(this.progressTimer);
            this.progressTimer = null;
        }

        // Stop any notes currently held by the synth
        try { this.sampler?.releaseAll(); } catch { /* ignore */ }

        this.activeNotesCount.clear();
        this.emitNotes([]);
    }

    private emitNotes(n: number[])             { this.noteListeners.forEach(fn => fn(n)); }
    private emitProgress(p: number, t: number) { this.progressListeners.forEach(fn => fn(p, t)); }
    private emitState(s: boolean)              { this.stateListeners.forEach(fn => fn(s)); }
}