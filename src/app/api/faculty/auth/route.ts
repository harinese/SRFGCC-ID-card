import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getFacultyKey, COOKIE_NAME, isFacultyAuthenticated } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key } = body;

    if (!key || typeof key !== 'string') {
      return NextResponse.json(
        { error: 'Access key is required' },
        { status: 400 }
      );
    }

    const validKey = getFacultyKey();
    if (key.trim() !== validKey) {
      return NextResponse.json(
        { error: 'Invalid faculty access key' },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, validKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ success: true, message: 'Authenticated successfully' });
  } catch {
    return NextResponse.json(
      { error: 'Authentication service encountered an error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const authenticated = await isFacultyAuthenticated(request);
  return NextResponse.json({ authenticated });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return NextResponse.json({ success: true, message: 'Logged out successfully' });
}
