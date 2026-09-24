import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL } from './config';

/**
 * Supabase-Client mit Service-Role (nur serverseitig!). Wird für Auth-Admin-
 * Aufgaben genutzt: Konto anlegen, Bestätigungs-/Reset-Links erzeugen — die
 * Links verschicken wir dann selbst über unser SMTP (lib/mailer.ts), damit
 * wir nicht vom Supabase-Mailer abhängen.
 */
export function createSupabaseAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !key) {
    throw new Error('Supabase Service-Role-Key fehlt (SUPABASE_SERVICE_ROLE_KEY).');
  }
  return createClient(SUPABASE_URL, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
