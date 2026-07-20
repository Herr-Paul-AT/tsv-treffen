import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { listAllCourtProgram } from '@/lib/db/queries/court-program';

export const dynamic = 'force-dynamic';

export default async function AdminCourtProgramPage() {
  const entries = await listAllCourtProgram();

  return (
    <main className="px-8 py-6 max-w-[1080px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
            Adminbereich · Verein
          </div>
          <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">
            Was passiert am Platz
          </h1>
          <p className="text-[15px] text-stone-600 mt-2 max-w-2xl">
            Kindertrainings, Jugendspiele, Cups und Trainingszeiten. Aktive Einträge erscheinen auf
            der Startseite im Abschnitt „Was passiert am Platz" — nach Wochentag und Uhrzeit sortiert.
          </p>
        </div>
        <Link href="/admin/platz-programm/neu">
          <Button variant="primary" icon={<Icon.Plus size={16} />}>
            Eintrag anlegen
          </Button>
        </Link>
      </div>

      <section className="mt-8">
        <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
          <div className="hidden sm:grid grid-cols-[70px_150px_minmax(180px,1fr)_150px_130px_44px] gap-3 px-5 py-3 bg-paper-50 border-b border-stone-200 font-mono text-[10.5px] uppercase tracking-[0.16em] text-stone-500">
            <span>Tag</span>
            <span>Zeit</span>
            <span>Gruppe / was</span>
            <span>Trainer</span>
            <span>Platz</span>
            <span />
          </div>
          {entries.length === 0 && (
            <div className="px-5 py-10 text-center text-[14px] text-stone-500">
              Noch keine Einträge. Über „Eintrag anlegen" das erste Training/Cup erfassen.
            </div>
          )}
          {entries.map((e, i) => (
            <Link
              key={e.id}
              href={`/admin/platz-programm/${e.id}`}
              className={[
                'grid grid-cols-[70px_1fr_44px] sm:grid-cols-[70px_150px_minmax(180px,1fr)_150px_130px_44px] gap-x-3 gap-y-1 px-5 py-3.5 items-center',
                'border-b border-stone-100 last:border-b-0 hover:bg-paper-50 transition-colors',
                i % 2 ? '' : 'bg-paper-50/30',
                e.active ? '' : 'opacity-55',
              ].join(' ')}
            >
              <span className="font-display text-[18px] text-stone-800 leading-none">{e.weekday}</span>
              <span className="font-mono text-[12.5px] text-stone-700 hidden sm:block">{e.time}</span>
              <span className="text-[14px] text-stone-800 font-medium truncate">
                {e.title}
                {!e.active && <span className="ml-2 align-middle"><Badge tone="neutral">Versteckt</Badge></span>}
                <span className="sm:hidden block font-mono text-[11.5px] text-stone-500 font-normal mt-0.5">
                  {e.time}{e.court ? ` · ${e.court}` : ''}
                </span>
              </span>
              <span className="text-[13px] text-stone-600 hidden sm:block truncate">{e.trainer ?? '—'}</span>
              <span className="text-[13px] text-stone-600 hidden sm:block truncate">{e.court ?? '—'}</span>
              <span className="text-stone-400 inline-flex justify-end">
                <Icon.Edit size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
