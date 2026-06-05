import Link from 'next/link';
import { TSVMark } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { TextField } from '@/components/ui/TextField';
import { signInWithMagicLink, signInWithPassword } from '@/lib/actions/auth';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export const dynamic = 'force-dynamic';

const ERRORS: Record<string, string> = {
  credentials: 'E-Mail oder Passwort ist nicht korrekt.',
  missing: 'Bitte E-Mail und Passwort eingeben.',
  magiclink: 'Magic-Link konnte nicht gesendet werden. Bitte erneut versuchen.',
  callback: 'Anmeldung fehlgeschlagen. Bitte fordere einen neuen Link an.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string; sent?: string }>;
}) {
  const sp = await searchParams;
  const redirectTo = sp.redirect && sp.redirect.startsWith('/') ? sp.redirect : '/app/dashboard';
  const errorMsg = sp.error ? ERRORS[sp.error] ?? 'Anmeldung fehlgeschlagen.' : null;
  const sent = sp.sent === '1';
  const configured = isSupabaseConfigured();

  return (
    <main className="min-h-dvh bg-paper-100 flex flex-col">
      <div className="pt-12 px-7 max-w-md w-full mx-auto">
        <Link href="/" aria-label="Zur Startseite">
          <TSVMark size={72} variant="color" />
        </Link>
      </div>
      <div className="px-7 mt-7 max-w-md w-full mx-auto">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500">
          Mitgliederbereich
        </span>
        <h1 className="font-display text-[34px] sm:text-[40px] leading-[1.05] text-stone-800 mt-2">
          Willkommen
          <br />
          zurück.
        </h1>
        <p className="text-[16px] text-stone-600 mt-3 leading-[1.55] max-w-[320px]">
          Melde dich an, um Trainings zu bestätigen, Plätze zu buchen und News deiner Mannschaft
          zu sehen.
        </p>
      </div>

      <form className="flex-1 px-7 mt-7 max-w-md w-full mx-auto">
        <input type="hidden" name="redirect" value={redirectTo} />

        {errorMsg && (
          <div className="mb-4 flex items-start gap-2.5 rounded-md bg-danger/5 border border-danger/20 px-4 py-3 text-[13.5px] text-danger">
            <Icon.Info size={16} className="flex-none mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
        {sent && (
          <div className="mb-4 flex items-start gap-2.5 rounded-md bg-forest-50 border border-forest-200 px-4 py-3 text-[13.5px] text-forest-800">
            <Icon.Mail size={16} className="flex-none mt-0.5" />
            <span>Magic-Link gesendet — schau in dein E-Mail-Postfach.</span>
          </div>
        )}

        <div className="space-y-4">
          <TextField
            label="E-Mail"
            leadIcon={<Icon.Mail size={16} />}
            placeholder="vorname.name@…"
            type="email"
            name="email"
            autoComplete="email"
            required
          />
          <TextField
            label="Passwort"
            leadIcon={<Icon.Lock size={16} />}
            type="password"
            placeholder="••••••••"
            name="password"
            autoComplete="current-password"
          />
        </div>

        <div className="mt-8 space-y-3">
          <Button type="submit" formAction={signInWithPassword} variant="primary" size="xl" className="w-full">
            Anmelden
          </Button>
          <Button
            type="submit"
            formAction={signInWithMagicLink}
            variant="secondary"
            size="lg"
            icon={<Icon.Mail size={16} />}
            className="w-full"
          >
            Stattdessen Magic-Link per E-Mail
          </Button>
          {!configured && (
            <Link href={redirectTo} className="block">
              <Button variant="ghost" size="lg" className="w-full !text-stone-700">
                Als Gast fortfahren (Dev)
              </Button>
            </Link>
          )}
        </div>
      </form>

      <div className="px-7 py-7 max-w-md w-full mx-auto text-center font-mono text-[11px] text-stone-500 uppercase tracking-[0.16em]">
        Neu hier?{' '}
        <a href="mailto:office@tsv-treffen.at" className="text-lake-700">
          Mitglied werden
        </a>
      </div>
    </main>
  );
}
