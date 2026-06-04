'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TSVLockup } from '@/components/brand/Logo';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';

const ITEMS = [
  { href: '/admin', label: 'Übersicht' },
  { href: '/admin/mitglieder', label: 'Mitglieder' },
  { href: '/admin/mannschaften', label: 'Mannschaften' },
  { href: '/admin/trainings', label: 'Trainings' },
  { href: '/admin/veranstaltungen', label: 'Veranstaltungen' },
  { href: '/admin/news', label: 'News' },
  { href: '/admin/beitraege', label: 'Beiträge' },
  { href: '/admin/rundmail', label: 'Rundmail' },
  { href: '/admin/dokumente', label: 'Dokumente' },
  { href: '/admin/platzbuchung', label: 'Plätze' },
];

export function TopNav() {
  const pathname = usePathname();
  return (
    <header className="bg-paper-50/95 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-30">
      <div className="h-16 px-8 flex items-center gap-8">
        <Link href="/admin" className="shrink-0">
          <TSVLockup height={36} />
        </Link>
        <nav className="flex items-center gap-1 ml-6">
          {ITEMS.map((it) => {
            const active = pathname === it.href || (it.href !== '/admin' && pathname?.startsWith(it.href));
            return (
              <Link
                key={it.href}
                href={it.href}
                className={[
                  'px-3 h-9 inline-flex items-center text-[14px] rounded-md font-medium',
                  active ? 'bg-stone-100 text-stone-800' : 'text-stone-600 hover:bg-stone-100',
                ].join(' ')}
              >
                {it.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            aria-label="Suche"
            className="w-11 h-11 inline-flex items-center justify-center rounded-md text-stone-600 hover:bg-stone-100"
          >
            <Icon.Search />
          </button>
          <button
            type="button"
            aria-label="Benachrichtigungen"
            className="relative w-11 h-11 inline-flex items-center justify-center rounded-md text-stone-600 hover:bg-stone-100"
          >
            <Icon.Bell />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-sand-500 ring-2 ring-paper-50" />
          </button>
          <Link href="/app/profil" className="ml-2" aria-label="Profil">
            <Avatar initials="MH" size={36} tone="lake" />
          </Link>
        </div>
      </div>
    </header>
  );
}
