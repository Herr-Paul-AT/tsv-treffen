/**
 * Ladeanzeige beim Seitenwechsel (über loading.tsx): erscheint sofort nach dem
 * Tippen auf einen Menüpunkt, während der Server die Seite aufbaut.
 */
export function PageLoading({ label = 'Wird geladen …' }: { label?: string }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-stone-500" role="status">
      <svg className="animate-spin text-lake-700" width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.2" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <span className="font-mono text-[11px] uppercase tracking-[0.16em]">{label}</span>
    </div>
  );
}
