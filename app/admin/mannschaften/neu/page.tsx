import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { TeamForm } from '@/components/admin/TeamForm';
import { createTeam } from '@/lib/actions/teams';
import { listTrainerOptions } from '@/lib/db/queries/members';

export const dynamic = 'force-dynamic';

export default async function NewTeamPage() {
  const trainerOptions = await listTrainerOptions();
  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <Link
        href="/admin/mannschaften"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-stone-600 hover:text-stone-800"
      >
        <Icon.ArrowLeft size={14} /> Zurück zu Mannschaften
      </Link>
      <div className="mt-3">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
          Adminbereich
        </div>
        <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">
          Neue Mannschaft
        </h1>
        <p className="text-[15px] text-stone-600 mt-2 max-w-2xl">
          Nach dem Anlegen kannst du direkt den Kader zusammenstellen.
        </p>
      </div>
      <TeamForm action={createTeam} trainerOptions={trainerOptions} submitLabel="Mannschaft anlegen" />
    </main>
  );
}
