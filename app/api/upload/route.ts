import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { saveFile } from '@/lib/storage';

// POST: Securely handle file uploads (MIDI, PDF, images)
export async function POST(request: NextRequest) {
  try {
    // 1. Auth Check
    const session = getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Login required.' }, { status: 401 });
    }

    // 2. Parse FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as 'midis' | 'pdfs' | 'images' | null; // target folder

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    if (!type || !['midis', 'pdfs', 'images'].includes(type)) {
      return NextResponse.json({ error: 'Invalid or missing upload type.' }, { status: 400 });
    }

    // 3. Save File using active Storage Adapter (Local FS vs S3)
    const fileUrl = await saveFile(file, type);

    // Calculate human-readable file size
    const sizeInKb = Math.round(file.size / 1024);
    const fileSizeStr = sizeInKb > 1000 
      ? `${(sizeInKb / 1024).toFixed(1)} MB` 
      : `${sizeInKb} KB`;

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName: file.name,
      fileSize: fileSizeStr,
    });

  } catch (error: any) {
    console.error('File upload API error:', error);
    return NextResponse.json({ 
      error: 'File upload failed.', 
      details: error.message 
    }, { status: 500 });
  }
}
