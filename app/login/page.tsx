import Link from 'next/link';
import { TSVMark } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { TextField } from '@/components/ui/TextField';

export default function LoginPage() {
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

      <form action="/app/dashboard" className="flex-1 px-7 mt-7 max-w-md w-full mx-auto">
        <div className="space-y-4">
          <TextField
            label="E-Mail"
            leadIcon={<Icon.Mail size={16} />}
            placeholder="vorname.name@…"
            type="email"
            name="email"
            autoComplete="email"
          />
          <TextField
            label="Passwort"
            leadIcon={<Icon.Lock size={16} />}
            type="password"
            placeholder="••••••••"
            name="password"
            autoComplete="current-password"
          />
          <div className="text-right -mt-1">
            <Link
              href="#"
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
          <Link href="/" className="block">
            <Button variant="ghost" size="lg" className="w-full !text-stone-700">
              Als Gast fortfahren
            </Button>
          </Link>
        </div>
      </form>

      <div className="px-7 py-7 max-w-md w-full mx-auto text-center font-mono text-[11px] text-stone-500 uppercase tracking-[0.16em]">
        Neu hier?{' '}
        <Link href="#" className="text-lake-700">
          Mitglied werden
        </Link>
      </div>
    </main>
  );
}
