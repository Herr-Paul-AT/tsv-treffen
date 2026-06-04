import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { MemberImportClient } from '@/components/admin/MemberImportClient';
import { importMembers } from '@/lib/actions/members';

export const dynamic = 'force-dynamic';

export default function ImportMembersPage() {
  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <Link
        href="/admin/mitglieder"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-stone-600 hover:text-stone-800"
      >
        <Icon.ArrowLeft size={14} /> Zurück zur Mitgliederliste
      </Link>
      <div className="mt-3">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
          Adminbereich · Erstbefüllung
        </div>
        <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">
          Mitglieder importieren
        </h1>
        <p className="text-[15px] text-stone-600 mt-2 max-w-2xl">
          Bestehende Mitgliederliste aus Excel oder Vereinsplaner als CSV einfügen. Die Vorschau
          zeigt sofort, welche Zeilen übernommen werden. Bereits vorhandene E-Mail-Adressen werden
          übersprungen.
        </p>
      </div>
      <MemberImportClient action={importMembers} />
    </main>
  );
}
