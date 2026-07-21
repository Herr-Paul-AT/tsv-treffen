import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { listAllFaqs } from '@/lib/db/queries/faqs';

export const dynamic = 'force-dynamic';

export default async function AdminFaqPage() {
  const items = await listAllFaqs();

  return (
    <main className="px-8 py-6 max-w-[1080px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
            Adminbereich · Verein
          </div>
          <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">
            Häufige Fragen
          </h1>
          <p className="text-[15px] text-stone-600 mt-2 max-w-2xl">
            Fragen &amp; Antworten, die auf der Startseite im Abschnitt „Häufig gefragt" erscheinen.
          </p>
        </div>
        <Link href="/admin/faq/neu">
          <Button variant="primary" icon={<Icon.Plus size={16} />}>
            Frage anlegen
          </Button>
        </Link>
      </div>

      <section className="mt-8 space-y-3">
        {items.length === 0 && (
          <div className="bg-white rounded-lg border border-stone-200 px-5 py-10 text-center text-[14px] text-stone-500">
            Noch keine Fragen angelegt.
          </div>
        )}
        {items.map((f) => (
          <Link
            key={f.id}
            href={`/admin/faq/${f.id}`}
            className={[
              'block bg-white rounded-lg border border-stone-200 p-4 hover:border-stone-300 hover:shadow-card transition-all',
              f.active ? '' : 'opacity-60',
            ].join(' ')}
          >
            <div className="flex items-start gap-3">
              <span className="font-mono text-[13px] text-stone-400 mt-0.5">{f.sortOrder}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display text-[17px] text-stone-800">{f.question}</span>
                  {!f.active && <Badge tone="neutral">Versteckt</Badge>}
                </div>
                <p className="text-[13.5px] text-stone-600 mt-1 leading-snug line-clamp-2">{f.answer}</p>
              </div>
              <Icon.Edit size={16} className="text-stone-400 flex-none" />
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
