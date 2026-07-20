'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Icon } from '@/components/ui/Icon';
import { MEMBER_CATEGORIES, memberCategoryLabel } from '@/lib/member-categories';
import type { Newsletter } from '@/lib/db/schema';
import type { MailMemberOption } from '@/lib/db/queries/newsletters';

type Option = { id: string; name: string };

const fieldLabel = 'font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500';
const ctrl =
  'mt-2 w-full h-12 px-4 bg-white rounded-md border border-stone-200 text-[16px] text-stone-800 outline-none focus:border-lake-500 focus:ring-2 focus:ring-lake-500/15';

const AUDIENCES = [
  { value: 'all', label: 'Alle Mitglieder' },
  { value: 'active', label: 'Aktive Mitglieder' },
  { value: 'category', label: 'Nach Kategorie' },
  { value: 'sponsors', label: 'Alle Sponsoren' },
  { value: 'team', label: 'Eine Mannschaft' },
  { value: 'custom', label: 'Einzelne Mitglieder' },
];

export function NewsletterComposer({
  action,
  newsletter,
  teamOptions,
  memberOptions,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  newsletter?: Newsletter;
  teamOptions: Option[];
  memberOptions: MailMemberOption[];
  submitLabel: string;
}) {
  const [audience, setAudience] = useState<string>(newsletter?.audience ?? 'all');
  const [selected, setSelected] = useState<Set<string>>(
    new Set((newsletter?.audienceMemberIds ?? '').split(',').map((s) => s.trim()).filter(Boolean)),
  );
  const [filter, setFilter] = useState('');

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return memberOptions;
    return memberOptions.filter(
      (m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q),
    );
  }, [filter, memberOptions]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

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

        {audience === 'category' && (
          <label htmlFor="nl-category" className="block">
            <span className={fieldLabel}>Kategorie</span>
            <select
              id="nl-category"
              name="audienceCategory"
              defaultValue={newsletter?.audienceCategory ?? ''}
              className={ctrl}
            >
              <option value="">— Kategorie wählen</option>
              {MEMBER_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {audience === 'custom' && (
        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className={fieldLabel}>Mitglieder auswählen</span>
            <span className="font-mono text-[11px] text-lake-700">{selected.size} ausgewählt</span>
          </div>
          <div className="mt-3">
            <input
              type="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Name oder E-Mail suchen…"
              className="w-full h-11 px-4 bg-paper-50 rounded-md border border-stone-200 text-[15px] outline-none focus:border-lake-500 focus:ring-2 focus:ring-lake-500/15"
            />
          </div>
          <div className="mt-3 max-h-[320px] overflow-y-auto divide-y divide-stone-100 border border-stone-100 rounded-md">
            {filtered.length === 0 && (
              <div className="px-4 py-6 text-center text-[13.5px] text-stone-500">
                Keine Mitglieder gefunden.
              </div>
            )}
            {filtered.map((m) => (
              <label
                key={m.id}
                className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-paper-50 select-none"
              >
                <input
                  type="checkbox"
                  name="memberIds"
                  value={m.id}
                  checked={selected.has(m.id)}
                  onChange={() => toggle(m.id)}
                  className="w-4 h-4 rounded border-stone-300 text-lake-700 focus:ring-lake-500/30"
                />
                <span className="flex-1 min-w-0">
                  <span className="block text-[14px] text-stone-800 truncate">{m.name}</span>
                  <span className="block text-[12px] text-stone-500 truncate">
                    {m.email}
                    {m.category ? ` · ${memberCategoryLabel(m.category)}` : ''}
                  </span>
                </span>
              </label>
            ))}
          </div>
          <p className="mt-2 text-[12.5px] text-stone-500">
            Nur Mitglieder mit hinterlegter E-Mail-Adresse sind wählbar.
          </p>
        </div>
      )}

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
