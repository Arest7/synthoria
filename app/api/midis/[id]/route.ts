import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { deleteFile } from '@/lib/storage';
import { localMidiDelete, localMidiGetById } from '@/lib/localStore';

// DELETE: Remove a MIDI entry and its physical file (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  // ── Try primary DB ────────────────────────────────────────────────────
  try {
    const midi = await db.midiFile.findUnique({ where: { id } });

    if (!midi) {
      return NextResponse.json({ error: 'MIDI file not found' }, { status: 404 });
    }

    await deleteFile(midi.fileUrl);
    await db.midiFile.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    // DB unavailable — fall through to local store
  }

  // ── Local JSON fallback ───────────────────────────────────────────────
  try {
    const midi = await localMidiGetById(id);
    if (!midi) {
      return NextResponse.json({ error: 'MIDI file not found' }, { status: 404 });
    }

    await deleteFile(midi.fileUrl);
    await localMidiDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Local store delete failed:', error);
    return NextResponse.json({ error: 'Failed to delete MIDI entry' }, { status: 500 });
  }
}
