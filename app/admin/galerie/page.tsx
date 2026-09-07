/* eslint-disable @next/next/no-img-element */
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Icon } from '@/components/ui/Icon';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { listAllGalleryImages } from '@/lib/db/queries/gallery';
import { addGalleryImages, deleteGalleryImage } from '@/lib/actions/gallery';

export const dynamic = 'force-dynamic';

const fieldLabel = 'font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500';

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; added?: string }>;
}) {
  const sp = await searchParams;
  const images = await listAllGalleryImages();

  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
          Adminbereich · Verein
        </div>
        <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">Galerie</h1>
        <p className="text-[15px] text-stone-600 mt-2 max-w-2xl">
          Fotos für die öffentliche Galerie ({' '}
          <a href="/galerie" target="_blank" className="text-lake-700 underline">
            /galerie
          </a>
          ). Mehrere Bilder gleichzeitig hochladen möglich.
        </p>
      </div>

      {sp.error && (
        <div className="mt-5 max-w-2xl flex items-start gap-2.5 rounded-md bg-danger/5 border border-danger/20 px-4 py-3 text-[14px] text-danger">
          <Icon.Info size={16} className="flex-none mt-0.5" />
          <span>{sp.error}</span>
        </div>
      )}
      {sp.added && (
        <div className="mt-5 max-w-2xl flex items-start gap-2.5 rounded-md bg-forest-50 border border-forest-200 px-4 py-3 text-[14px] text-forest-800">
          <Icon.Check size={16} className="flex-none mt-0.5" />
          <span>Bild(er) hochgeladen.</span>
        </div>
      )}

      {/* Upload */}
      <form
        action={addGalleryImages}
        className="mt-6 max-w-2xl rounded-lg border border-stone-200 bg-white p-5 space-y-4"
        encType="multipart/form-data"
      >
        <div>
          <span className={fieldLabel}>Bilder</span>
          <input
            type="file"
            name="images"
            accept="image/png,image/jpeg,image/webp"
            multiple
            required
            className="mt-2 block w-full text-[14px] text-stone-700 file:mr-4 file:h-11 file:px-4 file:rounded-md file:border-0 file:bg-stone-800 file:text-paper-50 file:text-[14px] file:font-medium hover:file:bg-stone-700 file:cursor-pointer"
          />
          <p className="mt-1.5 text-[12.5px] text-stone-500">JPG, PNG oder WEBP, je max. 5 MB.</p>
        </div>
        <div className="grid sm:grid-cols-[1fr_160px] gap-4">
          <TextField label="Bildunterschrift (optional)" name="caption" placeholder="z. B. Sommercamp 2026" />
          <TextField label="Reihenfolge" name="sortOrder" defaultValue="0" placeholder="0" />
        </div>
        <Button type="submit" variant="primary" icon={<Icon.Upload size={16} />}>
          Hochladen
        </Button>
      </form>

      {/* Bestehende Bilder */}
      <div className="mt-8">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-[22px] text-stone-800">Bilder</h2>
          <span className="font-mono text-[11px] text-stone-500 uppercase tracking-[0.14em]">
            {images.length} gesamt
          </span>
        </div>
        {images.length === 0 ? (
          <div className="mt-4 bg-white border border-stone-200 rounded-lg px-5 py-10 text-center text-[14px] text-stone-500">
            Noch keine Bilder hochgeladen.
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img.id} className="rounded-lg border border-stone-200 bg-white overflow-hidden">
                <img src={img.url} alt={img.caption ?? ''} className="w-full h-40 object-cover" />
                <div className="p-3">
                  <div className="text-[13px] text-stone-700 truncate">{img.caption ?? '—'}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-mono text-[10.5px] text-stone-400 uppercase tracking-[0.12em]">
                      #{img.sortOrder}
                    </span>
                    <DeleteButton
                      action={deleteGalleryImage}
                      id={img.id}
                      label="Löschen"
                      confirmText="Dieses Bild wirklich aus der Galerie entfernen?"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
