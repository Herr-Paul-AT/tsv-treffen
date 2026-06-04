# TSV Schloss Treffen — Claude Code Project Rules

Du implementierst die Vereinsplattform **TSV Schloss Treffen** als Next.js + Tailwind v4 + TypeScript Web-App / PWA.

Diese Datei wird beim Start automatisch gelesen. Halte dich an die Regeln, ohne sie bei jedem Schritt zu wiederholen.

---

## Stack (verbindlich)

- **Framework**: Next.js (App Router) + React 19
- **Sprache**: TypeScript strict
- **Styling**: Tailwind v4 (CSS-first config, keine `tailwind.config.ts` mehr — Tokens via `@theme` in `app/globals.css`)
- **UI-Primitives**: Eigene Komponenten in `components/ui/` (kein shadcn-Import, kein Radix-Import außer wo nötig für a11y wie Dialog, Popover)
- **Icons**: Eigenes `<Icon/>`-Set inline-SVG (siehe `handoff/ds/icons.jsx`). Kein lucide-react / heroicons.
- **Fonts**: `next/font/google` — Fraunces, Manrope, DM Mono
- **State**: Server Components + Server Actions wo möglich. `zustand` nur für echte Client-State-Inseln.
- **Auth**: **Supabase Auth** (Magic Link + Credentials) — _geplant_, Login-Page derzeit UI-Stub. Kein next-auth.
- **DB**: Postgres + Drizzle ORM. **Lokal**: PGlite (embedded, in `./data/pglite`, kein Install). **Prod**: Supabase Postgres. Umschaltung allein über `DATABASE_URL` env (siehe `lib/db/index.ts`).
- **Hosting (geplant)**: Vercel + GitHub. Server Components / Server Actions kompatibel halten, keine Node-only-Imports in Client-Bundles. `@electric-sql/pglite` ist in `serverExternalPackages` und darf nicht in Client Components landen.
- **PWA**: `serwist` (geplant, noch nicht eingebaut)

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

## Handoff-Referenz

Im Ordner `handoff/` liegt das vollständige Design-System-Paket:
- `handoff/README.md` — komplette Spec (Tokens, Komponenten, Screens)
- `handoff/ds/logo.jsx` — Logo-Source (`TSVMark`, `TSVWordmark`, `TSVLockup`)
- `handoff/ds/icons.jsx` — Icon-Set (Outline, 24×24, stroke 1.6)
- `handoff/ds/components.jsx` — Primitives, Cards, Nav, Overlays
- `handoff/ds/mockups.jsx` — 9 Screen-Mockups (pixel-genaue Referenz)
- `handoff/02_design_system.html` — visuelle Showcase

**Bei Konflikt**: `handoff/README.md` ist autoritativ. Wenn dort nichts passt, in `ds/*.jsx` schauen.

## Design Tokens

Alle Tokens leben in `app/globals.css` im `@theme`-Block. Nicht erfinden, nicht abweichen.

## Implementierungs-Reihenfolge

1. ✅ **Setup**: Next.js + Tailwind v4 + Fonts (next/font) + Tokens in `globals.css`
2. ✅ **Logo**: `components/brand/Logo.tsx` (`<TSVMark/>`, `<TSVWordmark/>`, `<TSVLockup/>`)
3. ✅ **Icons**: `components/ui/Icon.tsx`
4. ✅ **Primitives**: Button, TextField, Badge, Avatar, AvatarGroup, StatusDot
5. **Weitere Primitives**: Select, Checkbox, Radio, Switch
6. **Cards**: NewsCard, TerminCard, MemberCard (`components/cards/`)
7. **Navigation**: TopNav, BottomNav, MobileHeader (`components/nav/`)
8. **Overlays**: Modal, Sheet, Toast (`components/overlays/`) — Radix für Focus-Trap & a11y
9. **Pages** in dieser Reihenfolge:
   - Public Landing (`app/page.tsx`)
   - Login (`app/login/page.tsx`)
   - Dashboard (`app/app/dashboard/page.tsx`)
   - News-Detail + Kalender + Anwesenheit + Profil + Platzbuchung
   - Admin-Mitgliederliste

Jede Page hat in `handoff/ds/mockups.jsx` ein React-Pendant (`Screen<Name>`) als pixel-genaue Referenz.

## Senioren-Tauglichkeit (nicht verhandelbar)

- **Body min. 16 px**, niemals kleiner für Lese-Content
- **Touch-Targets min. 44 × 44 px**
- **Kontrast WCAG AA** — alle Token-Kombis aus `handoff/README.md` sind geprüft
- **Keine reine Icon-Buttons ohne Label** in primären Aktionen — Touch-Targets brauchen Text
- **Keine Hover-only Disclosures** auf Mobile

## Verbote

- Kein **shadcn/ui** als Drop-in (Look ist zu generisch)
- Kein **bootstrap**, **material-ui**, **chakra**
- Keine **Emoji** in der UI (außer wenn der User Inhalt erstellt)
- Keine **Gradient-Backgrounds** außer dem `radial-gradient` in der Hero (siehe Mockups)
- Keine **Standard-Lucide-Icons** — alle aus dem internen Set
- Keine **anderen Fonts** als Fraunces / Manrope / DM Mono
- Keine **abgerundeten Ecken > 16 px**, außer Pills (`rounded-full`)
- Keine **Heller-als-Paper-100** Hintergründe für ganze Seiten (außer reine Karten-Innenflächen)

## Bilder & Inhalte

- Vereins-Fotos kommen später vom User — **Platzhalter** mit `ph-stripe`/`ph-lake`/`ph-sand` Pattern verwenden.
- Beispieltexte aus `handoff/README.md` übernehmen — keine Lorem-Ipsum-Wüste.
- Vereinsname **ohne Bindestrich-Logo**: „TSV Schloss Treffen". Nie „TSV-Schloss-Treffen" oder „Schloss-Treffen TSV".

## Folder-Struktur

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
  ui/Button.tsx | Icon.tsx | TextField.tsx | Badge.tsx | Avatar.tsx | StatusDot.tsx | ...
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

handoff/                         (Design-System-Referenz, im Repo)
```

## Commit-Stil

Conventional Commits, Deutsch ok:
```
feat(ui): Button mit allen 5 Varianten und 4 Größen
feat(landing): Hero, Stats, News, Sponsoren
fix(kalender): Stundenraster auf Mobile zentrieren
```

## Datenbank-Workflow

```
npm run db:generate   # Drizzle-Migrationen aus lib/db/schema.ts erzeugen
npm run db:migrate    # Migrationen anwenden (lokal: PGlite)
npm run db:seed       # Beispieldaten laden (lib/db/seed.ts)
npm run db:reset      # data/pglite löschen + migrate + seed (Dev-Reset)
npm run db:studio     # Drizzle Studio
```

- Schema: `lib/db/schema.ts` (11 Tabellen: members, teams, team_members, trainings, attendances, news, news_reactions, comments, events, sponsors, courts)
- Queries: `lib/db/queries/*.ts` (sind Server-Only — niemals in Client Components importieren)
- Aktueller User: `getCurrentMember()` aus `lib/db/queries/session.ts` (Stub via `DEV_USER_EMAIL`, wird durch Supabase-Session ersetzt)

## Bei Unsicherheit

Schau in `handoff/ds/*.jsx` — dort steht die autoritative Referenz. Wenn dort nichts passt, frag, statt zu erfinden.
