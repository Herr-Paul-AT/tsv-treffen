# TSV Schloss Treffen — Design-System & Implementation Brief

> Dies ist das vollständige Handoff-Paket für die Implementierung der Vereinsplattform durch Claude Code (oder ein Entwicklerteam). Die Datei ist autoritativ — bei Konflikt mit einem Screenshot gilt diese Datei.

## Was wo liegt

| Datei | Zweck |
|---|---|
| `README.md` | Diese Datei — komplette Spec |
| `CLAUDE.md` | Project Rules für Claude Code (wird automatisch gelesen) |
| `01_logo_pitch.html` | Original-Pitch der drei Logo-Richtungen (Richtung 03 gewählt) |
| `02_design_system.html` | Visuelles Design-System mit Foundations, Komponenten, Mockups |
| `ds/icons.jsx` | Icon-Set (Outline, 24×24, stroke 1.6) |
| `ds/logo.jsx` | Logo-Komponenten (`TSVMark`, `TSVWordmark`, `TSVLockup`) |
| `ds/foundations.jsx` | Farben, Typo, Spacing, Shadow, Tailwind-Config |
| `ds/components.jsx` | Buttons, Forms, Cards, Nav, Badges, Avatars, Overlays |
| `ds/mockups.jsx` | Alle 9 Screen-Mockups als React-Komponenten |

---

## 1. Markenkern

**Verein**: TSV Schloss Treffen — Tennisverein, Marktgemeinde Treffen am Ossiachersee, Kärnten.

**Konzept**: „Landschaft & Verein" — der Tennisball geht als Sonne hinter der Gerlitzen auf, das Schloss Treffen steht im Tal, der Ossiachersee liegt im Vordergrund. Vier ortsbestimmende Zeichen in einer ruhigen Bildmarke.

**Tonalität**: hochwertig · regional verwurzelt · modern · zeitlos · Senioren-tauglich

---

## 2. Design Tokens

### Farben (Tailwind v4 `@theme` Block für `app/globals.css`)

```css
@import "tailwindcss";

@theme {
  /* ── LAKE — Primary (Ossiachersee) ──────────────── */
  --color-lake-50:  #F2F6F9;
  --color-lake-100: #E0EAF1;
  --color-lake-200: #BCCFDC;
  --color-lake-300: #92B0C4;
  --color-lake-400: #6691AC;
  --color-lake-500: #3A6985;   /* base */
  --color-lake-600: #2F586F;
  --color-lake-700: #244658;
  --color-lake-800: #1C3645;
  --color-lake-900: #142733;

  /* ── SAND — Accent (Sandplatz) ──────────────────── */
  --color-sand-50:  #FBF6F0;
  --color-sand-100: #F5EADB;
  --color-sand-200: #EAD2B5;
  --color-sand-300: #DCB388;
  --color-sand-400: #D0A075;
  --color-sand-500: #C39265;   /* base */
  --color-sand-600: #A6794E;
  --color-sand-700: #8A5F3D;
  --color-sand-800: #6E4A30;
  --color-sand-900: #523724;

  /* ── FOREST — Success (Gerlitzen-Wald) ──────────── */
  --color-forest-50:  #F2F6F2;
  --color-forest-100: #E0EBE1;
  --color-forest-200: #BFD3C1;
  --color-forest-300: #94B498;
  --color-forest-400: #6F9374;
  --color-forest-500: #4F6B53;
  --color-forest-600: #3F5742;
  --color-forest-700: #324434;
  --color-forest-800: #263429;
  --color-forest-900: #1A241D;

  /* ── STONE — Text & UI Chrome ───────────────────── */
  --color-stone-50:  #F7F6F3;
  --color-stone-100: #ECEAE3;
  --color-stone-200: #D6D2C8;
  --color-stone-300: #B3AFA3;
  --color-stone-400: #7E7C73;
  --color-stone-500: #5A595A;
  --color-stone-600: #3E4448;   /* base */
  --color-stone-700: #2D3134;
  --color-stone-800: #1F2224;
  --color-stone-900: #121314;

  /* ── PAPER — Warm Surfaces (Kalkstein) ──────────── */
  --color-paper-50:  #FBF8F1;
  --color-paper-100: #F5F1E5;   /* App-Default-Hintergrund */
  --color-paper-200: #EDE6D8;
  --color-paper-300: #DCD2BD;
  --color-paper-400: #C7B999;

  /* ── Semantic ───────────────────────────────────── */
  --color-success: #4F6B53;
  --color-warning: #B07A3D;
  --color-danger:  #A14841;
  --color-info:    #3A6985;

  /* ── Fonts ──────────────────────────────────────── */
  --font-display: 'Fraunces', serif;
  --font-sans:    'Manrope', system-ui, sans-serif;
  --font-mono:    'DM Mono', ui-monospace, monospace;

  /* ── Radii ──────────────────────────────────────── */
  --radius-xs:  2px;
  --radius-sm:  4px;
  --radius-md:  8px;
  --radius-lg:  12px;
  --radius-xl:  16px;
  --radius-2xl: 24px;

  /* ── Shadows ────────────────────────────────────── */
  --shadow-card:  0 1px 0 rgba(62,68,72,.04), 0 1px 2px rgba(62,68,72,.06);
  --shadow-pop:   0 4px 12px -2px rgba(62,68,72,.10), 0 2px 4px -2px rgba(62,68,72,.06);
  --shadow-modal: 0 24px 60px -12px rgba(20,30,40,.25), 0 8px 24px -8px rgba(20,30,40,.15);
}
```

