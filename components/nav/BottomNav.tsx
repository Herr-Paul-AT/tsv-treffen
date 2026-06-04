'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';

const ITEMS = [
  { href: '/app/dashboard', label: 'Start', Icon: Icon.Home },
  { href: '/app/kalender', label: 'Kalender', Icon: Icon.Calendar },
  { href: '/app/trainings/heute', label: 'Training', Icon: Icon.Ball },
  { href: '/app/news', label: 'News', Icon: Icon.News },
  { href: '/app/profil', label: 'Profil', Icon: Icon.User },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Hauptnavigation"
      className="fixed bottom-0 left-0 right-0 z-40 h-[68px] bg-white border-t border-stone-200 grid grid-cols-5 px-2 pb-2 pt-1.5"
    >
      {ITEMS.map(({ href, label, Icon: I }) => {
        const active =
          pathname === href ||
          (href !== '/app/dashboard' && pathname?.startsWith(href.replace(/\/[^/]+$/, '')));
        return (
          <Link
            key={href}
            href={href}
            className={[
              'flex flex-col items-center justify-center gap-0.5 rounded-md',
              active ? 'text-lake-700' : 'text-stone-500',
            ].join(' ')}
          >
            <I />
            <span className="text-[10.5px] font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
