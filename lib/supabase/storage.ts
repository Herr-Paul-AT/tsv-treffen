import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL } from './config';

const BUCKET = 'public-assets';
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif'];

function serviceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !key) {
    throw new Error('Supabase Storage ist nicht konfiguriert (URL/Service-Key fehlt).');
  }
  return createClient(SUPABASE_URL, key, { auth: { persistSession: false } });
}

function slugifyName(name: string): string {
  const dot = name.lastIndexOf('.');
  const base = (dot > 0 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'logo';
  const ext = (dot > 0 ? name.slice(dot + 1) : 'png').toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
  return `${base}.${ext}`;
}

/**
 * Lädt eine Bilddatei in den öffentlichen Bucket und gibt die öffentliche URL zurück.
 * `folder` z. B. 'sponsors'. Gibt null zurück, wenn keine Datei übergeben wurde.
 */
export async function uploadPublicImage(file: File | null, folder: string): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (file.size > MAX_BYTES) throw new Error('Das Bild ist zu groß (max. 5 MB).');
  if (file.type && !ALLOWED.includes(file.type)) {
    throw new Error('Nur Bilddateien (PNG, JPG, WEBP, SVG, GIF) sind erlaubt.');
  }

  const supabase = serviceClient();
  const stamp = Date.now().toString(36);
  const path = `${folder}/${stamp}-${slugifyName(file.name || 'logo.png')}`;

  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: file.type || 'image/png', upsert: false });
  if (error) throw new Error(`Upload fehlgeschlagen: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
