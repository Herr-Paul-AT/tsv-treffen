'use client';

import { useRef, useState } from 'react';

/**
 * Datei-Auswahl, die Bilder VOR dem Upload im Browser verkleinert (max. Kante
 * `maxDim`, JPEG). Grund: Vercel lehnt Anfragen über 4,5 MB hart ab (413) —
 * Handyfotos sind oft größer. Nach dem Verkleinern sind es ~200–400 KB.
 * Nicht-Bilder (PDF) werden unverändert durchgereicht, aber gegen das Limit
 * geprüft, damit die Meldung im Formular erscheint statt einer Fehlerseite.
 */
const VERCEL_LIMIT_BYTES = 4 * 1024 * 1024; // knapp unter 4,5 MB

type Props = {
  name: string;
  accept?: string;
  multiple?: boolean;
  required?: boolean;
  maxDim?: number;
  quality?: number;
  className?: string;
};

async function shrinkImage(file: File, maxDim: number, quality: number): Promise<File> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' } as ImageBitmapOptions).catch(
    () => null,
  );
  if (!bitmap) return file; // nicht dekodierbar (z. B. HEIC) → Original
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();
  const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', quality));
  if (!blob) return file;
  // Nur ersetzen, wenn es wirklich kleiner wird.
  if (blob.size >= file.size && scale === 1) return file;
  const base = file.name.replace(/\.[a-z0-9]+$/i, '') || 'bild';
  return new File([blob], `${base}.jpg`, { type: 'image/jpeg', lastModified: Date.now() });
}

function fmt(bytes: number) {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

export function ImageFileInput({
  name,
  accept = 'image/png,image/jpeg,image/webp',
  multiple = false,
  required = false,
  maxDim = 1600,
  quality = 0.85,
  className,
}: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onChange() {
    const input = ref.current;
    if (!input || !input.files || input.files.length === 0) {
      setStatus(null);
      setError(null);
      return;
    }
    setError(null);
    setStatus('Wird vorbereitet …');
    const out = new DataTransfer();
    let tooBig: string | null = null;
    for (const f of Array.from(input.files)) {
      let next = f;
      if (/^image\/(jpeg|png|webp)$/i.test(f.type)) {
        try {
          next = await shrinkImage(f, maxDim, quality);
        } catch {
          next = f;
        }
      }
      if (next.size > VERCEL_LIMIT_BYTES) {
        tooBig = `„${f.name}" ist mit ${fmt(next.size)} zu groß (max. 4 MB). Bitte eine kleinere Datei wählen.`;
      }
      out.items.add(next);
    }
    input.files = out.files;
    if (tooBig) {
      setError(tooBig);
      setStatus(null);
      input.setCustomValidity(tooBig);
    } else {
      input.setCustomValidity('');
      const total = Array.from(out.files).reduce((s, f) => s + f.size, 0);
      setStatus(
        out.files.length === 1
          ? `Bereit · ${fmt(total)}`
          : `${out.files.length} Dateien bereit · ${fmt(total)}`,
      );
    }
  }

  return (
    <div>
      <input
        ref={ref}
        type="file"
        name={name}
        accept={accept}
        multiple={multiple}
        required={required}
        onChange={onChange}
        className={
          className ??
          'block w-full text-[14px] text-stone-700 file:mr-4 file:h-11 file:px-4 file:rounded-md file:border-0 file:bg-stone-800 file:text-paper-50 file:text-[14px] file:font-medium hover:file:bg-stone-700 file:cursor-pointer'
        }
      />
      {status && !error && (
        <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-forest-700">{status}</p>
      )}
      {error && <p className="mt-1.5 text-[13px] text-danger">{error}</p>}
    </div>
  );
}
