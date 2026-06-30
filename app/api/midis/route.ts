import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { localMidiCreate, localMidiGetMany } from '@/lib/localStore';

interface MidiWhereClause {
  grade?: number;
  isFeatured?: boolean;
}

// GET: Fetch all MIDIs, optionally filter by grade or featured
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const grade    = searchParams.get('grade');
  const featured = searchParams.get('featured');

  const whereClause: MidiWhereClause = {};
  if (grade)            whereClause.grade      = parseInt(grade);
  if (featured === 'true') whereClause.isFeatured = true;

  // ── Try primary DB ──────────────────────────────────────────────────────
  try {
    const midis = await db.midiFile.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(midis);
  } catch {
    // DB unavailable — fall through to local store
  }

  // ── Local JSON fallback (dev without Docker / no DB) ────────────────────
  try {
    const midis = await localMidiGetMany(whereClause);
    return NextResponse.json(midis);
  } catch (error) {
    console.error('Local store read failed:', error);
    return NextResponse.json({ error: 'Data unavailable' }, { status: 500 });
  }
}

// POST: Create a new MIDI entry (admin only)
export async function POST(request: NextRequest) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { title, composer, description, grade, genre, difficulty,
          fileUrl, fileSize, duration, compatSoftware, educationalNote, isFeatured } = body as Record<string, string | string[] | boolean | number>;

  if (!title || !composer || !grade || !fileUrl) {
    return NextResponse.json({ error: 'Missing required fields: title, composer, grade, fileUrl' }, { status: 400 });
  }

  const payload = {
    title:           String(title),
    composer:        String(composer),
    description:     description ? String(description) : '',
    grade:           typeof grade === 'number' ? grade : parseInt(String(grade)),
    genre:           genre ? String(genre) : "Bolalar qo'shig'i",
    difficulty:      difficulty ? String(difficulty) : 'EASY',
    fileUrl:         String(fileUrl),
    fileSize:        fileSize ? String(fileSize) : '15 KB',
    duration:        duration ? String(duration) : '02:00',
    compatSoftware:  Array.isArray(compatSoftware) ? compatSoftware : ['SeeMusic', 'Synthesia'],
    educationalNote: educationalNote ? String(educationalNote) : '',
    isFeatured:      Boolean(isFeatured),
  };

  // ── Try primary DB ──────────────────────────────────────────────────────
  try {
    const newMidi = await db.midiFile.create({ data: payload });
    return NextResponse.json(newMidi, { status: 201 });
  } catch {
    // DB unavailable — fall through to local store
  }

  // ── Local JSON fallback ─────────────────────────────────────────────────
  try {
    const newMidi = await localMidiCreate(payload);
    return NextResponse.json(newMidi, { status: 201 });
  } catch (error) {
    console.error('Local store write failed:', error);
    return NextResponse.json({ error: 'Failed to save MIDI entry' }, { status: 500 });
  }
}
