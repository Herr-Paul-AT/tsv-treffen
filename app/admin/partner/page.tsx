import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { listAllPartners } from '@/lib/db/queries/partners';

export const dynamic = 'force-dynamic';

export default async function AdminPartnersPage() {
  const items = await listAllPartners();
  const activeCount = items.filter((p) => p.active).length;

  return (
    <main className="px-8 py-6 max-w-[1080px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
            Adminbereich · Verein
          </div>
          <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">
            Sportliche Partner
          </h1>
          <p className="text-[15px] text-stone-600 mt-2 max-w-2xl">
            Partner &amp; Links (z. B. Kärntner Tennisverband, Nachbarvereine, Padel). Aktive
            Einträge erscheinen auf der Startseite im Abschnitt „Sportliche Partner".
          </p>
        </div>
        <Link href="/admin/partner/neu">
          <Button variant="primary" icon={<Icon.Plus size={16} />}>
            Partner anlegen
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
          <div className="font-display text-[36px] text-stone-800 mt-1 leading-none">{items.length}</div>
          <div className="mt-2 text-[13px] font-medium text-lake-700">angelegt</div>
        </div>
      </div>

      <section className="mt-8">
        {items.length === 0 && (
          <div className="bg-white rounded-lg border border-stone-200 px-5 py-10 text-center text-[14px] text-stone-500">
            Noch keine Partner angelegt.
          </div>
        )}
        <div className="grid sm:grid-cols-2 gap-3">
          {items.map((p) => (
            <Link
              key={p.id}
              href={`/admin/partner/${p.id}`}
              className={[
                'bg-white rounded-lg border border-stone-200 p-4 flex items-center gap-4 hover:border-stone-300 hover:shadow-card transition-all',
                p.active ? '' : 'opacity-60',
              ].join(' ')}
            >
              <div className="w-16 h-12 flex-none rounded-md border border-stone-200 bg-paper-50 flex items-center justify-center overflow-hidden">
                {p.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.logoUrl} alt={`Logo ${p.name}`} className="max-h-10 max-w-[56px] object-contain" />
                ) : (
                  <Icon.External size={18} className="text-stone-300" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-display text-[16px] text-stone-800 truncate">{p.name}</span>
                  {!p.active && <Badge tone="neutral">Versteckt</Badge>}
                </div>
                {p.url && <span className="block text-[12.5px] text-stone-500 truncate">{p.url}</span>}
              </div>
              <Icon.Edit size={16} className="text-stone-400 flex-none" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
