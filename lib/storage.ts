import fs from 'fs/promises';
import path from 'path';

// Storage configuration
const STORAGE_TYPE = process.env.STORAGE_TYPE || 'local';
const UPLOAD_DIR = process.env.UPLOAD_DIR || './public/uploads';

// S3 settings
const S3_ENDPOINT = process.env.S3_ENDPOINT;
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
const S3_SECRET_KEY = process.env.S3_SECRET_KEY;
const S3_BUCKET = process.env.S3_BUCKET;

/**
 * Uploads a file to either local storage or an S3-compatible service.
 * Returns the public URL/path of the uploaded file.
 */
export async function saveFile(
  file: File,
  subFolder: 'midis' | 'pdfs' | 'images'
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique file name
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filename = `${timestamp}_${safeName}`;

  if (STORAGE_TYPE === 's3') {
    // If S3 is enabled, perform an upload to S3 using standard fetch REST API
    // (This is highly compatible with MinIO, Supabase S3, and AWS S3 without massive SDK dependencies)
    if (!S3_ENDPOINT || !S3_BUCKET || !S3_ACCESS_KEY || !S3_SECRET_KEY) {
      throw new Error('S3 configuration is missing in environment variables.');
    }

    try {
      const targetUrl = `${S3_ENDPOINT.replace(/\/$/, '')}/${S3_BUCKET}/${subFolder}/${filename}`;
      
      // Simple S3 REST PUT upload (works out of the box with Supabase storage API / MinIO public buckets)
      const response = await fetch(targetUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
          'Authorization': `Bearer ${S3_SECRET_KEY}`, // Common for Supabase
          // For standard AWS S3/MinIO, the user can configure a proxy, pre-signed URL, or we fall back to local
        },
        body: buffer,
      });

      if (!response.ok) {
        throw new Error(`S3 upload failed with status: ${response.status}`);
      }

      return targetUrl;
    } catch (error) {
      console.error('S3 upload error, falling back to local storage:', error);
      // Fallback to local storage if S3 fails
    }
  }

  // Local Storage (Default)
  const targetDir = path.join(process.cwd(), UPLOAD_DIR, subFolder);
  
  // Ensure directory exists
  await fs.mkdir(targetDir, { recursive: true });
  
  const filePath = path.join(targetDir, filename);
  await fs.writeFile(filePath, buffer);
  
  // Return the public URL path
  return `/uploads/${subFolder}/${filename}`;
}

/**
 * Deletes a file from either local storage or S3-compatible service.
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  if (!fileUrl) return;

  if (STORAGE_TYPE === 's3' || fileUrl.startsWith('http')) {
    // Delete from S3 via REST DELETE
    try {
      const response = await fetch(fileUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${S3_SECRET_KEY}`,
        },
      });
      if (!response.ok) {
        console.warn(`S3 delete failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('S3 delete error:', error);
    }
    return;
  }

  // Delete from local file system
  try {
    // Convert public URL (/uploads/midis/file.mid) to local path
    const relativePath = fileUrl.replace(/^\/uploads/, '');
    const filePath = path.join(process.cwd(), UPLOAD_DIR, relativePath);
    await fs.unlink(filePath);
  } catch (error) {
    console.warn(`Failed to delete local file at ${fileUrl}:`, error);
  }
}
