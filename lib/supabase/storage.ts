import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL } from './config';

const BUCKET = 'public-assets';
// Handyfotos dürfen groß sein — Rasterbilder werden vor dem Upload verkleinert.
const MAX_BYTES = 20 * 1024 * 1024; // 20 MB
const MAX_PDF_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif'];
const ALLOWED_FILE = [...ALLOWED, 'application/pdf'];
// Diese Formate werden serverseitig auf Web-Größe gebracht (JPEG, max. 1600 px).
const RASTER = ['image/png', 'image/jpeg', 'image/webp'];

/**
 * sharp erst bei Bedarf laden — und wenn die native Bibliothek auf dem Server
 * nicht verfügbar ist, ohne Verkleinerung weiterarbeiten statt zu crashen.
 */
async function loadSharp(): Promise<typeof import('sharp') | null> {
  try {
    const mod = await import('sharp');
    return (mod.default ?? mod) as typeof import('sharp');
  } catch {
    return null;
  }
}

/**
 * Rasterbilder (JPG/PNG/WEBP) verkleinern + als JPEG ausgeben; alles andere
 * (SVG, GIF, PDF) unverändert durchreichen. Berücksichtigt EXIF-Drehung (Handy).
 */
async function prepareUpload(
  file: File,
): Promise<{ bytes: Uint8Array; contentType: string; ext: string | null }> {
  const raw = new Uint8Array(await file.arrayBuffer());
  const type = file.type || 'application/octet-stream';
  if (!RASTER.includes(type)) return { bytes: raw, contentType: type, ext: null };
  const sharp = await loadSharp();
  if (!sharp) return { bytes: raw, contentType: type, ext: null };
  try {
    const out = await sharp(raw)
      .rotate()
      .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
    return { bytes: new Uint8Array(out), contentType: 'image/jpeg', ext: 'jpg' };
  } catch {
    // Bild nicht dekodierbar (z. B. HEIC) → Original hochladen.
    return { bytes: raw, contentType: type, ext: null };
  }
}

function withExt(path: string, ext: string | null): string {
  if (!ext) return path;
  return path.replace(/\.[a-z0-9]+$/i, '') + '.' + ext;
}

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
  if (file.size > MAX_BYTES) throw new Error('Das Bild ist zu groß (max. 20 MB).');
  if (file.type && !ALLOWED.includes(file.type)) {
    throw new Error('Nur Bilddateien (PNG, JPG, WEBP, SVG, GIF) sind erlaubt.');
  }

  const supabase = serviceClient();
  const stamp = Date.now().toString(36);
  const prepared = await prepareUpload(file);
  const path = withExt(`${folder}/${stamp}-${slugifyName(file.name || 'logo.png')}`, prepared.ext);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, prepared.bytes, { contentType: prepared.contentType, upsert: false });
  if (error) throw new Error(`Upload fehlgeschlagen: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export type UploadedFile = { url: string; name: string };

/**
 * Lädt eine Datei (Bild ODER PDF) hoch — z. B. Flyer für Events/News.
 * Gibt {url, name} zurück oder null, wenn keine Datei übergeben wurde.
 */
export async function uploadPublicFile(file: File | null, folder: string): Promise<UploadedFile | null> {
  if (!file || file.size === 0) return null;
  const isPdf = file.type === 'application/pdf';
  if (isPdf && file.size > MAX_PDF_BYTES) throw new Error('Das PDF ist zu groß (max. 10 MB).');
  if (!isPdf && file.size > MAX_BYTES) throw new Error('Die Datei ist zu groß (max. 20 MB).');
  if (file.type && !ALLOWED_FILE.includes(file.type)) {
    throw new Error('Nur Bilder (PNG, JPG, WEBP, SVG, GIF) oder PDF sind erlaubt.');
  }

  const supabase = serviceClient();
  const stamp = Date.now().toString(36);
  const original = file.name || 'anhang';
  const prepared = await prepareUpload(file);
  const path = withExt(`${folder}/${stamp}-${slugifyName(original)}`, prepared.ext);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, prepared.bytes, { contentType: prepared.contentType, upsert: false });
  if (error) throw new Error(`Upload fehlgeschlagen: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, name: original };
}
