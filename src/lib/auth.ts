import { cookies } from 'next/headers';

const COOKIE_NAME = 'faculty_session_token';
const DEFAULT_FACULTY_KEY = 'srfgcc-faculty-pass-2026';

export function getFacultyKey(): string {
  return process.env.FACULTY_ACCESS_KEY || DEFAULT_FACULTY_KEY;
}

export async function isFacultyAuthenticated(request?: Request): Promise<boolean> {
  const validKey = getFacultyKey();

  if (request) {
    const url = new URL(request.url);
    const keyParam = url.searchParams.get('key');
    if (keyParam && keyParam === validKey) {
      return true;
    }

    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.replace(/^Bearer\s+/i, '') === validKey) {
      return true;
    }
  }

  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);
    if (sessionCookie && sessionCookie.value === validKey) {
      return true;
    }
  } catch {
    // cookies() unavailable in non-request contexts
  }

  return false;
}

export { COOKIE_NAME };
