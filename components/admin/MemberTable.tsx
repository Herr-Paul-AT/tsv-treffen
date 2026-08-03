'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Avatar, type AvatarTone } from '@/components/ui/Avatar';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import type { MemberRow } from '@/lib/db/queries/members';
import { memberCategoryLabel } from '@/lib/member-categories';
import type { Member } from '@/lib/db/schema';

const STATUS_LABEL: Record<Member['status'], string> = {
  active: 'Aktiv',
  paused: 'Pausiert',
  probe: 'Probe',
  inactive: 'Inaktiv',
};
const STATUS_TONE: Record<Member['status'], BadgeTone> = {
  active: 'lake',
  paused: 'neutral',
  probe: 'sand',
  inactive: 'dark',
};
const DUES_LABEL: Record<Member['paymentStatus'], string> = {
  paid: 'Bezahlt',
  open: 'Offen',
  partial: 'Anteilig',
  waived: 'Erlassen',
};
const DUES_TONE: Record<Member['paymentStatus'], BadgeTone> = {
  paid: 'forest',
  open: 'danger',
  partial: 'warn',
  waived: 'dark',
};

const COLS = 'grid grid-cols-[36px_minmax(180px,1fr)_130px_110px_70px_110px_36px] gap-3';

export function MemberTable({
  rows,
  action,
  hasFilter,
}: {
  rows: MemberRow[];
  action: (formData: FormData) => void | Promise<void>;
  hasFilter: boolean;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));
  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.id)));
  }

  return (
    <div className="mt-4">
      {selected.size > 0 && (
        <form
          action={action}
          onSubmit={(e) => {
            if (!window.confirm(`${selected.size} markierte Mitglied(er) wirklich löschen? Das kann nicht rückgängig gemacht werden.`)) {
              e.preventDefault();
            }
          }}
          className="mb-3 flex items-center justify-between gap-3 rounded-lg bg-stone-800 text-paper-50 px-4 py-3"
        >
          {[...selected].map((id) => (
            <input key={id} type="hidden" name="memberIds" value={id} />
          ))}
          <span className="text-[14px] font-medium">{selected.size} markiert</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="text-[13px] text-paper-100/70 hover:text-paper-50 px-2"
            >
              Aufheben
            </button>
            <Button type="submit" variant="destructive" size="sm" icon={<Icon.Trash size={14} />}>
              Löschen
            </Button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
        <div className={`${COLS} px-5 py-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-500 bg-paper-50 border-b border-stone-200 items-center`}>
          <input
            type="checkbox"
            aria-label="Alle markieren"
            checked={allSelected}
            onChange={toggleAll}
            className="w-4 h-4 rounded border-stone-300 text-lake-700 focus:ring-lake-500/30"
          />
          <span>Name · E-Mail</span>
          <span>Mannschaft</span>
          <span>Status</span>
          <span>LK</span>
          <span>Beitrag</span>
          <span />
        </div>

        {rows.length === 0 && (
          <div className="px-5 py-10 text-center text-[14px] text-stone-500">
            Keine Mitglieder gefunden{hasFilter ? ' — Filter anpassen oder zurücksetzen.' : '.'}
          </div>
        )}

        {rows.map((r, i) => (
          <div
            key={r.id}
            className={[
              COLS,
              'px-5 py-3 items-center border-b border-stone-100 last:border-b-0',
              selected.has(r.id) ? 'bg-lake-50' : i % 2 ? '' : 'bg-paper-50/40',
            ].join(' ')}
          >
            <input
              type="checkbox"
              aria-label={`${r.firstName} ${r.lastName} markieren`}
              checked={selected.has(r.id)}
              onChange={() => toggle(r.id)}
              className="w-4 h-4 rounded border-stone-300 text-lake-700 focus:ring-lake-500/30"
            />
            <Link href={`/admin/mitglieder/${r.id}`} className="flex items-center gap-3 min-w-0 hover:opacity-80">
              <Avatar initials={r.initials} size={34} tone={r.avatarTone as AvatarTone} />
              <div className="min-w-0">
                <div className="text-[14px] font-medium text-stone-800 leading-tight truncate">
                  {r.firstName} {r.lastName}
                </div>
                <div className="font-mono text-[11px] text-stone-500 truncate">
                  {r.email ?? '—'}
                  {r.category ? ` · ${memberCategoryLabel(r.category)}` : ''}
                </div>
              </div>
            </Link>
            <span className="text-[13.5px] text-stone-700 truncate">{r.teamName ?? '—'}</span>
            <Badge tone={STATUS_TONE[r.status]}>{STATUS_LABEL[r.status]}</Badge>
            <span className="font-mono text-[12.5px] text-stone-700">{r.lkRating ?? '—'}</span>
            <Badge tone={DUES_TONE[r.paymentStatus]}>{DUES_LABEL[r.paymentStatus]}</Badge>
            <Link href={`/admin/mitglieder/${r.id}`} className="text-stone-400 hover:text-stone-700 inline-flex justify-end">
              <Icon.Edit size={16} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
