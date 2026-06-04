# TSV Schloss Treffen — Claude Code Project Rules

Du implementierst die Vereinsplattform **TSV Schloss Treffen** als Next.js 15 + Tailwind v4 + TypeScript Web-App / PWA.

Diese Datei wird beim Start automatisch gelesen. Halte dich an die Regeln, ohne sie bei jedem Schritt zu wiederholen.

---

## Stack (verbindlich)

- **Framework**: Next.js 15 (App Router) + React 19
- **Sprache**: TypeScript strict
- **Styling**: Tailwind v4 (CSS-first config, keine `tailwind.config.ts` mehr — Tokens via `@theme` in `app/globals.css`)
- **UI-Primitives**: Eigene Komponenten in `components/ui/` (kein shadcn-Import, kein Radix-Import außer wo nötig für a11y wie Dialog, Popover)
- **Icons**: Eigenes `<Icon/>`-Set inline-SVG (siehe `ds/icons.jsx`). Kein lucide-react / heroicons.
- **Fonts**: `next/font/google` — Fraunces, Manrope, DM Mono
- **State**: Server Components + Server Actions wo möglich. `zustand` nur für echte Client-State-Inseln.
- **Auth**: Auth.js (next-auth v5) — Credentials + Magic Link
- **DB**: Postgres + Drizzle ORM
- **PWA**: `next-pwa` oder `serwist`

## Bereiche

```
/                      Public Landing
/login                 Auth
/app                   Mitgliederbereich (auth required)
  /dashboard
  /kalender
  /news/[slug]
  /trainings/[id]      Anwesenheit
  /platzbuchung        → leitet zu eTennis
  /profil
/admin                 (role: admin)
  /mitglieder
  /news
  /trainings
```

## Design Tokens

**Alle Tokens stammen aus `README.md` und `ds/foundations.jsx`. Nicht erfinden, nicht abweichen.**

In `app/globals.css`:
```css
@import "tailwindcss";

@theme {
  --color-lake-500: #3A6985;
  /* ...komplette Palette siehe README.md */

  --font-display: 'Fraunces', serif;
  --font-sans: 'Manrope', system-ui, sans-serif;
  --font-mono: 'DM Mono', ui-monospace, monospace;

  /* Shadows, Radii usw. — siehe README */
}

@layer base {
  body { @apply bg-paper-100 text-stone-800 font-sans; }
}
```

## Implementierungs-Reihenfolge

1. **Setup**: Next.js + Tailwind v4 + Fonts (next/font) + Tokens in `globals.css`
2. **Logo**: `components/brand/Logo.tsx` aus `ds/logo.jsx` portieren (`<TSVMark/>`, `<TSVWordmark/>`, `<TSVLockup/>`)
3. **Icons**: `components/ui/Icon.tsx` aus `ds/icons.jsx`
4. **Primitives**: Button, TextField, Select, Checkbox, Radio, Switch, Badge, StatusDot, Avatar, AvatarGroup (`components/ui/`)
5. **Cards**: NewsCard, TerminCard, MemberCard (`components/cards/`)
6. **Navigation**: TopNav (Desktop), BottomNav (Mobile), MobileHeader (`components/nav/`)
7. **Overlays**: Modal, Sheet, Toast (`components/overlays/`) — hier ist Radix/Headless UI ok für Focus-Trap & a11y
8. **Pages** in dieser Reihenfolge:
   - Public Landing (`app/page.tsx`)
   - Login (`app/login/page.tsx`)
   - Dashboard (`app/app/dashboard/page.tsx`)
   - News-Detail + Kalender + Anwesenheit + Profil + Platzbuchung
   - Admin-Mitgliederliste

Jede Page hat in `ds/mockups.jsx` ein React-Pendant (`Screen<Name>`) als pixel-genaue Referenz.

## Senioren-Tauglichkeit (nicht verhandelbar)

- **Body min. 16 px**, niemals kleiner für Lese-Content
- **Touch-Targets min. 44 × 44 px**
- **Kontrast WCAG AA** — alle Token-Kombis aus `README.md` sind geprüft
- **Keine reine Icon-Buttons ohne Label** in primären Aktionen — Touch-Targets brauchen Text
- **Keine Hover-only Disclosures** auf Mobile

## Verbote

- ❌ Kein **shadcn/ui** als Drop-in (Look ist zu generisch)
- ❌ Kein **bootstrap**, **material-ui**, **chakra**
- ❌ Keine **Emoji** in der UI (außer wenn der User Inhalt erstellt)
- ❌ Keine **Gradient-Backgrounds** außer dem `radial-gradient` in der Hero (siehe Mockups)
- ❌ Keine **Standard-Lucide-Icons** — alle aus dem internen Set
- ❌ Keine **anderen Fonts** als Fraunces / Manrope / DM Mono
- ❌ Keine **abgerundeten Ecken > 16 px**, außer Pills (`rounded-full`)
- ❌ Keine **Heller-als-Paper-100** Hintergründe für ganze Seiten (außer reine Karten-Innenflächen)

## Bilder & Inhalte

- Vereins-Fotos kommen später vom User — **Platzhalter** mit `ph-stripe`/`ph-lake`/`ph-sand` Pattern verwenden (siehe `design-system.html`).
- Beispieltexte aus `README.md` übernehmen — keine Lorem-Ipsum-Wüste.
- Vereinsname **ohne Bindestrich-Logo**: „TSV Schloss Treffen". Nie „TSV-Schloss-Treffen" oder „Schloss-Treffen TSV".

## Wenn du etwas erweiterst

- **Neue Komponente nötig?** Erst checken, ob `ds/components.jsx` schon was Vergleichbares hat. Dann im selben visuellen Vokabular bauen (gleiche Border, gleiche Radius, gleiche Schatten-Stufe).
- **Neue Farbe nötig?** Aus den 4 bestehenden Skalen (lake/sand/forest/stone) wählen, nicht erfinden. Neue Hues nur nach Rückfrage.
- **Neue Page nötig?** Layout-Muster aus den Mockups übernehmen: `MobileHeader` oben, `BottomNav` unten, dazwischen scrollbarer Content mit `px-5 pb-24`.

## Folder-Struktur (Vorgabe)

```
app/
  layout.tsx
  page.tsx                       (Landing)
  globals.css                    (Tokens)
  login/page.tsx
  app/
    layout.tsx                   (mit BottomNav)
    dashboard/page.tsx
    kalender/page.tsx
    news/[slug]/page.tsx
    trainings/[id]/page.tsx
    profil/page.tsx
    platzbuchung/page.tsx
  admin/
    layout.tsx                   (mit TopNav)
    mitglieder/page.tsx

components/
  brand/Logo.tsx
  ui/Button.tsx | Icon.tsx | TextField.tsx | Badge.tsx | Avatar.tsx | ...
  cards/NewsCard.tsx | TerminCard.tsx | MemberCard.tsx
  nav/TopNav.tsx | BottomNav.tsx | MobileHeader.tsx
  overlays/Modal.tsx | Sheet.tsx | Toast.tsx

lib/
  auth.ts
  db/schema.ts
  utils.ts

public/
  fonts/                         (falls self-hosted)
  brand/                         (Logo SVGs)
```

## Commit-Stil

Conventional Commits, Deutsch ok:
```
feat(ui): Button mit allen 5 Varianten und 4 Größen
feat(landing): Hero, Stats, News, Sponsoren
fix(kalender): Stundenraster auf Mobile zentrieren
```

## Bei Unsicherheit

Schau in `ds/*.jsx` — dort steht die autoritative Referenz. Wenn dort nichts passt, frag, statt zu erfinden.
