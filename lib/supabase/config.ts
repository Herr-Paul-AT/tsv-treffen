/**
 * Zentrale Erkennung, ob Supabase Auth konfiguriert ist.
 *
 * Ohne gesetzte Env-Variablen läuft die App im DEV-Modus weiter:
 * - keine echte Anmeldung (fester Dev-User über DEV_USER_EMAIL)
 * - Middleware lässt alle Routen durch
 *
 * Sobald URL + Anon-Key gesetzt sind, schaltet echte Anmeldung scharf.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
