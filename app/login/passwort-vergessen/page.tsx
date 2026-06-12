import Link from 'next/link';
import { TSVMark } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { TextField } from '@/components/ui/TextField';
import { requestPasswordReset } from '@/lib/actions/auth';

export const dynamic = 'force-dynamic';

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const sent = sp.sent === '1';

  return (
    <main className="min-h-dvh bg-paper-100 flex flex-col">
      <div className="pt-12 px-7 max-w-md w-full mx-auto">
        <Link href="/login" aria-label="Zurück zur Anmeldung">
          <TSVMark size={64} variant="color" />
        </Link>
      </div>
      <div className="px-7 mt-7 max-w-md w-full mx-auto">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500">
          Passwort zurücksetzen
        </span>
        <h1 className="font-display text-[32px] sm:text-[38px] leading-[1.05] text-stone-800 mt-2">
          Neues Passwort.
        </h1>
        <p className="text-[15px] text-stone-600 mt-3 leading-[1.55] max-w-[340px]">
          Gib deine E-Mail ein — wir schicken dir einen Link, über den du ein neues Passwort
          setzt.
        </p>
      </div>

      <form action={requestPasswordReset} className="flex-1 px-7 mt-7 max-w-md w-full mx-auto">
        {sent && (
          <div className="mb-4 flex items-start gap-2.5 rounded-md bg-forest-50 border border-forest-200 px-4 py-3 text-[13.5px] text-forest-800">
            <Icon.Mail size={16} className="flex-none mt-0.5" />
            <span>
              Falls die E-Mail bei uns hinterlegt ist, ist der Link unterwegs — schau auch im
              Spam-Ordner.
            </span>
          </div>
        )}

        <TextField
          label="E-Mail"
          leadIcon={<Icon.Mail size={16} />}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="vorname.name@…"
          required
        />

        <div className="mt-8">
          <Button type="submit" variant="primary" size="xl" className="w-full">
            Link senden
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
