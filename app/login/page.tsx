import Link from 'next/link';
import { TSVMark } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { TextField } from '@/components/ui/TextField';
import { signInWithPassword } from '@/lib/actions/auth';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export const dynamic = 'force-dynamic';

const ERRORS: Record<string, string> = {
  credentials: 'E-Mail oder Passwort ist nicht korrekt.',
  missing: 'Bitte E-Mail und Passwort eingeben.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string; registered?: string; reset?: string }>;
}) {
  const sp = await searchParams;
  const redirectTo = sp.redirect && sp.redirect.startsWith('/') ? sp.redirect : '/app/dashboard';
  const errorMsg = sp.error ? ERRORS[sp.error] ?? 'Anmeldung fehlgeschlagen.' : null;
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
          Melde dich mit E-Mail und Passwort an.
        </p>
      </div>

      <form action={signInWithPassword} className="flex-1 px-7 mt-7 max-w-md w-full mx-auto">
        <input type="hidden" name="redirect" value={redirectTo} />

        {errorMsg && (
          <div className="mb-4 flex items-start gap-2.5 rounded-md bg-danger/5 border border-danger/20 px-4 py-3 text-[13.5px] text-danger">
            <Icon.Info size={16} className="flex-none mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
        {sp.registered === '1' && (
          <div className="mb-4 flex items-start gap-2.5 rounded-md bg-forest-50 border border-forest-200 px-4 py-3 text-[13.5px] text-forest-800">
            <Icon.Mail size={16} className="flex-none mt-0.5" />
            <span>Fast fertig — bestätige kurz deine E-Mail, danach kannst du dich anmelden.</span>
          </div>
        )}
        {sp.reset === '1' && (
          <div className="mb-4 flex items-start gap-2.5 rounded-md bg-forest-50 border border-forest-200 px-4 py-3 text-[13.5px] text-forest-800">
            <Icon.Check size={16} className="flex-none mt-0.5" />
            <span>Passwort geändert. Du kannst dich jetzt anmelden.</span>
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
            required
          />
          <div className="text-right -mt-1">
            <Link
              href="/login/passwort-vergessen"
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-lake-700"
            >
              Passwort vergessen?
            </Link>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <Button type="submit" variant="primary" size="xl" className="w-full">
            Anmelden
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

      <div className="px-7 py-7 max-w-md w-full mx-auto text-center text-[13.5px] text-stone-600">
        Zum ersten Mal hier?{' '}
        <Link href="/login/registrieren" className="text-lake-700 font-medium">
          Konto einrichten
        </Link>
      </div>
    </main>
  );
}
