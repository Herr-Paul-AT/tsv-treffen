import Link from 'next/link';
import { TSVMark } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

export default function MembershipThanksPage() {
  return (
    <main className="min-h-dvh bg-paper-100 flex flex-col">
      <div className="max-w-md w-full mx-auto px-7 pt-16 flex-1">
        <Link href="/" aria-label="Zur Startseite" className="inline-block">
          <TSVMark size={64} variant="color" />
        </Link>

        <div className="mt-10 w-14 h-14 rounded-full bg-forest-100 text-forest-700 inline-flex items-center justify-center">
          <Icon.Check size={28} />
        </div>

        <h1 className="font-display text-[32px] sm:text-[38px] leading-[1.08] text-stone-800 mt-6">
          Anmeldung erhalten.
        </h1>
        <p className="text-[16px] text-stone-600 mt-3 leading-[1.6]">
          Danke für dein Interesse am TSV Schloss Treffen! Wir haben deine Anmeldung erhalten und
          melden uns in Kürze persönlich bei dir. Bei Fragen erreichst du uns jederzeit unter{' '}
          <a href="mailto:office@tsv-treffen.at" className="text-lake-700 underline">
            office@tsv-treffen.at
          </a>
          .
        </p>

        <div className="mt-8">
          <Link href="/">
            <Button variant="primary" size="lg" iconAfter={<Icon.ArrowRight size={16} />}>
              Zur Startseite
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
