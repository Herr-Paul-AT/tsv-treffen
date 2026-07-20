import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { listAllSponsors } from '@/lib/db/queries/sponsors';

export const dynamic = 'force-dynamic';

export default async function AdminSponsorsPage() {
  const sponsors = await listAllSponsors();
  const activeCount = sponsors.filter((s) => s.active).length;

  return (
    <main className="px-8 py-6 max-w-[1080px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
            Adminbereich · Verein
          </div>
          <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">Sponsoren</h1>
          <p className="text-[15px] text-stone-600 mt-2 max-w-2xl">
            Logo und Link jedes Sponsors pflegen. Aktive Sponsoren erscheinen unten auf der
            Startseite in Kacheln — in der eingestellten Reihenfolge.
          </p>
        </div>
        <Link href="/admin/sponsoren/neu">
          <Button variant="primary" icon={<Icon.Plus size={16} />}>
            Sponsor anlegen
          </Button>
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 max-w-md">
        <div className="bg-white rounded-lg border border-stone-200 p-5">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">Aktiv</div>
          <div className="font-display text-[36px] text-stone-800 mt-1 leading-none">{activeCount}</div>
          <div className="mt-2 text-[13px] font-medium text-forest-700">auf der Startseite</div>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-5">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">Gesamt</div>
          <div className="font-display text-[36px] text-stone-800 mt-1 leading-none">{sponsors.length}</div>
          <div className="mt-2 text-[13px] font-medium text-lake-700">angelegt</div>
        </div>
      </div>

      <section className="mt-8">
        {sponsors.length === 0 && (
          <div className="bg-white rounded-lg border border-stone-200 px-5 py-10 text-center text-[14px] text-stone-500">
            Noch keine Sponsoren angelegt.
          </div>
        )}
        <div className="grid sm:grid-cols-2 gap-3">
          {sponsors.map((s) => (
            <Link
              key={s.id}
              href={`/admin/sponsoren/${s.id}`}
              className={[
                'bg-white rounded-lg border border-stone-200 p-4 flex items-center gap-4 hover:border-stone-300 hover:shadow-card transition-all',
                s.active ? '' : 'opacity-60',
              ].join(' ')}
            >
              <div className="w-20 h-14 flex-none rounded-md border border-stone-200 bg-paper-50 flex items-center justify-center overflow-hidden">
                {s.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.logoUrl} alt={`Logo ${s.name}`} className="max-h-12 max-w-[72px] object-contain" />
                ) : (
                  <Icon.Upload size={20} className="text-stone-300" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-display text-[16px] text-stone-800 truncate">{s.name}</span>
                  {!s.active && <Badge tone="neutral">Versteckt</Badge>}
                </div>
                {s.website && (
                  <span className="block text-[12.5px] text-stone-500 truncate">{s.website}</span>
                )}
              </div>
              <Icon.Edit size={16} className="text-stone-400 flex-none" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
