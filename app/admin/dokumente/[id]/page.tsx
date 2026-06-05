import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { DocumentForm } from '@/components/admin/DocumentForm';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { getDocumentById } from '@/lib/db/queries/documents';
import { deleteDocument, updateDocument } from '@/lib/actions/documents';

export const dynamic = 'force-dynamic';

export default async function EditDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doc = await getDocumentById(id);
  if (!doc) notFound();

  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <Link
        href="/admin/dokumente"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-stone-600 hover:text-stone-800"
      >
        <Icon.ArrowLeft size={14} /> Zurück zu Dokumente
      </Link>
      <div className="mt-3">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
          Adminbereich · Dokument bearbeiten
        </div>
        <h1 className="font-display text-[32px] leading-[1.05] text-stone-800 mt-1">{doc.title}</h1>
      </div>

      <DocumentForm action={updateDocument} doc={doc} submitLabel="Änderungen speichern" />

      <div className="mt-12 max-w-2xl border-t border-stone-200 pt-6">
        <h2 className="font-display text-[18px] text-stone-800">Gefahrenzone</h2>
        <p className="text-[14px] text-stone-600 mt-1.5 mb-4">
          Der Eintrag wird entfernt — die verlinkte Datei selbst bleibt an ihrem Speicherort
          unberührt.
        </p>
        <DeleteButton
          action={deleteDocument}
          id={doc.id}
          label="Dokument löschen"
          confirmText={`„${doc.title}" wirklich aus der Liste entfernen?`}
        />
      </div>
    </main>
  );
}
