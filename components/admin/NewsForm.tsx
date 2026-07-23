import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Icon } from '@/components/ui/Icon';
import type { News } from '@/lib/db/schema';

const fieldLabel = 'font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500';
const selectClass =
  'mt-2 w-full h-12 px-4 bg-white rounded-md border border-stone-200 text-[16px] text-stone-800 outline-none focus:border-lake-500 focus:ring-2 focus:ring-lake-500/15';
const areaClass =
  'mt-2 w-full px-4 py-3 bg-white rounded-md border border-stone-200 text-[16px] text-stone-800 placeholder-stone-400 outline-none focus:border-lake-500 focus:ring-2 focus:ring-lake-500/15 resize-y';

export function NewsForm({
  action,
  article,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  article?: News;
  submitLabel: string;
}) {
  return (
    <form action={action} className="mt-8 max-w-2xl space-y-5" encType="multipart/form-data">
      {article && <input type="hidden" name="id" value={article.id} />}
      {article?.attachmentUrl && (
        <input type="hidden" name="currentAttachmentUrl" value={article.attachmentUrl} />
      )}
      {article?.attachmentName && (
        <input type="hidden" name="currentAttachmentName" value={article.attachmentName} />
      )}

      <TextField label="Titel" name="title" required defaultValue={article?.title ?? ''} placeholder="z. B. Saisonstart 2026" />

      <TextField
        label="Eyebrow / Kategorie (optional)"
        name="eyebrow"
        defaultValue={article?.eyebrow ?? ''}
        placeholder="z. B. Saisoneröffnung"
      />

      <div>
        <label htmlFor="n-excerpt" className="block">
          <span className={fieldLabel}>Kurztext (Vorschau in Listen)</span>
          <textarea
            id="n-excerpt"
            name="excerpt"
            rows={2}
            required
            defaultValue={article?.excerpt ?? ''}
            placeholder="Ein bis zwei Sätze, die neugierig machen."
            className={areaClass}
          />
        </label>
      </div>

      <div>
        <label htmlFor="n-body" className="block">
          <span className={fieldLabel}>Beitragstext</span>
          <textarea
            id="n-body"
            name="body"
            rows={10}
            required
            defaultValue={article?.body ?? ''}
            placeholder={'Der vollständige Beitrag. Leerzeile = neuer Absatz.'}
            className={areaClass}
          />
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <label htmlFor="n-image" className="block">
          <span className={fieldLabel}>Titelbild-Stil</span>
          <select id="n-image" name="imageKind" defaultValue={article?.imageKind ?? 'none'} className={selectClass}>
            <option value="none">Ohne Bild</option>
            <option value="lake">See (Blau)</option>
            <option value="sand">Sand (Warm)</option>
            <option value="forest">Wald (Grün)</option>
          </select>
        </label>
        <label htmlFor="n-visibility" className="block">
          <span className={fieldLabel}>Sichtbarkeit</span>
          <select
            id="n-visibility"
            name="visibility"
            defaultValue={article?.visibility ?? 'public'}
            className={selectClass}
          >
            <option value="public">Öffentlich (auch auf der Startseite)</option>
            <option value="internal">Intern (nur Mitgliederbereich)</option>
          </select>
        </label>
      </div>

      <div className="rounded-lg border border-stone-200 bg-paper-50/60 p-4 space-y-3">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            name="published"
            defaultChecked={article ? article.publishedAt != null : false}
            className="w-5 h-5 rounded border-stone-300 text-forest-600 focus:ring-forest-500/30"
          />
          <span className="text-[15px] text-stone-700 font-medium">Veröffentlichen</span>
          <span className="text-[13px] text-stone-500">— ohne Haken bleibt es ein Entwurf</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            name="pinned"
            defaultChecked={article?.pinned ?? false}
            className="w-5 h-5 rounded border-stone-300 text-sand-600 focus:ring-sand-500/30"
          />
          <span className="text-[15px] text-stone-700 font-medium">Oben anpinnen</span>
        </label>
      </div>

      <div>
        <span className={fieldLabel}>Flyer / Anhang (optional)</span>
        {article?.attachmentUrl && (
          <a
            href={article.attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-lake-700"
          >
            <Icon.Document size={14} /> {article.attachmentName ?? 'Aktueller Anhang'}
          </a>
        )}
        <input
          type="file"
          name="attachment"
          accept="image/png,image/jpeg,image/webp,application/pdf"
          className="mt-2 block w-full text-[14px] text-stone-700 file:mr-4 file:h-11 file:px-4 file:rounded-md file:border-0 file:bg-stone-800 file:text-paper-50 file:text-[14px] file:font-medium hover:file:bg-stone-700 file:cursor-pointer"
        />
        <p className="mt-1.5 text-[12.5px] text-stone-500">
          Bild oder PDF, max. 5 MB.{article ? ' Leer lassen, um den aktuellen Anhang zu behalten.' : ''}
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="primary" icon={<Icon.Check size={16} />}>
          {submitLabel}
        </Button>
        <Link
          href="/admin/news"
          className="inline-flex items-center justify-center h-11 px-5 text-[15px] font-medium rounded-md text-stone-700 hover:bg-stone-100"
        >
          Abbrechen
        </Link>
      </div>
    </form>
  );
}
