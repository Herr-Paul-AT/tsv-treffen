import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Avatar, type AvatarTone } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { TrainingForm } from '@/components/admin/TrainingForm';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteTraining, updateTraining } from '@/lib/actions/trainings';
import { getTrainingById, getTrainingRoster } from '@/lib/db/queries/trainings';
import { listTeamOptions } from '@/lib/db/queries/teams';
import { listTrainerOptions } from '@/lib/db/queries/members';

export const dynamic = 'force-dynamic';

const GROUPS = [
  { key: 'yes', label: 'Zugesagt', tone: 'forest' as const },
  { key: 'maybe', label: 'Vielleicht', tone: 'sand' as const },
  { key: 'no', label: 'Abgesagt', tone: 'danger' as const },
];

export default async function EditTrainingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [training, teamOptions, trainerOptions, roster] = await Promise.all([
    getTrainingById(id),
    listTeamOptions(),
    listTrainerOptions(),
    getTrainingRoster(id),
  ]);
  if (!training) notFound();

  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <Link
        href="/admin/trainings"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-stone-600 hover:text-stone-800"
      >
        <Icon.ArrowLeft size={14} /> Zurück zu Trainings &amp; Termine
      </Link>
      <div className="mt-3">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
          Adminbereich · Training bearbeiten
        </div>
        <h1 className="font-display text-[32px] leading-[1.05] text-stone-800 mt-1">
          {training.title}
        </h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
        <TrainingForm
          action={updateTraining}
          training={training}
          teamOptions={teamOptions}
          trainerOptions={trainerOptions}
          submitLabel="Änderungen speichern"
        />

        <aside className="mt-8 bg-white rounded-lg border border-stone-200 p-5">
          <h2 className="font-display text-[18px] text-stone-800">Rückmeldungen</h2>
          {roster.length === 0 && (
            <p className="text-[13.5px] text-stone-500 mt-2">Noch keine Rückmeldungen.</p>
          )}
          <div className="mt-3 space-y-4">
            {GROUPS.map((g) => {
              const entries = roster.filter((r) => r.status === g.key);
              if (entries.length === 0) return null;
              return (
                <div key={g.key}>
                  <div className="flex items-center gap-2">
                    <Badge tone={g.tone}>{g.label}</Badge>
                    <span className="font-mono text-[11px] text-stone-400">{entries.length}</span>
                  </div>
                  <div className="mt-2 space-y-1.5">
                    {entries.map((e) => (
                      <div key={e.member.id} className="flex items-center gap-2.5">
                        <Avatar
                          initials={e.member.initials}
                          size={28}
                          tone={e.member.avatarTone as AvatarTone}
                        />
                        <span className="text-[13.5px] text-stone-700">
                          {e.member.firstName} {e.member.lastName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      <div className="mt-12 max-w-2xl border-t border-stone-200 pt-6">
        <h2 className="font-display text-[18px] text-stone-800">Gefahrenzone</h2>
        <p className="text-[14px] text-stone-600 mt-1.5 mb-4">
          Das Training wird dauerhaft entfernt — inklusive aller Rückmeldungen. Wenn es nur
          ausfällt, nutze stattdessen „Training absagen" im Formular.
        </p>
        <DeleteButton
          action={deleteTraining}
          id={training.id}
          label="Training löschen"
          confirmText={`„${training.title}" wirklich löschen? Das kann nicht rückgängig gemacht werden.`}
        />
      </div>
    </main>
  );
}
