import { config } from 'dotenv';
config({ path: '.env.local' });
config();

import { createClient } from '@supabase/supabase-js';

/**
 * Legt einen Supabase-Auth-User mit Passwort an (oder setzt bei bestehendem
 * User das Passwort) — E-Mail direkt bestätigt, sodass sofortiger Passwort-
 * Login möglich ist. Unabhängig vom Mailversand.
 *
 * Aufruf:
 *   ADMIN_EMAIL=… ADMIN_PASSWORD=… npm run db:create-admin
 * Benötigt in .env.local: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = (process.env.ADMIN_EMAIL ?? 'office@martinhofmann.at').toLowerCase();
const password = process.env.ADMIN_PASSWORD;

async function main() {
  if (!url || !key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY müssen in .env.local stehen.');
  }
  if (!password) throw new Error('ADMIN_PASSWORD fehlt (per Env übergeben).');

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Versuch: neu anlegen (E-Mail direkt bestätigt)
  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (!error) {
    console.log(`Admin-Auth-User angelegt: ${email} (E-Mail bestätigt).`);
    return;
  }

  // Existiert schon → finden + Passwort setzen
  if (!/registered|exists|already/i.test(error.message)) throw error;
  console.log('User existiert bereits — setze Passwort…');

  let userId: string | undefined;
  for (let page = 1; !userId && page <= 20; page++) {
    const { data, error: e2 } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (e2) throw e2;
    const u = data.users.find((x) => x.email?.toLowerCase() === email);
    if (u) userId = u.id;
    if (data.users.length < 200) break;
  }
  if (!userId) throw new Error('Bestehender User nicht auffindbar.');

  const { error: e3 } = await supabase.auth.admin.updateUserById(userId, {
    password,
    email_confirm: true,
  });
  if (e3) throw e3;
  console.log(`Passwort für bestehenden User gesetzt: ${email}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
