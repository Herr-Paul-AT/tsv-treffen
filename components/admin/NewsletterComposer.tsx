'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Icon } from '@/components/ui/Icon';
import type { Newsletter } from '@/lib/db/schema';

type Option = { id: string; name: string };

const fieldLabel = 'font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500';
const ctrl =
  'mt-2 w-full h-12 px-4 bg-white rounded-md border border-stone-200 text-[16px] text-stone-800 outline-none focus:border-lake-500 focus:ring-2 focus:ring-lake-500/15';

const AUDIENCES = [
  { value: 'active', label: 'Aktive Mitglieder' },
  { value: 'all', label: 'Alle Mitglieder' },
  { value: 'probe', label: 'Probemitglieder' },
  { value: 'team', label: 'Eine Mannschaft' },
];

export function NewsletterComposer({
  action,
  newsletter,
  teamOptions,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  newsletter?: Newsletter;
  teamOptions: Option[];
  submitLabel: string;
}) {
  const [audience, setAudience] = useState<string>(newsletter?.audience ?? 'active');

  return (
    <form action={action} className="mt-6 max-w-2xl space-y-5">
      {newsletter && <input type="hidden" name="id" value={newsletter.id} />}

      <div className="grid sm:grid-cols-2 gap-4">
        <label htmlFor="nl-audience" className="block">
          <span className={fieldLabel}>Empfänger</span>
          <select
            id="nl-audience"
            name="audience"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className={ctrl}
          >
            {AUDIENCES.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </label>
        {audience === 'team' && (
          <label htmlFor="nl-team" className="block">
            <span className={fieldLabel}>Mannschaft</span>
            <select
              id="nl-team"
              name="audienceTeamId"
              defaultValue={newsletter?.audienceTeamId ?? ''}
              className={ctrl}
            >
              <option value="">— Mannschaft wählen</option>
              {teamOptions.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <TextField
        label="Betreff"
        name="subject"
        required
        defaultValue={newsletter?.subject ?? ''}
        placeholder="z. B. Erinnerung: Saisonstart am 12. April"
      />

      <div>
        <label htmlFor="nl-body" className="block">
          <span className={fieldLabel}>Inhalt</span>
          <textarea
            id="nl-body"
            name="body"
            rows={10}
            required
            defaultValue={newsletter?.body ?? ''}
            placeholder={'Liebe Mitglieder,\n\n…\n\nSportliche Grüße\nDer Vorstand'}
            className="mt-2 w-full px-4 py-3 bg-white rounded-md border border-stone-200 text-[16px] text-stone-800 placeholder-stone-400 outline-none focus:border-lake-500 focus:ring-2 focus:ring-lake-500/15 resize-y leading-[1.6]"
          />
        </label>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <Button type="submit" variant="primary" icon={<Icon.Check size={16} />}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
