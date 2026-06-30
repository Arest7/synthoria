import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { deleteFile } from '@/lib/storage';
import { localPubDelete, localPubGetById } from '@/lib/localStore';

// DELETE: Securely remove a publication entry and its physical file (Protected)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  // Try PostgreSQL
  try {
    const pub = await db.publication.findUnique({ where: { id } });

    if (!pub) {
      return NextResponse.json({ error: 'Publication not found' }, { status: 404 });
    }

    if (pub.fileUrl) {
      await deleteFile(pub.fileUrl);
    }

    await db.publication.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Publication deleted' });
  } catch {
    // Fallback to local store
  }

  try {
    const pub = await localPubGetById(id);
    if (!pub) {
      return NextResponse.json({ error: 'Publication not found' }, { status: 404 });
    }

    if (pub.fileUrl) {
      await deleteFile(pub.fileUrl);
    }

    await localPubDelete(id);

    return NextResponse.json({ success: true, message: 'Publication deleted' });
  } catch (error) {
    console.error('Error deleting publication:', error);
    return NextResponse.json({ error: 'Failed to delete publication' }, { status: 500 });
  }
}
