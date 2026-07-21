'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TSVLockup } from '@/components/brand/Logo';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';

const ITEMS = [
  { href: '/admin', label: 'Übersicht' },
  { href: '/admin/mitglieder', label: 'Mitglieder' },
  { href: '/admin/anmeldungen', label: 'Anmeldungen' },
  { href: '/admin/mannschaften', label: 'Mannschaften' },
  { href: '/admin/trainings', label: 'Trainings' },
  { href: '/admin/veranstaltungen', label: 'Veranstaltungen' },
  { href: '/admin/news', label: 'News' },
  { href: '/admin/tarife', label: 'Tarife' },
  { href: '/admin/beitraege', label: 'Beiträge' },
  { href: '/admin/rundmail', label: 'Rundmail' },
  { href: '/admin/dokumente', label: 'Dokumente' },
  { href: '/admin/platz-programm', label: 'Am Platz' },
  { href: '/admin/faq', label: 'FAQ' },
  { href: '/admin/sponsoren', label: 'Sponsoren' },
  { href: '/admin/platzbuchung', label: 'Plätze' },
];

function isActive(pathname: string | null, href: string) {
  return pathname === href || (href !== '/admin' && pathname?.startsWith(href));
}

export function TopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Mobiles Menü bei Seitenwechsel schließen.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="bg-paper-50/95 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-30">
      <div className="h-16 px-4 sm:px-6 flex items-center gap-3">
        <Link href="/admin" className="shrink-0">
          <TSVLockup height={36} />
        </Link>

        {/* Desktop-Navigation */}
        <nav className="hidden md:flex items-center gap-1 flex-1 min-w-0 overflow-x-auto">
          {ITEMS.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={[
                'px-3 h-9 inline-flex items-center text-[14px] rounded-md font-medium whitespace-nowrap',
                isActive(pathname, it.href)
                  ? 'bg-stone-100 text-stone-800'
                  : 'text-stone-600 hover:bg-stone-100',
              ].join(' ')}
            >
              {it.label}
            </Link>
          ))}
        </nav>

        {/* Desktop: rechter Bereich */}
        <div className="hidden md:flex shrink-0 items-center gap-2">
          <Link
            href="/"
            className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-stone-200 bg-white text-[14px] font-medium text-stone-700 hover:bg-paper-100 whitespace-nowrap"
          >
            <Icon.Home size={16} />
            Zur Website
          </Link>
          <Link href="/app/profil" className="ml-1" aria-label="Profil">
            <Avatar initials="MH" size={36} tone="lake" />
          </Link>
        </div>

        {/* Mobile: Website-Link + Menü-Button */}
        <div className="md:hidden ml-auto flex items-center gap-2">
          <Link
            href="/"
            aria-label="Zur Website"
            className="w-11 h-11 inline-flex items-center justify-center rounded-md border border-stone-200 bg-white text-stone-700"
          >
            <Icon.Home size={18} />
          </Link>
          <button
            type="button"
            aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="w-11 h-11 inline-flex items-center justify-center rounded-md border border-stone-200 bg-white text-stone-700"
          >
            {open ? <Icon.Plus size={20} className="rotate-45" /> : <Icon.Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile: aufklappbares Menü */}
      {open && (
        <nav className="md:hidden border-t border-stone-200 bg-paper-50 px-3 py-3 max-h-[70dvh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-1.5">
            {ITEMS.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className={[
                  'px-4 h-12 inline-flex items-center text-[15px] rounded-md font-medium',
                  isActive(pathname, it.href)
                    ? 'bg-stone-800 text-paper-50'
                    : 'bg-white border border-stone-200 text-stone-700',
                ].join(' ')}
              >
                {it.label}
              </Link>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-stone-200 flex items-center gap-1.5">
            <Link
              href="/"
              className="flex-1 px-4 h-12 inline-flex items-center gap-2 rounded-md bg-white border border-stone-200 text-[15px] font-medium text-stone-700"
            >
              <Icon.Home size={18} /> Zur Website
            </Link>
            <Link
              href="/app/profil"
              className="flex-1 px-4 h-12 inline-flex items-center gap-2 rounded-md bg-white border border-stone-200 text-[15px] font-medium text-stone-700"
            >
              <Icon.User size={18} /> Profil
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
