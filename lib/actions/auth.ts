'use server';

import { eq, sql } from 'drizzle-orm';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { rawRows } from '@/lib/db/raw';
import { members } from '@/lib/db/schema';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { sendAuthLinkMail } from '@/lib/mailer';

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

type AuthAccount = { confirmed: boolean };

/** Gibt es zu dieser E-Mail schon ein Login-Konto (Supabase Auth)? */
async function getAuthAccount(email: string): Promise<AuthAccount | null> {
  const rows = await rawRows<{ confirmed: boolean }>(sql`
    select (email_confirmed_at is not null) as confirmed
    from auth.users
    where lower(email) = ${email}
    limit 1
  `);
  return rows[0] ? { confirmed: Boolean(rows[0].confirmed) } : null;
}

/**
 * Baut den Link, den wir per eigener Mail verschicken. Der Token wird beim
 * Klick in /auth/callback gegen eine Session getauscht (verifyOtp).
 */
function buildAuthLink(origin: string, hashedToken: string, type: 'signup' | 'recovery', next: string) {
  const p = new URLSearchParams({ token_hash: hashedToken, type, redirect: next });
  return `${origin}/auth/callback?${p.toString()}`;
}

// --- Anmelden ---
export async function signInWithPassword(formData: FormData) {
  const redirectTo = safeRedirect(String(formData.get('redirect') ?? ''));
  if (!isSupabaseConfigured()) redirect(redirectTo);

  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const back = (code: string): never =>
    redirect(`/login?error=${code}&redirect=${encodeURIComponent(redirectTo)}`);
  if (!email || !password) back('missing');

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // Hilfreichere Meldung statt pauschal „falsches Passwort“.
    const [account, known] = [await getAuthAccount(email), await isKnownMember(email)];
    if (!account && known) back('noaccount');
    if (account && !account.confirmed) back('unconfirmed');
    back('credentials');
  }
  redirect(redirectTo);
}

// --- Konto einrichten / erstes Passwort setzen ---
export async function registerAccount(formData: FormData) {
  if (!isSupabaseConfigured()) redirect('/app/dashboard');

  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const password2 = String(formData.get('password2') ?? '');
  const back = (code: string): never => redirect(`/login/registrieren?error=${code}`);

  if (!email) back('missing');
  if (password.length < 8) back('short');
  if (password !== password2) back('mismatch');

  // Nur bekannte Vereinsmitglieder dürfen ein Konto anlegen.
  if (!(await isKnownMember(email))) back('unknown');
  if (await getAuthAccount(email)) back('exists');

  // Konto anlegen + Bestätigungslink erzeugen (Supabase verschickt NICHTS —
  // wir mailen den Link selbst über unser SMTP).
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.auth.admin.generateLink({ type: 'signup', email, password });
  const token = data?.properties?.hashed_token;
  if (error || !token) back('failed');

  const link = buildAuthLink(await siteOrigin(), token!, 'signup', '/app/dashboard');
  try {
    const sent = await sendAuthLinkMail({ to: email, kind: 'signup', url: link });
    if (!sent) back('mailfailed');
  } catch {
    back('mailfailed');
  }
  redirect('/login?registered=1');
}

// --- Passwort vergessen: Reset-Link anfordern ---
export async function requestPasswordReset(formData: FormData) {
  if (!isSupabaseConfigured()) redirect('/login');
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  if (!email) redirect('/login/passwort-vergessen?error=missing');

  // Aus Sicherheitsgründen nach außen immer „gesendet“ melden.
  const done = (): never => redirect('/login/passwort-vergessen?sent=1');
  if (!(await isKnownMember(email))) done();

  const admin = createSupabaseAdminClient();
  // Mitglied ohne Login-Konto: Konto still anlegen, damit der Link ein
  // Passwort setzen kann (funktioniert so auch als „erstes Passwort“).
  if (!(await getAuthAccount(email))) {
    const { error } = await admin.auth.admin.createUser({ email, email_confirm: true });
    if (error) redirect('/login/passwort-vergessen?error=failed');
  }

  const { data, error } = await admin.auth.admin.generateLink({ type: 'recovery', email });
  const token = data?.properties?.hashed_token;
  if (error || !token) redirect('/login/passwort-vergessen?error=failed');

  const link = buildAuthLink(await siteOrigin(), token!, 'recovery', '/auth/passwort');
  try {
    const sent = await sendAuthLinkMail({ to: email, kind: 'recovery', url: link });
    if (!sent) redirect('/login/passwort-vergessen?error=failed');
  } catch {
    redirect('/login/passwort-vergessen?error=failed');
  }
  done();
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
