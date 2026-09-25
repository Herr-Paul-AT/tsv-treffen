import { redirect } from 'next/navigation';
import { uploadPublicImage } from '@/lib/supabase/storage';

export const dynamic = 'force-dynamic';

const TOKEN = 'diag-9pq4x7k2';

/**
 * TEMPORÄR (wird wieder entfernt): reproduziert den Foto-Upload per Server
 * Action auf Vercel ohne Login — token-geschützt. Ergebnis landet in der URL.
 */
export default async function DiagUploadPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string; result?: string }>;
}) {
  const sp = await searchParams;
  if (sp.t !== TOKEN) return <main>Not found</main>;

  async function diagUpload(formData: FormData) {
    'use server';
    if (String(formData.get('t')) !== TOKEN) redirect('/');
    const t0 = Date.now();
    const out: Record<string, unknown> = { node: process.version, region: process.env.VERCEL_REGION ?? null };
    try {
      const file = formData.get('photo');
      out.received = file instanceof File ? { size: file.size, type: file.type, name: file.name } : null;
      const url = await uploadPublicImage(file instanceof File ? file : null, 'diag');
      out.uploaded = url ? url.split('/').slice(-2).join('/') : null;
      out.ok = Boolean(url);
    } catch (e) {
      out.ok = false;
      out.error = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
    }
    out.ms = Date.now() - t0;
    redirect(`/diag-upload?t=${TOKEN}&result=${encodeURIComponent(JSON.stringify(out))}`);
  }

  return (
    <main style={{ padding: 24, fontFamily: 'monospace' }}>
      <form action={diagUpload} encType="multipart/form-data">
        <input type="hidden" name="t" value={TOKEN} />
        <input type="file" name="photo" accept="image/*" />
        <button type="submit">Upload-Test</button>
      </form>
      {sp.result && <pre id="result">{sp.result}</pre>}
    </main>
  );
}
