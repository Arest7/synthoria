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
