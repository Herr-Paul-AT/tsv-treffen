import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TSVMark } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Icon } from '@/components/ui/Icon';
import { getEvent, countEventParticipants } from '@/lib/db/queries/events';
import { submitEventRegistration } from '@/lib/actions/events';
import { formatGermanDate } from '@/lib/format';

export const dynamic = 'force-dynamic';

const fieldLabel = 'font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500';

function timeLabel(e: { startsAt: Date; endsAt: Date | null; allDay: boolean }): string {
  if (e.allDay) return 'ganztägig';
  const pad = (n: number) => String(n).padStart(2, '0');
  let t = `${pad(e.startsAt.getHours())}:${pad(e.startsAt.getMinutes())}`;
  if (e.endsAt) t += `–${pad(e.endsAt.getHours())}:${pad(e.endsAt.getMinutes())}`;
  return `${t} Uhr`;
}

export default async function PublicEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; angemeldet?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const event = await getEvent(id);
  if (!event) notFound();

  const taken = event.registrationOpen ? await countEventParticipants(id) : 0;
  const spotsLeft = event.maxAttendees != null ? Math.max(0, event.maxAttendees - taken) : null;
  const isFull = event.maxAttendees != null && spotsLeft === 0;

  return (
    <main className="min-h-dvh bg-paper-100">
      <div className="max-w-xl w-full mx-auto px-6 sm:px-7 pt-10 pb-16">
        <Link href="/" aria-label="Zur Startseite" className="inline-block">
          <TSVMark size={56} variant="color" />
        </Link>
        <Link
          href="/#events"
          className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-stone-600 hover:text-stone-800"
        >
          <Icon.ArrowLeft size={14} /> Zurück zur Startseite
        </Link>

        <div className="mt-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500">
            Veranstaltung
          </span>
          <h1 className="font-display text-[30px] sm:text-[38px] leading-[1.08] text-stone-800 mt-2">
            {event.title}
          </h1>
          <div className="mt-3 space-y-1.5 text-[15px] text-stone-700">
            <div className="flex items-center gap-2">
              <Icon.Calendar size={16} className="text-stone-400" />
              {formatGermanDate(event.startsAt)} · {timeLabel(event)}
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <Icon.MapPin size={16} className="text-stone-400" />
                {event.location}
              </div>
            )}
          </div>
        </div>

        {event.description && (
          <p className="mt-5 text-[15px] text-stone-700 leading-[1.6] whitespace-pre-wrap">
            {event.description}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <a href={`/veranstaltung/${event.id}/ics`}>
            <Button variant="secondary" icon={<Icon.Calendar size={16} />}>
              In Kalender speichern
            </Button>
          </a>
          {event.attachmentUrl && (
            <a href={event.attachmentUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" icon={<Icon.Document size={16} />}>
                {event.attachmentName ?? 'Flyer ansehen'}
              </Button>
            </a>
          )}
        </div>

        {/* Anmeldung */}
        {event.registrationOpen && (
          <div className="mt-8 border-t border-stone-200 pt-8">
            {sp.angemeldet ? (
              <div className="flex items-start gap-3 rounded-lg bg-forest-50 border border-forest-200 px-5 py-4">
                <Icon.Check size={20} className="text-forest-700 flex-none mt-0.5" />
                <div>
                  <div className="font-display text-[18px] text-stone-800">Anmeldung erhalten.</div>
                  <p className="text-[14px] text-stone-600 mt-1 leading-snug">
                    Danke! Wir haben deine Anmeldung erhalten und melden uns bei dir.
                  </p>
                </div>
              </div>
            ) : isFull ? (
              <div className="rounded-lg bg-sand-50 border border-sand-200 px-5 py-4 text-center">
                <div className="font-display text-[20px] text-stone-800">Ausgebucht</div>
                <p className="text-[14px] text-stone-600 mt-1">
                  Diese Veranstaltung ist leider voll. Schreib uns gern für die Warteliste an{' '}
                  <a href="mailto:office@tsv-treffen.at" className="text-lake-700 underline">
                    office@tsv-treffen.at
                  </a>
                  .
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <h2 className="font-display text-[22px] text-stone-800">Jetzt anmelden</h2>
                  {spotsLeft != null && (
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-forest-700">
                      Noch {spotsLeft} {spotsLeft === 1 ? 'Platz' : 'Plätze'} frei
                    </span>
                  )}
                </div>

                {sp.error && (
                  <div className="mt-4 flex items-start gap-2.5 rounded-md bg-danger/5 border border-danger/20 px-4 py-3 text-[14px] text-danger">
                    <Icon.Info size={16} className="flex-none mt-0.5" />
                    <span>{sp.error}</span>
                  </div>
                )}

                <form action={submitEventRegistration} className="mt-5 space-y-4">
                  <input type="hidden" name="eventId" value={event.id} />
                  <TextField label="Name" name="name" required placeholder="Vor- und Nachname" />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <TextField label="E-Mail" name="email" type="email" required placeholder="name@example.at" />
                    <TextField label="Telefon (optional)" name="phone" type="tel" placeholder="+43 …" />
                  </div>
                  <TextField
                    label="Anzahl Teilnehmer"
                    name="participants"
                    type="number"
                    defaultValue="1"
                    placeholder="1"
                  />
                  <div>
                    <label htmlFor="ev-msg" className="block">
                      <span className={fieldLabel}>Nachricht (optional)</span>
                      <textarea
                        id="ev-msg"
                        name="message"
                        rows={3}
                        placeholder="Anmerkungen, Alter der Kinder, Fragen …"
                        className="mt-2 w-full px-4 py-3 bg-white rounded-md border border-stone-200 text-[16px] text-stone-800 placeholder-stone-400 outline-none focus:border-lake-500 focus:ring-2 focus:ring-lake-500/15 resize-y"
                      />
                    </label>
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="privacyConsent"
                      required
                      className="mt-0.5 w-5 h-5 flex-none rounded border-stone-300 text-lake-700 focus:ring-lake-500/30"
                    />
                    <span className="text-[14px] text-stone-700 leading-snug">
                      Ich habe die{' '}
                      <a href="/datenschutz" target="_blank" className="text-lake-700 underline">
                        Datenschutzerklärung
                      </a>{' '}
                      gelesen und stimme der Verarbeitung meiner Daten zu.
                    </span>
                  </label>
                  <Button type="submit" variant="primary" size="lg" iconAfter={<Icon.ArrowRight size={16} />}>
                    Anmeldung absenden
                  </Button>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
