import { BottomNav } from '@/components/nav/BottomNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-paper-100 pb-[68px]">
      {children}
      <BottomNav />
    </div>
  );
}
