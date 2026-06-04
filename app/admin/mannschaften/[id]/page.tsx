import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { TeamForm } from '@/components/admin/TeamForm';
import { KaderManager } from '@/components/admin/KaderManager';
import { DeleteButton } from '@/components/admin/DeleteButton';
import {
  getTeam,
  getTeamRoster,
  listMembersNotInTeam,
} from '@/lib/db/queries/teams';
import { listTrainerOptions } from '@/lib/db/queries/members';
import {
  addMemberToTeam,
  deleteTeam,
  removeMemberFromTeam,
  setTeamMemberRole,
  updateTeam,
} from '@/lib/actions/teams';

export const dynamic = 'force-dynamic';

export default async function EditTeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [team, roster, available, trainerOptions] = await Promise.all([
    getTeam(id),
    getTeamRoster(id),
    listMembersNotInTeam(id),
    listTrainerOptions(),
  ]);
  if (!team) notFound();

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
          Adminbereich · Mannschaft &amp; Kader
        </div>
        <h1 className="font-display text-[32px] leading-[1.05] text-stone-800 mt-1">{team.name}</h1>
      </div>

      <div className="mt-6 grid lg:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="font-display text-[20px] text-stone-800">Stammdaten</h2>
          <TeamForm action={updateTeam} team={team} trainerOptions={trainerOptions} submitLabel="Änderungen speichern" />
        </div>

        <div className="mt-0 lg:mt-[0px]">
          <KaderManager
            teamId={team.id}
            roster={roster}
            available={available}
            addAction={addMemberToTeam}
            roleAction={setTeamMemberRole}
            removeAction={removeMemberFromTeam}
          />
        </div>
      </div>

      <div className="mt-12 max-w-2xl border-t border-stone-200 pt-6">
        <h2 className="font-display text-[18px] text-stone-800">Gefahrenzone</h2>
        <p className="text-[14px] text-stone-600 mt-1.5 mb-4">
          Die Mannschaft wird gelöscht. Mitglieder bleiben erhalten, nur ihre Zuordnung zu diesem
          Team wird entfernt. Verknüpfte Trainings verlieren ihre Mannschaftszuordnung.
        </p>
        <DeleteButton
          action={deleteTeam}
          id={team.id}
          label="Mannschaft löschen"
          confirmText={`„${team.name}" wirklich löschen? Das kann nicht rückgängig gemacht werden.`}
        />
      </div>
    </main>
  );
}
