/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { TSVMark } from '@/components/brand/Logo';
import { Icon } from '@/components/ui/Icon';
import { listActiveGalleryImages } from '@/lib/db/queries/gallery';

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const images = await listActiveGalleryImages();

  return (
    <main className="min-h-dvh bg-paper-100">
      <div className="max-w-[1080px] w-full mx-auto px-6 sm:px-7 pt-10 pb-20">
        <Link href="/" aria-label="Zur Startseite" className="inline-block">
          <TSVMark size={56} variant="color" />
        </Link>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-stone-600 hover:text-stone-800"
        >
          <Icon.ArrowLeft size={14} /> Zurück zur Startseite
        </Link>

        <div className="mt-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500">
            TSV Schloss Treffen
          </span>
          <h1 className="font-display text-[32px] sm:text-[44px] leading-[1.05] text-stone-800 mt-2">
            Galerie
          </h1>
        </div>

        {images.length === 0 ? (
          <div className="mt-10 bg-white border border-stone-200 rounded-lg px-6 py-16 text-center">
            <p className="text-[15px] text-stone-600">Es sind noch keine Fotos veröffentlicht.</p>
            <p className="text-[13px] text-stone-500 mt-1.5">Bald gibt es hier Impressionen vom Verein.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {images.map((img) => (
              <figure key={img.id} className="rounded-lg overflow-hidden border border-stone-200 bg-white">
                <img
                  src={img.url}
                  alt={img.caption ?? 'Vereinsfoto'}
                  loading="lazy"
                  className="w-full h-44 sm:h-56 object-cover"
                />
                {img.caption && (
                  <figcaption className="px-3 py-2 text-[12.5px] text-stone-600 truncate">
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
