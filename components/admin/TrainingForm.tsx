import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Icon } from '@/components/ui/Icon';
import type { Training } from '@/lib/db/schema';

type Option = { id: string; name: string };

const fieldLabel = 'font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500';
const selectClass =
  'mt-2 w-full h-12 px-4 bg-white rounded-md border border-stone-200 text-[16px] text-stone-800 outline-none focus:border-lake-500 focus:ring-2 focus:ring-lake-500/15';

function toLocalInput(d: Date | null | undefined): string {
  if (!d) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes(),
  )}`;
}

export function TrainingForm({
  action,
  training,
  teamOptions,
  trainerOptions,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  training?: Training;
  teamOptions: Option[];
  trainerOptions: Option[];
  submitLabel: string;
}) {
  return (
    <form action={action} className="mt-8 max-w-2xl space-y-5">
      {training && <input type="hidden" name="id" value={training.id} />}

      <TextField
        label="Titel"
        name="title"
        required
        defaultValue={training?.title ?? ''}
        placeholder="z. B. Mannschaftstraining Herren II"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <label htmlFor="t-team" className="block">
          <span className={fieldLabel}>Mannschaft</span>
          <select id="t-team" name="teamId" defaultValue={training?.teamId ?? ''} className={selectClass}>
            <option value="">— Offen / keine Mannschaft</option>
            {teamOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="t-trainer" className="block">
          <span className={fieldLabel}>Trainer</span>
          <select
            id="t-trainer"
            name="trainerId"
            defaultValue={training?.trainerId ?? ''}
            className={selectClass}
          >
            <option value="">— Kein Trainer zugewiesen</option>
            {trainerOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField
          label="Beginn"
          name="startsAt"
          type="datetime-local"
          required
          defaultValue={toLocalInput(training?.startsAt)}
        />
        <TextField
          label="Ende"
          name="endsAt"
          type="datetime-local"
          required
          defaultValue={toLocalInput(training?.endsAt)}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="Platz (optional)" name="court" defaultValue={training?.court ?? ''} placeholder="z. B. Platz 1 & 2" />
        <TextField
          label="Max. Teilnehmer (optional)"
          name="maxAttendees"
          type="number"
          min={1}
          defaultValue={training?.maxAttendees != null ? String(training.maxAttendees) : ''}
          placeholder="z. B. 8"
        />
      </div>

      <div className="rounded-lg border border-stone-200 bg-paper-50/60 p-4 space-y-3">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            name="cancelled"
            defaultChecked={training?.cancelled ?? false}
            className="w-5 h-5 rounded border-stone-300 text-danger focus:ring-danger/30"
          />
          <span className="text-[15px] text-stone-700 font-medium">Training absagen</span>
        </label>
        <TextField
          label="Grund der Absage (optional)"
          name="cancelReason"
          defaultValue={training?.cancelReason ?? ''}
          placeholder="z. B. Dauerregen / Platz gesperrt"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="primary" icon={<Icon.Check size={16} />}>
          {submitLabel}
        </Button>
        <Link
          href="/admin/trainings"
          className="inline-flex items-center justify-center h-11 px-5 text-[15px] font-medium rounded-md text-stone-700 hover:bg-stone-100"
        >
          Abbrechen
        </Link>
      </div>
    </form>
  );
}
