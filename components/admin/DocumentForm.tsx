import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Icon } from '@/components/ui/Icon';
import type { Document } from '@/lib/db/schema';

const fieldLabel = 'font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500';
const selectClass =
  'mt-2 w-full h-12 px-4 bg-white rounded-md border border-stone-200 text-[16px] text-stone-800 outline-none focus:border-lake-500 focus:ring-2 focus:ring-lake-500/15';

const CATEGORY_OPTIONS = [
  { value: 'statuten', label: 'Statuten' },
  { value: 'beitraege', label: 'Beiträge' },
  { value: 'protokoll', label: 'Protokolle' },
  { value: 'spielregeln', label: 'Spielregeln' },
  { value: 'formular', label: 'Formulare' },
  { value: 'sonstiges', label: 'Sonstiges' },
];

function isoDate(d: string | Date | null | undefined): string {
  if (!d) return '';
  if (typeof d === 'string') return d.slice(0, 10);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function DocumentForm({
  action,
  doc,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  doc?: Document;
  submitLabel: string;
}) {
  return (
    <form action={action} className="mt-8 max-w-2xl space-y-5">
      {doc && <input type="hidden" name="id" value={doc.id} />}

      <TextField label="Titel" name="title" required defaultValue={doc?.title ?? ''} placeholder="z. B. Vereinsstatuten 2026" />

      <label htmlFor="doc-category" className="block">
        <span className={fieldLabel}>Kategorie</span>
        <select id="doc-category" name="category" defaultValue={doc?.category ?? 'sonstiges'} className={selectClass}>
          {CATEGORY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <div>
        <TextField
          label="Link / Datei-URL"
          name="fileUrl"
          required
          defaultValue={doc?.fileUrl ?? ''}
          placeholder="https://…"
        />
        <p className="mt-1.5 text-[12.5px] text-stone-500 leading-snug">
          Vorerst per Link (z. B. Cloud-Speicher oder bestehende PDF-Adresse). Echtes Datei-Upload
          folgt mit Supabase Storage — das Dokument bleibt danach erhalten.
        </p>
      </div>

      <div>
        <label htmlFor="doc-description" className="block">
          <span className={fieldLabel}>Beschreibung (optional)</span>
          <textarea
            id="doc-description"
            name="description"
            rows={3}
            defaultValue={doc?.description ?? ''}
            placeholder="Kurz, worum es geht."
            className="mt-2 w-full px-4 py-3 bg-white rounded-md border border-stone-200 text-[16px] text-stone-800 placeholder-stone-400 outline-none focus:border-lake-500 focus:ring-2 focus:ring-lake-500/15 resize-y"
          />
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 items-end">
        <TextField label="Gültig ab (optional)" name="validFrom" type="date" defaultValue={isoDate(doc?.validFrom)} />
        <label className="flex items-center gap-3 cursor-pointer select-none h-12">
          <input
            type="checkbox"
            name="pinned"
            defaultChecked={doc?.pinned ?? false}
            className="w-5 h-5 rounded border-stone-300 text-sand-600 focus:ring-sand-500/30"
          />
          <span className="text-[15px] text-stone-700">Oben anpinnen</span>
        </label>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="primary" icon={<Icon.Check size={16} />}>
          {submitLabel}
        </Button>
        <Link
          href="/admin/dokumente"
          className="inline-flex items-center justify-center h-11 px-5 text-[15px] font-medium rounded-md text-stone-700 hover:bg-stone-100"
        >
          Abbrechen
        </Link>
      </div>
    </form>
  );
}
