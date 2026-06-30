import { NextResponse } from 'next/server';
import { removeSessionCookie } from '@/lib/auth';

// POST: Remove session cookie and log out admin
export async function POST() {
  try {
    removeSessionCookie();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Failed to clear session' }, { status: 500 });
  }
}
