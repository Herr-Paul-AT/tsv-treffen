import type { Metadata } from 'next';
import { BottomNav } from '@/components/nav/BottomNav';

// Mitgliederbereich nicht in Suchmaschinen.
export const metadata: Metadata = {
  title: 'Mitgliederbereich',
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-paper-100 pb-[calc(68px+env(safe-area-inset-bottom))]">
      {children}
      <BottomNav />
    </div>
  );
}
