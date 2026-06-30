import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { localPubCreate, localPubGetMany } from '@/lib/localStore';

// GET: Fetch all publications (news, research logs)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  const whereClause: any = {};
  if (category) {
    whereClause.category = category;
  }

  // Try PostgreSQL
  try {
    const publications = await db.publication.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(publications);
  } catch {
    // Fallback to local store
  }

  try {
    const publications = await localPubGetMany(whereClause);
    return NextResponse.json(publications);
  } catch (error) {
    console.error('Error fetching publications:', error);
    return NextResponse.json({ error: 'Data unavailable' }, { status: 500 });
  }
}

// POST: Create a new publication (Protected)
export async function POST(request: NextRequest) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { title, content, category, fileUrl } = body;

  if (!title || !content || !category) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const payload = {
    title,
    content,
    category,
    fileUrl: fileUrl || null,
  };

  // Try PostgreSQL
  try {
    const pub = await db.publication.create({ data: payload });
    return NextResponse.json(pub, { status: 201 });
  } catch {
    // Fallback to local store
  }

  try {
    const pub = await localPubCreate(payload);
    return NextResponse.json(pub, { status: 201 });
  } catch (error) {
    console.error('Error creating publication:', error);
    return NextResponse.json({ error: 'Failed to create publication' }, { status: 500 });
  }
}
