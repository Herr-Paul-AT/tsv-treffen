import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Auf allen Seiten laufen (hält die Session überall frisch, auch auf der
  // öffentlichen Startseite) — nur statische Assets ausgenommen. Der Schutz
  // von /app und /admin passiert weiterhin in updateSession().
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|serwist|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
