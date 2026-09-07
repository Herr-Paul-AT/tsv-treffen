import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Icon } from '@/components/ui/Icon';
import { getSiteSettings } from '@/lib/db/queries/settings';
import { updateSettings } from '@/lib/actions/settings';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const sp = await searchParams;
  const settings = await getSiteSettings();

  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
          Adminbereich · Verein
        </div>
        <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">Einstellungen</h1>
        <p className="text-[15px] text-stone-600 mt-2 max-w-2xl">
          Angaben, die ihr selbst ändern könnt. Änderungen erscheinen sofort auf der Startseite
          (z. B. im Header und in den Abschnittstiteln).
        </p>
      </div>

      {sp.saved && (
        <div className="mt-5 max-w-2xl flex items-start gap-2.5 rounded-md bg-forest-50 border border-forest-200 px-4 py-3 text-[14px] text-forest-800">
          <Icon.Check size={16} className="flex-none mt-0.5" />
          <span>Einstellungen gespeichert.</span>
        </div>
      )}

      <form action={updateSettings} className="mt-8 max-w-xl space-y-5">
        <div className="grid sm:grid-cols-[200px_1fr] gap-4">
          <TextField
            label="Saison-Jahr"
            name="seasonYear"
            defaultValue={String(settings.seasonYear)}
            placeholder="z. B. 2027"
          />
          <TextField
            label="Saisoneröffnung (optional)"
            name="seasonOpening"
            defaultValue={settings.seasonOpening}
            placeholder="z. B. Eröffnung am 12. April"
          />
        </div>
        <p className="text-[13px] text-stone-500 leading-snug">
          Das Saison-Jahr steht z. B. im Header („Saison 2026"), bei „Mannschaften", im
          Trainings- und Saison-Kalender und im Footer.
        </p>
        <Button type="submit" variant="primary" icon={<Icon.Check size={16} />}>
          Speichern
        </Button>
      </form>
    </main>
  );
}
