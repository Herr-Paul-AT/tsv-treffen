import Link from 'next/link';
import { TSVMark } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { TextField } from '@/components/ui/TextField';
import { registerAccount } from '@/lib/actions/auth';

export const dynamic = 'force-dynamic';

const ERRORS: Record<string, string> = {
  missing: 'Bitte E-Mail und Passwort ausfüllen.',
  short: 'Das Passwort muss mindestens 8 Zeichen haben.',
  mismatch: 'Die beiden Passwörter stimmen nicht überein.',
  unknown: 'Diese E-Mail ist nicht als Mitglied hinterlegt. Bitte beim Vorstand melden.',
  exists: 'Für diese E-Mail gibt es schon ein Konto. Nutze „Anmelden" oder „Passwort vergessen".',
  failed: 'Konto konnte nicht eingerichtet werden. Bitte erneut versuchen.',
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const errorMsg = sp.error ? ERRORS[sp.error] ?? 'Etwas ist schiefgelaufen.' : null;

  return (
    <main className="min-h-dvh bg-paper-100 flex flex-col">
      <div className="pt-12 px-7 max-w-md w-full mx-auto">
        <Link href="/login" aria-label="Zurück zur Anmeldung">
          <TSVMark size={64} variant="color" />
        </Link>
      </div>
      <div className="px-7 mt-7 max-w-md w-full mx-auto">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500">
          Konto einrichten
        </span>
        <h1 className="font-display text-[32px] sm:text-[38px] leading-[1.05] text-stone-800 mt-2">
          Passwort festlegen.
        </h1>
        <p className="text-[15px] text-stone-600 mt-3 leading-[1.55] max-w-[340px]">
          Für Vereinsmitglieder. Nutze die E-Mail, die der Verein für dich hinterlegt hat — danach
          meldest du dich immer mit E-Mail und Passwort an.
        </p>
      </div>

      <form action={registerAccount} className="flex-1 px-7 mt-7 max-w-md w-full mx-auto">
        {errorMsg && (
          <div className="mb-4 flex items-start gap-2.5 rounded-md bg-danger/5 border border-danger/20 px-4 py-3 text-[13.5px] text-danger">
            <Icon.Info size={16} className="flex-none mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="space-y-4">
          <TextField label="E-Mail" leadIcon={<Icon.Mail size={16} />} type="email" name="email" autoComplete="email" placeholder="vorname.name@…" required />
          <TextField label="Passwort (min. 8 Zeichen)" leadIcon={<Icon.Lock size={16} />} type="password" name="password" autoComplete="new-password" placeholder="••••••••" required />
          <TextField label="Passwort wiederholen" leadIcon={<Icon.Lock size={16} />} type="password" name="password2" autoComplete="new-password" placeholder="••••••••" required />
        </div>

        <div className="mt-8">
          <Button type="submit" variant="primary" size="xl" className="w-full">
            Konto einrichten
          </Button>
        </div>
      </form>

      <div className="px-7 py-7 max-w-md w-full mx-auto text-center text-[13.5px] text-stone-600">
        Schon ein Konto?{' '}
        <Link href="/login" className="text-lake-700 font-medium">
          Zur Anmeldung
        </Link>
      </div>
    </main>
  );
}
