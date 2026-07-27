'use client';

import { useEffect } from 'react';

/**
 * Lädt die App automatisch neu, sobald eine neue Version (neuer Service Worker)
 * aktiv wird — so sehen Mitglieder nach einem Update sofort den neuen Stand,
 * ohne Cache manuell löschen zu müssen. Prüft zusätzlich beim Öffnen/Fokus
 * auf Updates.
 */
export function PwaAutoUpdate() {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;

    let refreshing = false;
    const reloadOnce = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };

    // Nur neu laden, wenn bereits ein Service Worker aktiv war (echtes Update),
    // nicht bei der allerersten Installation.
    const hadController = Boolean(navigator.serviceWorker.controller);
    if (hadController) {
      navigator.serviceWorker.addEventListener('controllerchange', reloadOnce);
    }

    // Beim Öffnen/Wieder-in-den-Vordergrund-Holen auf ein Update prüfen.
    const checkForUpdate = () => {
      navigator.serviceWorker
        .getRegistration()
        .then((reg) => reg?.update())
        .catch(() => {});
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible') checkForUpdate();
    };
    document.addEventListener('visibilitychange', onVisible);
    checkForUpdate();

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', reloadOnce);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return null;
}
