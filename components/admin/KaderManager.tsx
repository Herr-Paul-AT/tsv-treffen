'use client';

import { Avatar, type AvatarTone } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

type RosterEntry = {
  memberId: string;
  name: string;
  initials: string;
  tone: AvatarTone;
  role: 'player' | 'captain' | 'reserve';
  lkRating: string | null;
};

const ROLE_OPTIONS = [
  { value: 'captain', label: 'Kapitän' },
  { value: 'player', label: 'Spieler:in' },
  { value: 'reserve', label: 'Reserve' },
];

const roleSelectClass =
  'h-9 px-2.5 rounded-md border border-stone-200 bg-white text-[13px] text-stone-700 outline-none focus:border-lake-500';

export function KaderManager({
  teamId,
  roster,
  available,
  addAction,
  roleAction,
  removeAction,
}: {
  teamId: string;
  roster: RosterEntry[];
  available: { id: string; name: string }[];
  addAction: (formData: FormData) => void | Promise<void>;
  roleAction: (formData: FormData) => void | Promise<void>;
  removeAction: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <div className="bg-white rounded-lg border border-stone-200 p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-[20px] text-stone-800">Kader</h2>
        <span className="font-mono text-[11px] text-stone-500 uppercase tracking-[0.14em]">
          {roster.length} {roster.length === 1 ? 'Person' : 'Personen'}
        </span>
      </div>

      {/* Mitglied hinzufügen */}
      <form action={addAction} className="mt-4 flex flex-wrap items-end gap-2.5 pb-5 border-b border-stone-100">
        <input type="hidden" name="teamId" value={teamId} />
        <label className="flex-1 min-w-[200px]">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-stone-500">
            Mitglied hinzufügen
          </span>
          <select
            name="memberId"
            required
            defaultValue=""
            className="mt-1.5 w-full h-11 px-3 rounded-md border border-stone-200 bg-white text-[15px] text-stone-800 outline-none focus:border-lake-500"
          >
            <option value="" disabled>
              {available.length ? 'Mitglied wählen…' : 'Alle Mitglieder bereits im Team'}
            </option>
            {available.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
        <select name="role" defaultValue="player" className="h-11 px-3 rounded-md border border-stone-200 bg-white text-[15px] text-stone-700 outline-none focus:border-lake-500">
          {ROLE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Button type="submit" variant="secondary" size="md" icon={<Icon.Plus size={16} />} disabled={available.length === 0}>
          Hinzufügen
        </Button>
      </form>

      {/* Kaderliste */}
      <div className="mt-4 space-y-2">
        {roster.length === 0 && (
          <p className="text-[13.5px] text-stone-500 py-2">Noch keine Spieler:innen im Kader.</p>
        )}
        {roster.map((m) => (
          <div key={m.memberId} className="flex items-center gap-3 py-1.5">
            <Avatar initials={m.initials} size={36} tone={m.tone} />
            <div className="flex-1 min-w-0">
              <div className="text-[14.5px] font-medium text-stone-800 truncate">{m.name}</div>
              <div className="font-mono text-[11px] text-stone-500">LK {m.lkRating ?? '—'}</div>
            </div>

            <form action={roleAction}>
              <input type="hidden" name="teamId" value={teamId} />
              <input type="hidden" name="memberId" value={m.memberId} />
              <select
                name="role"
                defaultValue={m.role}
                className={roleSelectClass}
                onChange={(e) => e.currentTarget.form?.requestSubmit()}
              >
                {ROLE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </form>

            <form
              action={removeAction}
              onSubmit={(e) => {
                if (!window.confirm(`${m.name} aus dem Kader entfernen?`)) e.preventDefault();
              }}
            >
              <input type="hidden" name="teamId" value={teamId} />
              <input type="hidden" name="memberId" value={m.memberId} />
              <button
                type="submit"
                aria-label={`${m.name} entfernen`}
                className="w-9 h-9 inline-flex items-center justify-center rounded-md text-stone-400 hover:text-danger hover:bg-danger/5"
              >
                <Icon.Trash size={16} />
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
