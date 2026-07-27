import { MobileHeader } from '@/components/nav/MobileHeader';
import { ContactsGrid } from '@/components/ContactsGrid';
import { listActiveContacts } from '@/lib/db/queries/contacts';

export const dynamic = 'force-dynamic';

export default async function AppContactsPage() {
  const contacts = await listActiveContacts();

  return (
    <>
      <MobileHeader title="Trainer & Kontakte" lead="Verein" backHref="/app/profil" />
      <div className="px-5 pb-8">
        {contacts.length === 0 ? (
          <p className="text-[14px] text-stone-500">Aktuell sind keine Kontakte hinterlegt.</p>
        ) : (
          <>
            <p className="text-[14px] text-stone-600 leading-[1.6] mb-5">
              Fragen zu Training, Jugend oder Mitgliedschaft? Melde dich direkt bei uns. Die
              Ballmaschine kann gemietet werden — einfach nachfragen.
            </p>
            <ContactsGrid contacts={contacts} />
          </>
        )}
      </div>
    </>
  );
}
