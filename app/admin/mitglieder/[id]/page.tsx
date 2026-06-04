import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Avatar, type AvatarTone } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { MemberForm } from '@/components/admin/MemberForm';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { getMember } from '@/lib/db/queries/members';
import { deleteMember, updateMember } from '@/lib/actions/members';

export const dynamic = 'force-dynamic';

export default async function EditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await getMember(id);
  if (!member) notFound();

  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <Link
        href="/admin/mitglieder"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-stone-600 hover:text-stone-800"
      >
        <Icon.ArrowLeft size={14} /> Zurück zur Mitgliederliste
      </Link>
      <div className="mt-3 flex items-center gap-4">
        <Avatar initials={member.initials} size={48} tone={member.avatarTone as AvatarTone} />
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
            Adminbereich · Mitglied bearbeiten
          </div>
          <h1 className="font-display text-[32px] leading-[1.05] text-stone-800 mt-0.5">
            {member.firstName} {member.lastName}
          </h1>
        </div>
      </div>

      <MemberForm action={updateMember} member={member} submitLabel="Änderungen speichern" />

      <div className="mt-12 max-w-3xl border-t border-stone-200 pt-6">
        <h2 className="font-display text-[18px] text-stone-800">Gefahrenzone</h2>
        <p className="text-[14px] text-stone-600 mt-1.5 mb-4">
          Das Mitglied wird dauerhaft entfernt — inklusive Mannschafts-Zuordnungen und
          Trainings-Rückmeldungen.
        </p>
        <DeleteButton
          action={deleteMember}
          id={member.id}
          label="Mitglied löschen"
          confirmText={`${member.firstName} ${member.lastName} wirklich löschen? Das kann nicht rückgängig gemacht werden.`}
        />
      </div>
    </main>
  );
}
