import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Icon } from '@/components/ui/Icon';
import type { Faq } from '@/lib/db/schema';

const fieldLabel = 'font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500';

export function FaqForm({
  action,
  faq,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  faq?: Faq;
  submitLabel: string;
}) {
  return (
    <form action={action} className="mt-8 max-w-2xl space-y-5">
      {faq && <input type="hidden" name="id" value={faq.id} />}

      <TextField
        label="Frage"
        name="question"
        required
        defaultValue={faq?.question ?? ''}
        placeholder="z. B. Was passiert im Winter?"
      />

      <div>
        <label htmlFor="faq-answer" className="block">
          <span className={fieldLabel}>Antwort</span>
          <textarea
            id="faq-answer"
            name="answer"
            rows={5}
            required
            defaultValue={faq?.answer ?? ''}
            className="mt-2 w-full px-4 py-3 bg-white rounded-md border border-stone-200 text-[16px] text-stone-800 placeholder-stone-400 outline-none focus:border-lake-500 focus:ring-2 focus:ring-lake-500/15 resize-y leading-[1.6]"
          />
        </label>
      </div>

      <TextField
        label="Reihenfolge (0 = zuerst)"
        name="sortOrder"
        type="number"
        defaultValue={faq ? String(faq.sortOrder) : '0'}
      />

      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          name="active"
          defaultChecked={faq?.active ?? true}
          className="w-5 h-5 rounded border-stone-300 text-lake-700 focus:ring-lake-500/30"
        />
        <span className="text-[15px] text-stone-700">Auf der Startseite anzeigen (aktiv)</span>
      </label>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="primary" icon={<Icon.Check size={16} />}>
          {submitLabel}
        </Button>
        <Link
          href="/admin/faq"
          className="inline-flex items-center justify-center h-11 px-5 text-[15px] font-medium rounded-md text-stone-700 hover:bg-stone-100"
        >
          Abbrechen
        </Link>
      </div>
    </form>
  );
}
