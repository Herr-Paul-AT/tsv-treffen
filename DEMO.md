# TSV Schloss Treffen — Demo-Walkthrough

Stand: Mai 2026. Vor dem Termin **einmal frisch aufsetzen**, dann den Pfad unten von oben nach unten klicken.

## Vorbereitung (5 Minuten vor dem Termin)

```bash
cd "~/Desktop/TSV Treffen"
# DB zurücksetzen, damit alle Datumsangaben (Geburtstage in "X Tagen",
# nächstes Training "in 4 Tagen", Mahnungen) relativ zu heute frisch sind:
npm run db:reset

# Dev-Server starten:
npm run dev
# → http://localhost:3010
```

Bei einem PGlite-WASM-Fehler (`Aborted()`) im Log: Server stoppen, dann
`rm -rf data/pglite .next && npm run db:reset && npm run dev`. Das passiert
nur wenn Server ungeplant abgestürzt ist.

---

## Demo-Pfad (15–20 Minuten)

### 1. Öffentliche Landing — _„So sehen Sie uns von außen"_
`http://localhost:3010/`

- **Hero**: Wasserzeichen-Logo, Saison-Eyebrow, Headline „Tennis am Fuße der Gerlitzen."
- **Stat-Card schwebend** (4 Plätze · 10 Mitglieder · 8 Mannschaften) — Zahlen kommen aus DB
- Scrollen: Über den Verein, Anlage, Mannschaften (alle 8), Trainingszeiten, Mitgliedschaft (3 Pakete), Events 2026, News (3 Karten aus DB), FAQ, Anfahrt, Sponsoren
- **Pointe**: „Bevor wir uns ins Mitgliederbereich klicken — das hier ist die
  Visitenkarte für Schnupperer, Sponsoren und neue Mitglieder."

### 2. Mitglieder-App auf Mobile — _„Was Ihre Mitglieder im Alltag sehen"_

> Browser-DevTools auf Mobile-Viewport (375×812 iPhone) umschalten.

