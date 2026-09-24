import { NextResponse, type NextRequest } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const OTP_TYPES: EmailOtpType[] = ['signup', 'recovery', 'magiclink', 'invite', 'email_change', 'email'];

/**
 * Rücksprung aus E-Mail-Links:
 *  - `token_hash` + `type`: unsere selbst verschickten Bestätigungs-/Reset-Links
 *    (Token wird serverseitig gegen eine Session getauscht).
 *  - `code`: OAuth/PKCE-Rücksprung.
 * Danach Weiterleitung ins Ziel (`redirect`, Standard: Mitgliederbereich).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const redirectParam = searchParams.get('redirect');
  const next = redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')
    ? redirectParam
    : '/app/dashboard';

  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  if (tokenHash && type && OTP_TYPES.includes(type)) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (!error) return NextResponse.redirect(`${origin}${next}`);
    return NextResponse.redirect(`${origin}/login?error=callback`);
  }

  const code = searchParams.get('code');
  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/login?error=callback`);
}