### Typografie-Skala

| Rolle | Font | Größe | Zeilenhöhe | Letter-Spacing | Gewicht |
|---|---|---|---|---|---|
| Display | Fraunces | 56 px | 1.04 | -0.02 em | 500 |
| H1 | Fraunces | 40 px | 1.08 | -0.015 em | 500 |
| H2 | Fraunces | 32 px | 1.15 | -0.01 em | 500 |
| H3 | Manrope | 24 px | 1.2 | -0.005 em | 600 |
| H4 | Manrope | 20 px | 1.3 | — | 600 |
| Body L | Manrope | 18 px | 1.55 | — | 400 |
| Body | Manrope | **16 px** | 1.55 | — | 400 |
| Small | Manrope | 14 px | 1.5 | — | 500 |
| Caption | DM Mono | 12 px | 1.4 | 0.16 em | 500 |

**Body niemals unter 16 px.** Senioren müssen die App ohne Zoom benutzen können.

### Spacing — 4 px-Basis
Bevorzugt 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96.

### Radius
xs:2 · sm:4 · md:8 · lg:12 · xl:16 · 2xl:24 · sonst Pill (`rounded-full`).

### Shadow
`card` für Standard-Karten, `pop` für Dropdowns, `modal` für Modals/Sheets. Schwarz wird **nie** als Schatten-Farbe verwendet — immer rgba(62,68,72,…) (Stone-warm).

---

## 3. Logo-System

**Bildmarke**: kreisgerahmt 160 × 160 mit Tennisball als Sonne (rechts oben), Bergsilhouette, Schloss-Türme, drei Seelinien. Vier Varianten:

| Variante | Use |
|---|---|
| `color` | Default — Marketing, Header, Karten |
| `mono` | Stempel, Stickerei, Faxe |
| `negative` | Dark Surfaces, Hero |
| Skalierung 16/24/48/96/140 px | Funktioniert in allen Größen |

Wortmarke: **Fraunces 500 „Schloss Treffen"** + DM Mono Caps Sublabel „TSV · Tennis · Kärnten".

→ Source: `ds/logo.jsx` (`TSVMark`, `TSVWordmark`, `TSVLockup`)

---

## 4. Komponenten-Inventar

### Buttons
- **Varianten**: `primary` (lake-700), `secondary` (white/border), `ghost`, `accent` (sand-500), `destructive`
- **Größen**: sm (36 px), md (44 px), lg (48 px), xl (56 px)
- **Touch-Minimum**: 44 px für alle primären Aktionen auf Mobile
- Icons left/right via `icon` / `iconAfter` Props

### Form-Controls
- `TextField` mit optionalem Lead-Icon, Hint, Error-State
- `Select` (Custom-Dropdown, kein nativer Select)
- `Checkbox` (mit Indeterminate)
- `Radio`
- `Switch`

### Cards
- `NewsCard` — Bildplatzhalter oben, Pinned-Badge, Eyebrow, Titel, Excerpt, Meta-Footer
- `TerminCard` — Datums-Block links, Badge + Titel + Meta rechts; State: regular / cancelled / full
- `MemberCard` — Avatar + Name/Rolle + Member-Since + LK-Ranking

