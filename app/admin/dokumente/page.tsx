import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { listDocuments, DOC_CATEGORY_LABEL, type DocumentCategory } from '@/lib/db/queries/documents';

export const dynamic = 'force-dynamic';

function formatSize(bytes: number | null | undefined) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
        <Button variant="primary" icon={<Icon.Plus size={16} />}>
          Dokument hochladen
        </Button>
      </div>

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
                          PDF · {formatSize(d.fileSize)}
                        </div>
                      </div>
                      {d.pinned && <Badge tone="sand" icon={<Icon.Pin size={11} />}>Pin</Badge>}
                    </div>
                    {d.description && (
                      <p className="text-[13px] text-stone-600 mt-3 leading-[1.55]">{d.description}</p>
                    )}
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-stone-100">
                      {d.validFrom && (
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-500">
                          Gültig ab {new Date(d.validFrom).toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </span>
                      )}
                      <a
                        href={d.fileUrl}
                        className="text-[12.5px] font-medium text-lake-700 inline-flex items-center gap-1 ml-auto"
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
