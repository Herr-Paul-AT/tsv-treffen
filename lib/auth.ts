import { createSupabaseServerClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

/**
 * E-Mail des aktuell angemeldeten Supabase-Users — oder null.
 * Im Dev-Modus (ohne Supabase) immer null; dort greift der DEV_USER_EMAIL-Fallback.
 */
export async function getAuthEmail(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.email ?? null;
}
