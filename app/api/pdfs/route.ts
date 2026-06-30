import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { localPdfCreate, localPdfGetMany } from '@/lib/localStore';

// GET: Fetch all PDF documents
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const grade = searchParams.get('grade');

  const whereClause: any = {};
  if (grade) {
    whereClause.grade = parseInt(grade);
  }

  // Try PostgreSQL
  try {
    const pdfs = await db.pdfDocument.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(pdfs);
  } catch {
    // Fallback to local store
  }

  try {
    const pdfs = await localPdfGetMany(whereClause);
    return NextResponse.json(pdfs);
  } catch (error) {
    console.error('Error fetching PDFs:', error);
    return NextResponse.json({ error: 'Data unavailable' }, { status: 500 });
  }
}

// POST: Create a new PDF entry (Protected)
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

  const { title, description, grade, fileUrl, fileSize } = body;

  if (!title || !fileUrl) {
    return NextResponse.json({ error: 'Missing title or fileUrl' }, { status: 400 });
  }

  const payload = {
    title,
    description: description || '',
    grade: grade ? parseInt(grade) : null,
    fileUrl,
    fileSize: fileSize || '1.0 MB',
  };

  // Try PostgreSQL
  try {
    const newPdf = await db.pdfDocument.create({ data: payload });
    return NextResponse.json(newPdf, { status: 201 });
  } catch {
    // Fallback to local store
  }

  try {
    const newPdf = await localPdfCreate(payload);
    return NextResponse.json(newPdf, { status: 201 });
  } catch (error) {
    console.error('Error creating PDF:', error);
    return NextResponse.json({ error: 'Failed to create PDF entry' }, { status: 500 });
  }
}
