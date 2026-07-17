import { TSVMark } from '@/components/brand/Logo';
import { MobileHeader } from '@/components/nav/MobileHeader';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

const RESERVATION_URL = 'https://treffen.tennisplatz.info/reservierung';

export default function PlatzbuchungPage() {
  return (
    <>
      <MobileHeader title="Platz buchen" lead="Reservierung" />
      <div className="px-5 pb-8">
        {/* Externe Reservierung */}
        <div className="bg-stone-800 text-paper-50 rounded-xl p-5 sm:p-6 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10">
            <TSVMark size={140} variant="negative" />
          </div>
          <div className="relative">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-sand-300">
              Platzreservierung
            </div>
            <h3 className="font-display text-[22px] mt-2 leading-[1.15]">
              Online einen Platz reservieren.
            </h3>
            <p className="text-[14px] text-paper-100/80 mt-2 leading-[1.55]">
              Freie Zeiten ansehen und direkt buchen — über unser Reservierungssystem auf
              tennisplatz.info.
            </p>
            <a
              href={RESERVATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4"
            >
              <Button
                variant="accent"
                size="lg"
                iconAfter={<Icon.External size={16} />}
                className="w-full"
              >
                Zur Reservierung
              </Button>
            </a>
          </div>
        </div>

        <p className="mt-4 text-[13.5px] text-stone-500 leading-[1.55] text-center">
          Die Reservierung öffnet in einem neuen Tab.
        </p>
      </div>
    </>
  );
}
