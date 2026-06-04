'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { parseMembersCsv } from '@/lib/members-csv';

const EXAMPLE = `Vorname,Nachname,E-Mail,Telefon,Rolle,Status,Geburtsdatum,LK
Anna,Berger,anna.berger@example.at,+43 660 1234567,Mitglied,Aktiv,14.03.1990,12.5
Bernd,Huber,bernd.huber@example.at,,Trainer,Aktiv,02.11.1978,8.0
Carla,Steiner,carla.steiner@example.at,,Mitglied,Probe,,`;

const ROLE_LABEL: Record<string, string> = {
  member: 'Mitglied',
  trainer: 'Trainer',
  jugendleiter: 'Jugendleiter',
  obmann: 'Obmann',
  admin: 'Admin',
};
const STATUS_LABEL: Record<string, string> = {
  active: 'Aktiv',
  probe: 'Probe',
  paused: 'Pausiert',
  inactive: 'Inaktiv',
};

export function MemberImportClient({
  action,
}: {
  action: (formData: FormData) => void | Promise<void>;
}) {
  const [text, setText] = useState('');
  const result = useMemo(() => parseMembersCsv(text), [text]);
  const hasInput = text.trim().length > 0;

  return (
    <div className="mt-8 grid lg:grid-cols-[1fr_1fr] gap-8 items-start">
      <div>
        <h2 className="font-display text-[20px] text-stone-800">1 · Daten einfügen</h2>
        <p className="text-[14px] text-stone-600 mt-1.5">
          CSV einfügen — eine Zeile pro Person. Erlaubte Trennzeichen: Komma, Semikolon oder Tab.
          Eine Kopfzeile mit Spaltennamen (Vorname, Nachname, E-Mail …) wird automatisch erkannt.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
          placeholder={'Vorname,Nachname,E-Mail,Telefon,Rolle,Status\n…'}
          className="mt-4 w-full px-4 py-3 bg-white rounded-md border border-stone-200 font-mono text-[13px] text-stone-800 placeholder-stone-400 outline-none focus:border-lake-500 focus:ring-2 focus:ring-lake-500/15 resize-y"
        />
        <button
          type="button"
          onClick={() => setText(EXAMPLE)}
          className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-lake-700 hover:text-lake-800"
        >
          <Icon.Download size={14} /> Beispiel-Vorlage einfügen
        </button>
      </div>

      <div>
        <h2 className="font-display text-[20px] text-stone-800">2 · Vorschau &amp; Import</h2>
        {!hasInput && (
          <div className="mt-4 bg-white border border-dashed border-stone-300 rounded-lg px-5 py-10 text-center text-[14px] text-stone-500">
            Sobald du Daten einfügst, erscheint hier die Vorschau.
          </div>
        )}

        {hasInput && (
          <>
            <div className="mt-4 flex items-center gap-4 text-[13px]">
              <span className="inline-flex items-center gap-1.5 text-forest-700 font-medium">
                <Icon.Check size={15} /> {result.validCount} gültig
              </span>
              {result.errorCount > 0 && (
                <span className="inline-flex items-center gap-1.5 text-danger font-medium">
                  <Icon.Info size={15} /> {result.errorCount} mit Fehler
                </span>
              )}
              <span className="text-stone-500">· {result.rows.length} Zeilen gesamt</span>
            </div>

            <div className="mt-3 bg-white rounded-lg border border-stone-200 overflow-hidden max-h-[360px] overflow-y-auto">
              {result.rows.map((r) => (
                <div
                  key={r.line}
                  className={[
                    'flex items-center gap-3 px-4 py-2.5 border-b border-stone-100 last:border-b-0',
                    r.valid ? '' : 'bg-danger/5',
                  ].join(' ')}
                >
                  <span className="w-6 flex-none">
                    {r.valid ? (
                      <Icon.Check size={15} className="text-forest-600" />
                    ) : (
                      <Icon.Info size={15} className="text-danger" />
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] text-stone-800 truncate">
                      {r.firstName || '—'} {r.lastName} <span className="text-stone-400">·</span>{' '}
                      <span className="font-mono text-[12px] text-stone-500">{r.email || 'keine E-Mail'}</span>
                    </div>
                    {(r.street || r.city) && (
                      <div className="text-[11.5px] text-stone-400 truncate mt-0.5">
                        {[r.street, [r.postalCode, r.city].filter(Boolean).join(' ')].filter(Boolean).join(', ')}
                      </div>
                    )}
                    {r.issues.length > 0 && (
                      <div className="text-[12px] text-danger mt-0.5">{r.issues.join(' · ')}</div>
                    )}
                  </div>
                  <Badge tone="neutral">{ROLE_LABEL[r.role]}</Badge>
                  <Badge tone={r.status === 'active' ? 'lake' : 'sand'}>{STATUS_LABEL[r.status]}</Badge>
                </div>
              ))}
            </div>

            <form action={action} className="mt-5">
              <input type="hidden" name="csv" value={text} />
              <Button
                type="submit"
                variant="primary"
                icon={<Icon.Upload size={16} />}
                disabled={result.validCount === 0}
              >
                {result.validCount} {result.validCount === 1 ? 'Mitglied' : 'Mitglieder'} importieren
              </Button>
              {result.errorCount > 0 && (
                <p className="text-[12.5px] text-stone-500 mt-2">
                  Fehlerhafte Zeilen und Dubletten werden beim Import automatisch übersprungen.
                </p>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