### Navigation
- `TopNav` — Desktop-Header, Logo + Menü + Search/Bell/Avatar
- `BottomNav` — Mobile 5-Tabs (Start, Kalender, Training, News, Profil)
- `MobileHeader` — In-App-Header mit optional Back-Button, Lead, Title, Action

### Badges & Status
- `Badge` — 7 Tones (neutral, lake, sand, forest, danger, warn, dark)
- `StatusDot` — animierter Ping-Indicator (5 Tones)

### Avatars
- `Avatar` — initials oder image, 4 Tones, 24–72 px
- `AvatarGroup` — gestapelt, mit Overflow-Bubble (+N)

### Overlays
- `Modal` — zentriert, mit Backdrop
- `Sheet` — Bottom-Sheet für Mobile mit Drag-Handle
- `Toast` — 3 Tones (forest/danger/sand)

→ Source: `ds/components.jsx`

---

## 5. Screens (alle 9 Mockups)

Jeder Screen ist in `ds/mockups.jsx` als React-Komponente vorhanden. **Das ist die pixel-genaue Referenz** — beim Implementieren danach bauen.

### 5.1 Landing (Public · Mobile)
- Hero mit Stone-800 Hintergrund, Wasserzeichen-Logo, Saison-Eyebrow, Headline „Tennis am Fuße der Gerlitzen.", 2 CTAs (Mitglied werden / Platz buchen)
- Stat-Card schwebend: 4 Plätze · 186 Mitglieder · 7 Mannschaften
- News-Liste (2 Karten)
- Sponsoren-Grid (3 × 2)

### 5.2 Login
- Logo Top, Begrüßung, E-Mail + Passwort, „Passwort vergessen?", Primary-Button + Ghost „Als Gast fortfahren", Mitglied-werden-Link

### 5.3 Dashboard (Member)
- MobileHeader „Servus, Martin"
- **Hero-Card Stone-800**: nächstes Training mit Zusagen-Button (Sand) + Absagen
- 3 Quick-Actions (Platz buchen, Kalender, Tabelle)
- News-Strip (2 Items)
- Platz-Status-Grid (4 Plätze mit StatusDot)
- BottomNav active=Start

### 5.4 News-Detail
- 280 px Hero-Bild mit Back/Star/More Pills
- Karte schwebt nach oben mit Eyebrow, Titel, Autor-Strip
- Body-Text in 3 Absätzen, Comments-Footer
- Sticky-CTA-Row: „Zum Doppel anmelden" + Kalender

### 5.5 Kalender
- MobileHeader + Plus-Button
- Filter-Chips (Alle/Training/Match/Events)
- Wochen-Switcher 7 Tage (aktiver Tag Lake-700)
- Stunden-Raster 14–21 Uhr mit farbcodierten Blöcken
- „Diese Woche"-Liste

### 5.6 Anwesenheit
- Hero-Karte mit Bild, Termin-Stats (Datum/Zeit/Plätze), Trainer-Strip
- 3-Segment-Button: Zusagen (Forest) / Vielleicht / Absagen
- Status-Hinweis „Du hast zugesagt · vor 12 Min"
- Roster: Zugesagt/Vielleicht/Abgesagt mit AvatarGroup

### 5.7 Profil
- Hero-Karte mit Avatar 72 px, Name, Member-Since, Role-Badges
- Stat-Tiles (Trainings / Bilanz / Anwesenheit %)
- Menü-Liste (Termine, Benachrichtigungen, Platzbuchungen, Mannschaft, Beitragskonto, Statuten)
- Abmelden-Button (Danger, ghost)

### 5.8 Platzbuchung
- Stat-Row (offene Slots, eigene Buchungen)
- 4 Court-Cards mit StatusDot
- **Dark CTA-Card Stone-800**: „Buchung läuft über eTennis." mit Accent-Button + External-Icon
- Regeln-Mini-Liste

### 5.9 Admin Mitgliederliste (Desktop)
- TopNav
- Header + Export-CSV + Mitglied-anlegen-Buttons
- 4 Stat-Tiles (Gesamt, Aktiv, Beiträge offen, Probemitglieder)
- Filter-Row mit Search (⌘K), Mannschaft/Status/Beitrag-Dropdowns
- Tabelle mit Checkbox/Avatar+Name+Email/Mannschaft/Status/LK/Beitrag/More
- Pagination

