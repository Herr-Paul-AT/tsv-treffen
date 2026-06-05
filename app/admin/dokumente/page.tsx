import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { listDocuments, DOC_CATEGORY_LABEL, type DocumentCategory } from '@/lib/db/queries/documents';

export const dynamic = 'force-dynamic';

function typeLabel(fileType: string): string {
  if (fileType === 'application/pdf') return 'PDF';
  if (fileType === 'image') return 'Bild';
  if (fileType.includes('word')) return 'Word';
  if (fileType.includes('excel')) return 'Tabelle';
  return 'Link';
}

const CATEGORY_ORDER: DocumentCategory[] = ['statuten', 'beitraege', 'protokoll', 'spielregeln', 'formular', 'sonstiges'];

export default async function AdminDocumentsPage() {
  const docs = await listDocuments();

  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
            Adminbereich · Dokumente
          </div>
          <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">Dokumente</h1>
          <p className="text-[15px] text-stone-600 mt-2 max-w-xl">
            Vereinsstatuten, Protokolle, Formulare. Was hier liegt, sehen Mitglieder im Profil-Bereich.
          </p>
        </div>
        <Link href="/admin/dokumente/neu">
          <Button variant="primary" icon={<Icon.Plus size={16} />}>
            Dokument hinzufügen
          </Button>
        </Link>
      </div>

      {docs.length === 0 && (
        <div className="mt-8 bg-white border border-dashed border-stone-300 rounded-lg px-5 py-12 text-center">
          <p className="text-[15px] text-stone-600">Noch keine Dokumente.</p>
          <Link
            href="/admin/dokumente/neu"
            className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-medium text-lake-700"
          >
            <Icon.Plus size={15} /> Erstes Dokument hinzufügen
          </Link>
        </div>
      )}

      <div className="mt-8 space-y-6">
        {CATEGORY_ORDER.map((cat) => {
          const items = docs.filter((d) => d.category === cat);
          if (items.length === 0) return null;
          return (
            <section key={cat}>
              <div className="flex items-baseline justify-between mb-3">
                <h2 className="font-display text-[20px] text-stone-800">
                  {DOC_CATEGORY_LABEL[cat]}
                </h2>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-stone-500">
                  {items.length} {items.length === 1 ? 'Eintrag' : 'Einträge'}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((d) => (
                  <article key={d.id} className="bg-white border border-stone-200 rounded-lg p-5 flex flex-col">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-md bg-paper-100 text-stone-700 inline-flex items-center justify-center">
                        <Icon.Document size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-[16px] text-stone-800 leading-tight">{d.title}</h3>
                        <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-500 mt-1">
                          {typeLabel(d.fileType)} · {DOC_CATEGORY_LABEL[d.category]}
                        </div>
                      </div>
                      {d.pinned && <Badge tone="sand" icon={<Icon.Pin size={11} />}>Pin</Badge>}
                    </div>
                    {d.description && (
                      <p className="text-[13px] text-stone-600 mt-3 leading-[1.55]">{d.description}</p>
                    )}
                    <div className="mt-auto pt-4 flex items-center justify-between gap-3 border-t border-stone-100">
                      <Link
                        href={`/admin/dokumente/${d.id}`}
                        className="text-[12.5px] font-medium text-stone-600 inline-flex items-center gap-1 hover:text-stone-800"
                      >
                        <Icon.Edit size={13} /> Bearbeiten
                      </Link>
                      <a
                        href={d.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12.5px] font-medium text-lake-700 inline-flex items-center gap-1"
                      >
                        Öffnen <Icon.External size={12} />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
