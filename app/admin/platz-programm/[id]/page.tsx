import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { CourtProgramForm } from '@/components/admin/CourtProgramForm';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { getCourtProgramEntry } from '@/lib/db/queries/court-program';
import { deleteCourtProgramEntry, updateCourtProgramEntry } from '@/lib/actions/court-program';

export const dynamic = 'force-dynamic';

export default async function EditCourtProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await getCourtProgramEntry(id);
  if (!entry) notFound();

  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <Link
        href="/admin/platz-programm"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-stone-600 hover:text-stone-800"
      >
        <Icon.ArrowLeft size={14} /> Zurück zur Übersicht
      </Link>
      <div className="mt-3">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
          Adminbereich · Verein
        </div>
        <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">
          Eintrag bearbeiten
        </h1>
      </div>

      <CourtProgramForm action={updateCourtProgramEntry} entry={entry} submitLabel="Änderungen speichern" />

      <div className="mt-12 max-w-2xl border-t border-stone-200 pt-6">
        <h2 className="font-display text-[18px] text-stone-800">Gefahrenzone</h2>
        <p className="text-[14px] text-stone-600 mt-1.5 mb-4">
          Dieser Eintrag wird dauerhaft entfernt und verschwindet von der Startseite.
        </p>
        <DeleteButton
          action={deleteCourtProgramEntry}
          id={entry.id}
          label="Eintrag löschen"
          confirmText={`„${entry.title}" (${entry.weekday}, ${entry.time}) wirklich löschen?`}
        />
      </div>
    </main>
  );
}
