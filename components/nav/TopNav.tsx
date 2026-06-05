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
      <div className="h-16 px-6 flex items-center gap-4">
        <Link href="/admin" className="shrink-0">
          <TSVLockup height={36} />
        </Link>

        {/* Mittlere Navigation — scrollt horizontal, falls zu viele Punkte */}
        <nav className="flex items-center gap-1 flex-1 min-w-0 overflow-x-auto">
          {ITEMS.map((it) => {
            const active = pathname === it.href || (it.href !== '/admin' && pathname?.startsWith(it.href));
            return (
              <Link
                key={it.href}
                href={it.href}
                className={[
                  'px-3 h-9 inline-flex items-center text-[14px] rounded-md font-medium whitespace-nowrap',
                  active ? 'bg-stone-100 text-stone-800' : 'text-stone-600 hover:bg-stone-100',
                ].join(' ')}
              >
                {it.label}
              </Link>
            );
          })}
        </nav>

        {/* Rechter Bereich — bleibt immer sichtbar */}
        <div className="shrink-0 flex items-center gap-2">
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
      </div>
    </header>
  );
}
