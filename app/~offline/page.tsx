import { TSVMark } from '@/components/brand/Logo';

export const metadata = {
  title: 'Offline',
};

export default function OfflinePage() {
  return (
    <main className="min-h-dvh bg-paper-100 flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="inline-flex">
          <TSVMark size={96} variant="mono" />
        </div>
        <h1 className="font-display text-[32px] leading-[1.1] text-stone-800 mt-6">
          Gerade keine Verbindung.
        </h1>
        <p className="text-[16px] text-stone-600 leading-[1.55] mt-3">
          Die App ist offline. Sobald du wieder Netz hast, lädt die Seite automatisch neu.
        </p>
        <p className="font-mono text-[11px] text-stone-500 uppercase tracking-[0.18em] mt-6">
          TSV Schloss Treffen
        </p>
      </div>
    </main>
  );
}
