import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { CourtProgramForm } from '@/components/admin/CourtProgramForm';
import { createCourtProgramEntry } from '@/lib/actions/court-program';

export const dynamic = 'force-dynamic';

export default function NewCourtProgramPage() {
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
          Neuer Eintrag
        </h1>
      </div>
      <CourtProgramForm action={createCourtProgramEntry} submitLabel="Anlegen" />
    </main>
  );
}
