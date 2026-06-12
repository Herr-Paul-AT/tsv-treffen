import Link from 'next/link';
import { TSVMark } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { TextField } from '@/components/ui/TextField';
import { updatePassword } from '@/lib/actions/auth';

export const dynamic = 'force-dynamic';

const ERRORS: Record<string, string> = {
  short: 'Das Passwort muss mindestens 8 Zeichen haben.',
  mismatch: 'Die beiden Passwörter stimmen nicht überein.',
  failed: 'Konnte nicht gespeichert werden. Fordere den Link ggf. neu an.',
};

export default async function SetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const errorMsg = sp.error ? ERRORS[sp.error] ?? 'Etwas ist schiefgelaufen.' : null;

  return (
    <main className="min-h-dvh bg-paper-100 flex flex-col">
      <div className="pt-12 px-7 max-w-md w-full mx-auto">
        <TSVMark size={64} variant="color" />
      </div>
      <div className="px-7 mt-7 max-w-md w-full mx-auto">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500">
          Neues Passwort
        </span>
        <h1 className="font-display text-[32px] sm:text-[38px] leading-[1.05] text-stone-800 mt-2">
          Passwort setzen.
        </h1>
        <p className="text-[15px] text-stone-600 mt-3 leading-[1.55] max-w-[340px]">
          Wähle ein neues Passwort — danach bist du angemeldet.
        </p>
      </div>

      <form action={updatePassword} className="flex-1 px-7 mt-7 max-w-md w-full mx-auto">
        {errorMsg && (
          <div className="mb-4 flex items-start gap-2.5 rounded-md bg-danger/5 border border-danger/20 px-4 py-3 text-[13.5px] text-danger">
            <Icon.Info size={16} className="flex-none mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="space-y-4">
          <TextField label="Neues Passwort (min. 8 Zeichen)" leadIcon={<Icon.Lock size={16} />} type="password" name="password" autoComplete="new-password" placeholder="••••••••" required />
          <TextField label="Passwort wiederholen" leadIcon={<Icon.Lock size={16} />} type="password" name="password2" autoComplete="new-password" placeholder="••••••••" required />
        </div>

        <div className="mt-8">
          <Button type="submit" variant="primary" size="xl" className="w-full">
            Passwort speichern
          </Button>
        </div>
      </form>

      <div className="px-7 py-7 max-w-md w-full mx-auto text-center text-[13.5px] text-stone-600">
        <Link href="/login" className="text-lake-700 font-medium">
          Zurück zur Anmeldung
        </Link>
      </div>
    </main>
  );
}
