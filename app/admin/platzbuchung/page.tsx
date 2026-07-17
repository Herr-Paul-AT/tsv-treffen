import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

const RESERVATION_URL = 'https://treffen.tennisplatz.info/reservierung';

export default function AdminBookingsPage() {
  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
          Adminbereich · Reservierung
        </div>
        <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">
          Platzbuchung
        </h1>
      </div>

      <div className="mt-6 max-w-2xl bg-stone-800 text-paper-50 rounded-xl p-6">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-sand-300">
          Platzreservierung
        </div>
        <h2 className="font-display text-[24px] mt-2 leading-tight">
          Reservierung läuft über tennisplatz.info.
        </h2>
        <p className="text-[14px] text-paper-100/80 mt-3 leading-[1.6]">
          Die Platzbuchung wird über das externe Reservierungssystem auf tennisplatz.info
          abgewickelt. Freie Zeiten, Buchungen und Belegung werden dort verwaltet.
        </p>
        <a
          href={RESERVATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-5"
        >
          <Button variant="accent" size="lg" iconAfter={<Icon.External size={16} />}>
            Reservierungssystem öffnen
          </Button>
        </a>
      </div>
    </main>
  );
}