---

## 6. Beispieltexte (für Datenseeds)

**Mannschaften**: Herren I · Herren II · Damen 35+ · Damen 50+ · Jugend U10/U12/U14/U16

**Liga**: Bezirksliga Ost (Kärnten)

**Termine / News-Beispiele**:
- „Saisonstart 2026 am 12. April mit Eröffnungsdoppel"
- „Herren II gewinnt 5:1 gegen Villach"
- „Vereinsmeisterschaft 2026 — Anmeldung offen"
- „Sommerfest im Schlosshof am 21. Juni"
- „Training U12 am Mittwoch wurde abgesagt (Regen)"
- „Mannschaftstraining Herren II · Mi 18:00 · Platz 1 & 2 · Trainer M. Pirker"

**Sponsoren-Beispiele**: Raiffeisen Treffen · Gerlitzen Bergbahn · Seestern Marina · Brauerei Hirt · Wirt am See · Gemeinde Treffen

**Beispiel-Mitglieder** (komplette Liste in `ds/mockups.jsx`):
| Initials | Name | Rolle | Mannschaft | LK |
|---|---|---|---|---|
| MH | Martin Hofmann | Obmann | Herren II | 11.3 |
| KW | Katharina Wallner | Jugendleiterin | Damen 35+ | 9.7 |
| JS | Julian Steiner | Aktiv | Herren II | 14.1 |
| AB | Anna Brunner | Aktiv | Jugend U12 | — |

---

## 7. Integration: eTennis

Platzbuchung wird **nicht selbst gebaut** — externer Service eTennis.

- Vereinslogin via OAuth/SSO an eTennis weiterreichen (mit Vereinsmitgliedschaft als Claim)
- Dashboard zeigt eigene eTennis-Buchungen via API (read-only Pull)
- Court-Status-Grid auf Dashboard wird aus eTennis-API gespeist
- „Zu eTennis öffnen" Button = `target="_blank"` mit pre-filled SSO

---

## 8. Implementierungs-Reihenfolge

1. **Setup**: Next.js 15 + Tailwind v4 + TypeScript + next/font (Fraunces, Manrope, DM Mono)
2. **Tokens**: `app/globals.css` mit dem `@theme`-Block oben
3. **Brand**: `components/brand/Logo.tsx` aus `ds/logo.jsx`
4. **Icons**: `components/ui/Icon.tsx` aus `ds/icons.jsx`
5. **Primitives**: Button, TextField, Select, Checkbox, Radio, Switch, Badge, StatusDot, Avatar, AvatarGroup
6. **Cards**: NewsCard, TerminCard, MemberCard
7. **Navigation**: TopNav, BottomNav, MobileHeader
8. **Overlays**: Modal, Sheet, Toast (mit Radix `Dialog` für Focus-Trap)
9. **Layouts**: `app/layout.tsx` (Public), `app/app/layout.tsx` (Member, mit BottomNav), `app/admin/layout.tsx` (Desktop, mit TopNav)
10. **Pages**: Landing → Login → Dashboard → News-Detail → Kalender → Anwesenheit → Profil → Platzbuchung → Admin Mitglieder

---

## 9. Accessibility (verbindlich)

- **WCAG AA** für alle Token-Kombis
- **Body 16 px+**, Touch 44 px+
- **Sichtbarer Focus-Ring** auf allen interaktiven Elementen (`focus-visible:ring-2 ring-lake-500/40 ring-offset-2`)
- **`aria-label`** auf allen Icon-only-Buttons
- **`role="img"` + `aria-label`** auf SVG-Marks
- **Tastatur-Navigation** auf Modals/Sheets (Esc schließt, Focus-Trap, Tab-Order)

---

## 10. Was NICHT zu tun ist

Siehe auch `CLAUDE.md` — Kurzform:

- Kein shadcn, kein Bootstrap, kein Material
- Keine Standard-Lucide-Icons
- Keine Emoji in UI-Kopien
- Keine Gradient-Backgrounds außer dem Hero-Radial
- Body nie unter 16 px
- Touch-Targets nie unter 44 px
- Lorem-Ipsum verboten — Beispieltexte aus Abschnitt 6 verwenden

---

**Bei Fragen oder Konflikten**: erst `ds/*.jsx` als Source-of-Truth konsultieren, dann nachfragen.
