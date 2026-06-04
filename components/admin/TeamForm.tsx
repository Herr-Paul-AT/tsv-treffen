import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Icon } from '@/components/ui/Icon';
import type { Team } from '@/lib/db/schema';

type Option = { id: string; name: string };

const fieldLabel = 'font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500';
const selectClass =
  'mt-2 w-full h-12 px-4 bg-white rounded-md border border-stone-200 text-[16px] text-stone-800 outline-none focus:border-lake-500 focus:ring-2 focus:ring-lake-500/15';

export function TeamForm({
  action,
  team,
  trainerOptions,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  team?: Team;
  trainerOptions: Option[];
  submitLabel: string;
}) {
  return (
    <form action={action} className="mt-6 max-w-2xl space-y-5">
      {team && <input type="hidden" name="id" value={team.id} />}

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="Name" name="name" required defaultValue={team?.name ?? ''} placeholder="z. B. Herren II" />
        <TextField
          label="Liga / Spielklasse"
          name="league"
          required
          defaultValue={team?.league ?? ''}
          placeholder="z. B. Bezirksliga Ost"
        />
      </div>

      <label htmlFor="team-trainer" className="block">
        <span className={fieldLabel}>Trainer / Mannschaftsführer:in</span>
        <select
          id="team-trainer"
          name="trainerId"
          defaultValue={team?.trainerId ?? ''}
          className={selectClass}
        >
          <option value="">— Niemand zugewiesen</option>
          {trainerOptions.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </label>

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="Bilanz (optional)" name="record" defaultValue={team?.record ?? ''} placeholder="z. B. 5:1" />
        <TextField
          label="Sortierung (optional)"
          name="sortOrder"
          type="number"
          min={0}
          defaultValue={team ? String(team.sortOrder) : '0'}
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          name="active"
          defaultChecked={team ? team.active : true}
          className="w-5 h-5 rounded border-stone-300 text-forest-600 focus:ring-forest-500/30"
        />
        <span className="text-[15px] text-stone-700">Saison läuft (aktiv)</span>
      </label>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="primary" icon={<Icon.Check size={16} />}>
          {submitLabel}
        </Button>
        <Link
          href="/admin/mannschaften"
          className="inline-flex items-center justify-center h-11 px-5 text-[15px] font-medium rounded-md text-stone-700 hover:bg-stone-100"
        >
          Abbrechen
        </Link>
      </div>
    </form>
  );
}
