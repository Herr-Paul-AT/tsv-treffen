import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { SponsorForm } from '@/components/admin/SponsorForm';
import { createSponsor } from '@/lib/actions/sponsors';

export const dynamic = 'force-dynamic';

export default function NewSponsorPage() {
  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <Link
        href="/admin/sponsoren"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-stone-600 hover:text-stone-800"
      >
        <Icon.ArrowLeft size={14} /> Zurück zur Übersicht
      </Link>
      <div className="mt-3">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
          Adminbereich · Verein
        </div>
        <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">
          Neuer Sponsor
        </h1>
      </div>
      <SponsorForm action={createSponsor} submitLabel="Anlegen" />
    </main>
  );
}
