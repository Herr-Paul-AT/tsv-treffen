import { AvatarGroup } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { listTeamsWithRoster } from '@/lib/db/queries/teams';

export const dynamic = 'force-dynamic';

export default async function AdminTeamsPage() {
  const teams = await listTeamsWithRoster();
  const adultTeams = teams.filter((t) => !/^Jugend/.test(t.name));
  const youthTeams = teams.filter((t) => /^Jugend/.test(t.name));

  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
            Adminbereich
          </div>
          <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">
            Mannschaften
          </h1>
          <p className="text-[15px] text-stone-600 mt-2 max-w-xl">
            {teams.length} Teams in {new Date().getFullYear()} — {adultTeams.length} Erwachsene,{' '}
            {youthTeams.length} Jugend. Mannschaftsführer:innen verwalten Aufstellung und Anwesenheit
            für ihre Mannschaft.
          </p>
        </div>
        <Button variant="primary" icon={<Icon.Plus size={16} />}>
          Mannschaft anlegen
        </Button>
      </div>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((t) => {
          const isYouth = /^Jugend/.test(t.name);
          return (
            <article
              key={t.id}
              className="bg-white rounded-lg border border-stone-200 p-5 flex flex-col"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-display text-[22px] text-stone-800 leading-tight">{t.name}</h2>
                  <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500 mt-1">
                    {t.league}
                  </div>
                </div>
                {t.active && !isYouth && <Badge tone="forest">Saison läuft</Badge>}
                {isYouth && <Badge tone="neutral">Nachwuchs</Badge>}
                {!t.active && <Badge tone="dark">Inaktiv</Badge>}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-[13px]">
                <div>
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-500">
                    Trainer
                  </div>
                  <div className="text-stone-800 font-medium mt-0.5">
                    {t.trainerName ?? '—'}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-500">
                    Spieler
                  </div>
                  <div className="text-stone-800 font-medium mt-0.5">{t.roster.length}</div>
                </div>
                {t.record && (
                  <div>
                    <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-500">
                      Bilanz
                    </div>
                    <div className="font-display text-[18px] text-stone-800 leading-tight mt-0.5">
                      {t.record}
                    </div>
                  </div>
                )}
                {t.nextEventLabel && (
                  <div>
                    <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-500">
                      Nächster Termin
                    </div>
                    <div className="text-stone-700 text-[12.5px] mt-0.5 leading-snug">
                      {t.nextEventLabel}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-4 flex items-center justify-between border-t border-stone-100">
                {t.roster.length > 0 ? (
                  <AvatarGroup
                    items={t.roster.map((r) => ({ initials: r.initials, tone: r.tone }))}
                    max={4}
                    size={28}
                  />
                ) : (
                  <span className="text-[12.5px] text-stone-500">Noch keine Spieler:innen</span>
                )}
                <button
                  type="button"
                  className="text-[12.5px] font-medium text-lake-700 inline-flex items-center gap-1"
                >
                  Kader öffnen <Icon.ChevronRight size={14} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
