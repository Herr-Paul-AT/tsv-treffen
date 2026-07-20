import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { listAllMembershipPlans } from '@/lib/db/queries/membership-plans';

export const dynamic = 'force-dynamic';

function eur(cents: number) {
  return new Intl.NumberFormat('de-AT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export default async function AdminMembershipPlansPage() {
  const plans = await listAllMembershipPlans();
  const activeCount = plans.filter((p) => p.active).length;

  const STATS = [
    { l: 'Pakete', v: String(plans.length), s: 'gesamt angelegt', tone: 'text-lake-700' },
    { l: 'Sichtbar', v: String(activeCount), s: 'auf der Startseite', tone: 'text-forest-700' },
    {
      l: 'Hervorgehoben',
      v: String(plans.filter((p) => p.featured).length),
      s: '„Beliebteste"-Karte',
      tone: 'text-sand-700',
    },
  ];

  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
            Adminbereich · Mitgliedschaft
          </div>
          <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">
            Tarife &amp; Mitgliedspakete
          </h1>
          <p className="text-[15px] text-stone-600 mt-2 max-w-2xl">
            Preise und Leistungen der Mitgliedspakete. Änderungen erscheinen sofort auf der
            Startseite im Abschnitt „Mitglied werden".
          </p>
        </div>
        <Link href="/admin/tarife/neu">
          <Button variant="primary" icon={<Icon.Plus size={16} />}>
            Paket anlegen
          </Button>
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 gap-3">
        {STATS.map((t) => (
          <div key={t.l} className="bg-white rounded-lg border border-stone-200 p-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">{t.l}</div>
            <div className="font-display text-[36px] text-stone-800 mt-1 leading-none">{t.v}</div>
            <div className={`mt-2 text-[13px] font-medium ${t.tone}`}>{t.s}</div>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="font-display text-[22px] text-stone-800">Alle Pakete</h2>
        <div className="mt-4 bg-white rounded-lg border border-stone-200 overflow-hidden">
          <div className="grid grid-cols-[48px_minmax(180px,1fr)_130px_150px_44px] gap-3 px-5 py-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-500 bg-paper-50 border-b border-stone-200">
            <span>#</span>
            <span>Paket</span>
            <span>Preis</span>
            <span>Status</span>
            <span />
          </div>
          {plans.length === 0 && (
            <div className="px-5 py-8 text-center text-[14px] text-stone-500">
              Noch keine Pakete angelegt.
            </div>
          )}
          {plans.map((p, i) => (
            <Link
              key={p.id}
              href={`/admin/tarife/${p.id}`}
              className={[
                'grid grid-cols-[48px_minmax(180px,1fr)_130px_150px_44px] gap-3 px-5 py-3.5 items-center',
                i % 2 ? '' : 'bg-paper-50/40',
                'border-b border-stone-100 last:border-b-0 hover:bg-paper-50 transition-colors',
                p.active ? '' : 'opacity-60',
              ].join(' ')}
            >
              <span className="font-mono text-[13px] text-stone-500">{p.sortOrder}</span>
              <span className="min-w-0">
                <span className="block text-[14.5px] font-medium text-stone-800 truncate">
                  {p.name}
                  {p.featured && <span className="ml-2 align-middle"><Badge tone="sand">Beliebteste</Badge></span>}
                </span>
                {p.eyebrow && (
                  <span className="block text-[12.5px] text-stone-500 truncate">{p.eyebrow}</span>
                )}
              </span>
              <span className="font-display text-[18px] text-stone-800">{eur(p.priceCents)}</span>
              <span>
                {p.active ? (
                  <Badge tone="forest">Sichtbar</Badge>
                ) : (
                  <Badge tone="neutral">Versteckt</Badge>
                )}
              </span>
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
