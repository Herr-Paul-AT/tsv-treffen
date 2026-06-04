import Link from 'next/link';
import { MobileHeader } from '@/components/nav/MobileHeader';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import {
  listDocumentsByCategory,
  DOC_CATEGORY_LABEL,
  type DocumentCategory,
} from '@/lib/db/queries/documents';

export const dynamic = 'force-dynamic';

function formatSize(bytes: number | null | undefined) {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const ORDER: DocumentCategory[] = ['statuten', 'beitraege', 'spielregeln', 'formular', 'protokoll', 'sonstiges'];

export default async function MemberDocumentsPage() {
  const grouped = await listDocumentsByCategory();
  return (
    <>
      <MobileHeader title="Dokumente" lead="Vereinsunterlagen" backHref="/app/profil" />
      <div className="px-5 pb-8 space-y-6">
        {ORDER.map((cat) => {
          const items = grouped[cat];
          if (!items.length) return null;
          return (
            <section key={cat}>
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500 mb-2">
                {DOC_CATEGORY_LABEL[cat]}
              </div>
              <div className="bg-white rounded-lg border border-stone-200 divide-y divide-stone-100">
                {items.map((d) => (
                  <Link
                    key={d.id}
                    href={d.fileUrl}
                    className="flex items-start gap-3 px-4 py-3.5 hover:bg-paper-50"
                  >
                    <span className="w-10 h-10 rounded-md bg-paper-100 text-stone-700 inline-flex items-center justify-center flex-none">
                      <Icon.Document size={18} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] font-medium text-stone-800 leading-tight">
                        {d.title}
                      </div>
                      {d.description && (
                        <div className="text-[12.5px] text-stone-600 mt-1 leading-snug">
                          {d.description}
                        </div>
                      )}
                      <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-500 mt-1.5">
                        PDF · {formatSize(d.fileSize)}
                        {d.validFrom &&
                          ` · gültig ab ${new Date(d.validFrom).toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit', year: 'numeric' })}`}
                      </div>
                    </div>
                    {d.pinned && (
                      <Badge tone="sand" icon={<Icon.Pin size={11} />}>
                        Pin
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
