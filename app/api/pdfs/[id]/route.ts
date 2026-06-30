import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { deleteFile } from '@/lib/storage';
import { localPdfDelete, localPdfGetById } from '@/lib/localStore';

// DELETE: Remove a PDF entry and its physical file (Protected)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  // Try database
  try {
    const pdf = await db.pdfDocument.findUnique({ where: { id } });

    if (!pdf) {
      return NextResponse.json({ error: 'PDF not found' }, { status: 404 });
    }

    await deleteFile(pdf.fileUrl);
    await db.pdfDocument.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'PDF document deleted' });
  } catch {
    // Fallback to local store
  }

  try {
    const pdf = await localPdfGetById(id);
    if (!pdf) {
      return NextResponse.json({ error: 'PDF not found' }, { status: 404 });
    }

    await deleteFile(pdf.fileUrl);
    await localPdfDelete(id);

    return NextResponse.json({ success: true, message: 'PDF document deleted' });
  } catch (error) {
    console.error('Error deleting PDF:', error);
    return NextResponse.json({ error: 'Failed to delete PDF' }, { status: 500 });
  }
}
