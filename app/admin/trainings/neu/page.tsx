import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { TrainingForm } from '@/components/admin/TrainingForm';
import { createTraining } from '@/lib/actions/trainings';
import { listTeamOptions } from '@/lib/db/queries/teams';
import { listTrainerOptions } from '@/lib/db/queries/members';

export const dynamic = 'force-dynamic';

export default async function NewTrainingPage() {
  const [teamOptions, trainerOptions] = await Promise.all([listTeamOptions(), listTrainerOptions()]);

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
          Adminbereich · Planung
        </div>
        <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">
          Neues Training
        </h1>
        <p className="text-[15px] text-stone-600 mt-2 max-w-2xl">
          Mannschaft zuordnen, damit die richtigen Mitglieder das Training sehen und zu- oder
          absagen können.
        </p>
      </div>
      <TrainingForm
        action={createTraining}
        teamOptions={teamOptions}
        trainerOptions={trainerOptions}
        submitLabel="Training anlegen"
      />
    </main>
  );
}