#### 2a. Dashboard `/app/dashboard`
- Persönliche Begrüßung („Servus, Martin")
- **Dunkle Hero-Karte**: nächstes Training mit Datum, Uhrzeit, Platz, Teilnehmer-Count
- Buttons „Zusagen / Vielleicht / Absagen" — **echte Server-Action**, schreibt in DB
- Quick-Actions: Platz buchen, Kalender, Tabelle
- News-Strip (2 Items)
- Court-Status-Grid

#### 2b. Kalender `/app/kalender`
- Wochen-Switcher mit Datums-Pillen
- Stundenraster 14–21 Uhr mit farbcodierten Blöcken (Training / Match / Event)
- Filter-Chips
- Klick auf einen Block → Trainings-Detail

#### 2c. Trainings-Detail `/app/trainings/{id}`
- Hero-Karte mit Datum, Trainer, Plätzen
- **3-Segment-RSVP**: Klick auf „Absagen" → State ändert sich, „Du hast abgesagt · in 0 Min" erscheint
- **Roster live**: Zugesagt / Vielleicht / Abgesagt mit Avatars — neu laden zeigt deine Änderung
- _Pointe_: „Trainer sieht sofort wer kommt, ohne WhatsApp-Hin-und-Her."

#### 2d. News `/app/news`
- Liste mit Pin-Indicator, Eyebrow, Excerpt
- Klick → `/app/news/saisonstart-2026` → vollständiger Beitrag mit Autor, Hero-Bild

#### 2e. Profil `/app/profil`
- Avatar 72px, Name, Mitglied seit, Rolle, LK-Rating
- Stats: Trainings dieses Jahr, Anwesenheits-%
- Menü: **Beitragskonto**, **Dokumente**, Mannschaft, …
- Klick auf „Beitragskonto" → Saldo + Rechnungen + IBAN-Hinweis
- Klick auf „Dokumente" → Statuten, Beitragsordnung, Protokolle als PDF-Liste

#### 2f. Platzbuchung `/app/platzbuchung`
- Court-Status, eigene Buchungen
- **Dunkle CTA-Karte**: „Buchung läuft über eTennis." → externer Link
- _Pointe_: „eTennis bleibt für die eigentliche Buchung. Wir spiegeln nur den
  Status. Geplante zweite Stufe: SSO und API-Pull, sodass kein Doppel-Login
  nötig ist."

#### 2g. PWA-Installation
- In Chrome / Safari: Adressleiste → „Zum Homescreen / App installieren"
- App startet ohne Browser-Chrome, Icon mit TSV-Mark, Offline-Fallback funktioniert (Netzwerk in DevTools auf „Offline" → `/app/dashboard` zeigt freundliche „Offline"-Seite)

### 3. Admin / Vorstand — _„Was der Vorstand sieht"_

> Viewport zurück auf Desktop.

#### 3a. Admin-Übersicht `/admin`
- **4 KPI-Tiles** live: Mitglieder · Beiträge % · Trainings · Geburtstage
- **8 Modul-Karten** mit Live-Hints
- **Bottom-Sektion**:
  - „Anstehende Geburtstage" (30 Tage Vorlauf, mit Alter)
  - „Aufmerksamkeit nötig" (Mitglieder ohne RSVP)
  - „Anstehende Termine" (Saison-Highlights)

#### 3b. Mitglieder `/admin/mitglieder`
- 4 Stat-Tiles, Such-/Filter-Leiste, Tabelle mit Avatar+Name, Mannschaft, Status, LK, Beitrags-Badge

#### 3c. Mannschaften `/admin/mannschaften`
- 8 Mannschafts-Karten mit Trainer, Spieler-Count, Bilanz, nächstem Termin, Roster-Avatars

#### 3d. Trainings & Termine `/admin/trainings`
- KPIs · Termine diese Woche · „Aufmerksamkeit nötig"-Spalte rechts · Schnellaktion „Reminder verschicken"

#### 3e. News `/admin/news`
- Redaktions-Tabelle mit Status-Badges, Autor, Datum

#### 3f. Beiträge `/admin/beitraege`
- **„€ 2.640 Soll · 84 % Quote · € 420 offen"**
- Rechnungs-Tabelle mit Mahnungs-Tagen
- Buttons „SEPA-XML exportieren" & „Mahnungen senden" (Vereinsplaner-Parität)

#### 3g. Rundmail `/admin/rundmail`
- Versand-Historie (gesendete + Entwurf)
- Compose-Karte rechts: Empfänger-Select, Betreff, Body
- _Pointe_: „Newsletter-Tool aus Vereinsplaner wäre der grobe Vergleich."

#### 3h. Dokumente `/admin/dokumente`
- Nach Kategorien gruppiert: Statuten, Beiträge, Protokolle, Spielregeln, Formulare
- Pin-Badge, Gültigkeitsdatum

---

## Was hinter der Oberfläche steckt

- **Next.js 16** (Turbopack) + **React 19** + **Tailwind v4**
- **PWA** über `@serwist/turbopack` — installierbar auf Mobile, Offline-Fallback
- **Datenbank** über **Drizzle ORM**:
  - Lokal: embedded **PGlite** (kein Install, lebt in `data/pglite/`)
  - Produktion: **Supabase Postgres** — einfach `DATABASE_URL` setzen, identisches Schema
- **15 Tabellen**: members, teams, team_members, trainings, attendances, news, news_reactions, comments, events, sponsors, courts, documents, newsletters, dues_periods, dues_invoices
- **Server Actions** für Schreib-Operationen (RSVP funktioniert live)
- **Auth** wird als nächster Schritt über **Supabase Auth** angebunden (Magic Link). Login-Page existiert als UI-Stub.

## Roadmap nach dem Demo

1. **Supabase einrichten** + DATABASE_URL setzen → echte Multi-Device-Datenbank
2. **Auth aktivieren** (Supabase, Magic Link)
3. **eTennis-API**: SSO-Weiterleitung + Read-only Court-Status-Pull
4. **Vercel-Deploy** (GitHub-Repo → Vercel-Connect)
5. **Echtes PDF-Upload** für Dokumente (Supabase Storage)
6. **Newsletter-Versand** echt (Resend / Postmark)
7. **Push-Notifications** über PWA (Web Push)

## Bekannte Stub-Bereiche

| Bereich | Stub-Verhalten |
|---|---|
| Login | Buttons & Felder da, kein Auth-Flow |
| Profil → Bearbeiten | Button vorhanden, kein Formular |
| Profil → Benachrichtigungen | Eintrag vorhanden, keine Settings |
| Admin → SEPA-Export / Mahnungen | Buttons vorhanden, keine Action |
| Admin → Rundmail „Senden" | Speichert nur Entwurf |
| eTennis | Externer Link statt API |
| Kommentare auf News-Detail | Tabelle in DB, kein Compose-UI |
| Star/Folgen auf News-Detail | Lokaler State, schreibt noch nicht in DB |
