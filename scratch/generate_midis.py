import os

def to_vlq(value):
    if value == 0:
        return b'\x00'
    bytes_list = []
    while value > 0:
        b = value & 0x7F
        value >>= 7
        if bytes_list:
            b |= 0x80
        bytes_list.append(b)
    return bytes(reversed(bytes_list))

def make_midi_file(notes_list):
    # notes_list is a list of tuples: (pitch, duration_in_ticks, delay_in_ticks)
    # Header chunk: MThd, length=6, format=0 (1 track), tracks=1, division=96 (96 ticks per quarter note)
    header = b'MThd\x00\x00\x00\x06\x00\x00\x00\x01\x00\x60'
    
    # Track events
    events = bytearray()
    
    # Tempo event (120 bpm = 500,000 microsec/beat): delta=0, FF 51 03 07 A1 20
    events.extend(b'\x00\xFF\x51\x03\x07\xA1\x20')
    
    # Time signature 4/4: delta=0, FF 58 04 04 02 18 08
    events.extend(b'\x00\xFF\x58\x04\x04\x02\x18\x08')
    
    for pitch, duration, delay in notes_list:
        # Note on: delta-time is delay, 0x90, pitch, velocity 64
        events.extend(to_vlq(delay))
        events.extend(bytes([0x90, pitch, 64]))
        
        # Note off: delta-time is duration, 0x80, pitch, velocity 0
        events.extend(to_vlq(duration))
        events.extend(bytes([0x80, pitch, 0]))
        
    # End of track meta event: delta=0, FF 2F 00
    events.extend(b'\x00\xFF\x2F\x00')
    
    # Track chunk: MTrk, length, events
    track_chunk = b'MTrk' + len(events).to_bytes(4, byteorder='big') + events
    
    return header + track_chunk

def main():
    os.makedirs('public/uploads', exist_ok=True)
    
    # 1. Vatanim: A simple cheerful melody (C major scale and back)
    vatanim_notes = [
        (60, 48, 0), (62, 48, 0), (64, 48, 0), (65, 48, 0),
        (67, 48, 0), (69, 48, 0), (71, 48, 0), (72, 96, 0),
        (72, 48, 0), (71, 48, 0), (69, 48, 0), (67, 48, 0),
        (65, 48, 0), (64, 48, 0), (62, 48, 0), (60, 96, 0)
    ]
    
    # 2. Bahor Keldi: A spring-like jumping arpeggio melody
    bahor_notes = [
        (60, 24, 0), (64, 24, 0), (67, 24, 0), (72, 48, 0),
        (67, 24, 0), (64, 24, 0), (60, 48, 0),
        (62, 24, 0), (65, 24, 0), (69, 24, 0), (74, 48, 0),
        (69, 24, 0), (65, 24, 0), (62, 48, 0)
    ]
    
    # 3. Tanovar: A deep slow pentatonic melody (O‘zbek mumtoz kuyi style)
    tanovar_notes = [
        (60, 96, 0), (63, 96, 0), (65, 96, 0), (67, 96, 0),
        (70, 96, 0), (72, 192, 0), (70, 96, 0), (67, 96, 0),
        (65, 192, 0), (63, 96, 0), (60, 192, 0)
    ]
    
    with open('public/uploads/vatanim.mid', 'wb') as f:
        f.write(make_midi_file(vatanim_notes))
    print("Created public/uploads/vatanim.mid")
        
    with open('public/uploads/bahor_keldi.mid', 'wb') as f:
        f.write(make_midi_file(bahor_notes))
    print("Created public/uploads/bahor_keldi.mid")
        
    with open('public/uploads/tanovar.mid', 'wb') as f:
        f.write(make_midi_file(tanovar_notes))
    print("Created public/uploads/tanovar.mid")

if __name__ == '__main__':
    main()
