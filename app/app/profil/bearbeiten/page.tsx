import Link from 'next/link';
import { Avatar, type AvatarTone } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Icon } from '@/components/ui/Icon';
import { getCurrentMember } from '@/lib/db/queries/session';
import { updateOwnProfile } from '@/lib/actions/profile';

export const dynamic = 'force-dynamic';

function isoDate(d: string | Date | null | undefined): string {
  if (!d) return '';
  if (typeof d === 'string') return d.slice(0, 10);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default async function ProfilBearbeitenPage() {
  const me = await getCurrentMember();
  if (!me) {
    return (
      <main className="px-5 py-12 text-center">
        <p className="text-[16px] text-stone-700">Kein angemeldetes Mitglied gefunden.</p>
        <Link href="/login" className="mt-4 inline-block text-lake-700 font-medium">
          Anmelden
        </Link>
      </main>
    );
  }

  return (
    <div className="px-5 pt-6 pb-10">
      <Link
        href="/app/profil"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-stone-600 hover:text-stone-800"
      >
        <Icon.ArrowLeft size={14} /> Zurück zum Profil
      </Link>

      <div className="mt-4 flex items-center gap-3">
        <Avatar initials={me.initials} size={56} tone={me.avatarTone as AvatarTone} />
        <div>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-stone-500">
            Profil bearbeiten
          </span>
          <h1 className="font-display text-[26px] text-stone-800 leading-tight">
            Deine Daten
          </h1>
        </div>
      </div>

      <form action={updateOwnProfile} className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Vorname" name="firstName" required defaultValue={me.firstName} />
          <TextField label="Nachname" name="lastName" required defaultValue={me.lastName} />
        </div>
        <TextField label="E-Mail" name="email" type="email" defaultValue={me.email ?? ''} placeholder="vorname.name@example.at" />
        <TextField label="Telefon" name="phone" type="tel" defaultValue={me.phone ?? ''} placeholder="+43 …" />
        <TextField label="Adresse" name="street" defaultValue={me.street ?? ''} placeholder="Straße und Hausnummer" />
        <div className="grid grid-cols-[110px_1fr] gap-3">
          <TextField label="PLZ" name="postalCode" defaultValue={me.postalCode ?? ''} placeholder="9521" />
          <TextField label="Ort" name="city" defaultValue={me.city ?? ''} placeholder="Treffen" />
        </div>
        <TextField label="Geburtsdatum" name="birthdate" type="date" defaultValue={isoDate(me.birthdate)} />

        <div className="rounded-lg bg-paper-50 border border-stone-200 p-4 flex items-start gap-3">
          <Icon.Info size={18} className="text-lake-600 flex-none mt-0.5" />
          <p className="text-[13px] text-stone-600 leading-snug">
            Mannschaft, Beitrag und Rolle werden vom Vorstand verwaltet. Wende dich bei Fragen
            dazu an{' '}
            <a href="mailto:office@tsv-treffen.at" className="text-lake-700">
              office@tsv-treffen.at
            </a>
            .
          </p>
        </div>

        <div className="flex gap-2 pt-1">
          <Button type="submit" variant="primary" size="lg" icon={<Icon.Check size={16} />} className="flex-1">
            Speichern
          </Button>
          <Link
            href="/app/profil"
            className="inline-flex items-center justify-center h-12 px-5 rounded-md text-[15px] font-medium text-stone-700 border border-stone-200 bg-white"
          >
            Abbrechen
          </Link>
        </div>
      </form>
    </div>
  );
}
