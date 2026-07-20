import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Icon } from '@/components/ui/Icon';
import { WEEKDAYS } from '@/lib/weekdays';
import type { CourtProgramEntry } from '@/lib/db/schema';

const fieldLabel = 'font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500';

export function CourtProgramForm({
  action,
  entry,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  entry?: CourtProgramEntry;
  submitLabel: string;
}) {
  return (
    <form action={action} className="mt-8 max-w-2xl space-y-5">
      {entry && <input type="hidden" name="id" value={entry.id} />}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cp-weekday" className="block">
            <span className={fieldLabel}>Wochentag</span>
            <select
              id="cp-weekday"
              name="weekday"
              defaultValue={entry?.weekday ?? 'Mo'}
              className="mt-2 w-full h-12 px-4 bg-white rounded-md border border-stone-200 text-[16px] text-stone-800 outline-none focus:border-lake-500 focus:ring-2 focus:ring-lake-500/15"
            >
              {WEEKDAYS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <TextField
          label="Zeit"
          name="time"
          required
          defaultValue={entry?.time ?? ''}
          placeholder="z. B. 17:00 – 18:30"
        />
      </div>

      <TextField
        label="Was passiert / Gruppe"
        name="title"
        required
        defaultValue={entry?.title ?? ''}
        placeholder="z. B. Kindertraining U10, Jugendspiel, Cup …"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField
          label="Trainer / Betreuung (optional)"
          name="trainer"
          defaultValue={entry?.trainer ?? ''}
          placeholder="z. B. M. Pirker"
        />
        <TextField
          label="Platz (optional)"
          name="court"
          defaultValue={entry?.court ?? ''}
          placeholder="z. B. Platz 2 & 3"
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          name="active"
          defaultChecked={entry?.active ?? true}
          className="w-5 h-5 rounded border-stone-300 text-lake-700 focus:ring-lake-500/30"
        />
        <span className="text-[15px] text-stone-700">Auf der Startseite anzeigen (aktiv)</span>
      </label>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="primary" icon={<Icon.Check size={16} />}>
          {submitLabel}
        </Button>
        <Link
          href="/admin/platz-programm"
          className="inline-flex items-center justify-center h-11 px-5 text-[15px] font-medium rounded-md text-stone-700 hover:bg-stone-100"
        >
          Abbrechen
        </Link>
      </div>
    </form>
  );
}
