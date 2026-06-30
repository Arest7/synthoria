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
