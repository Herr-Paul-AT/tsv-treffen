'use server';

import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { members } from '@/lib/db/schema';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

function safeRedirect(target: string | null | undefined): string {
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

async function isKnownMember(email: string): Promise<boolean> {
  const rows = await db.select({ id: members.id }).from(members).where(eq(members.email, email)).limit(1);
  return rows.length > 0;
}

// --- Anmelden ---
export async function signInWithPassword(formData: FormData) {
  const redirectTo = safeRedirect(String(formData.get('redirect') ?? ''));
  if (!isSupabaseConfigured()) redirect(redirectTo);

  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  if (!email || !password) redirect(`/login?error=missing&redirect=${encodeURIComponent(redirectTo)}`);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/login?error=credentials&redirect=${encodeURIComponent(redirectTo)}`);
  redirect(redirectTo);
}

// --- Konto einrichten / erstes Passwort setzen ---
export async function registerAccount(formData: FormData) {
  if (!isSupabaseConfigured()) redirect('/app/dashboard');

  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const password2 = String(formData.get('password2') ?? '');

  if (!email) redirect('/login/registrieren?error=missing');
  if (password.length < 8) redirect('/login/registrieren?error=short');
  if (password !== password2) redirect('/login/registrieren?error=mismatch');

  // Nur bekannte Vereinsmitglieder dürfen ein Konto anlegen.
  if (!(await isKnownMember(email))) redirect('/login/registrieren?error=unknown');

  const origin = await siteOrigin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });
  if (error) {
    const code = /registered|exists/i.test(error.message) ? 'exists' : 'failed';
    redirect(`/login/registrieren?error=${code}`);
  }
  redirect('/login?registered=1');
}

// --- Passwort vergessen: Reset-Mail anfordern ---
export async function requestPasswordReset(formData: FormData) {
  if (!isSupabaseConfigured()) redirect('/login');
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  if (!email) redirect('/login/passwort-vergessen?error=missing');

  const origin = await siteOrigin();
  const supabase = await createSupabaseServerClient();
  // redirectTo führt über /auth/callback (tauscht Code gegen Session) zur Setz-Seite.
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect=/auth/passwort`,
  });
  // Aus Sicherheitsgründen immer Erfolg melden (verrät nicht, ob die Mail existiert).
  redirect('/login/passwort-vergessen?sent=1');
}

// --- Neues Passwort setzen (in aktiver Recovery-Session) ---
export async function updatePassword(formData: FormData) {
  if (!isSupabaseConfigured()) redirect('/login');
  const password = String(formData.get('password') ?? '');
  const password2 = String(formData.get('password2') ?? '');
  if (password.length < 8) redirect('/auth/passwort?error=short');
  if (password !== password2) redirect('/auth/passwort?error=mismatch');

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) redirect('/auth/passwort?error=failed');
  redirect('/login?reset=1');
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  redirect('/');
}
