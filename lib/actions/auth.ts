'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

function safeRedirect(target: string | null | undefined): string {
  // Nur interne Pfade zulassen.
  if (target && target.startsWith('/') && !target.startsWith('//')) return target;
  return '/app/dashboard';
}

async function siteOrigin(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3010';
  const proto = h.get('x-forwarded-proto') ?? (host.includes('localhost') ? 'http' : 'https');
  return `${proto}://${host}`;
}

export async function signInWithPassword(formData: FormData) {
  const redirectTo = safeRedirect(String(formData.get('redirect') ?? ''));

  // Dev-Modus ohne Supabase: einfach in den Mitgliederbereich.
  if (!isSupabaseConfigured()) redirect(redirectTo);

  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  if (!email || !password) redirect('/login?error=missing');

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect('/login?error=credentials');
  redirect(redirectTo);
}

export async function signInWithMagicLink(formData: FormData) {
  const redirectTo = safeRedirect(String(formData.get('redirect') ?? ''));
  if (!isSupabaseConfigured()) redirect(redirectTo);

  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  if (!email) redirect('/login?error=missing');

  const origin = await siteOrigin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}` },
  });
  if (error) redirect('/login?error=magiclink');
  redirect('/login?sent=1');
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  redirect('/');
}
