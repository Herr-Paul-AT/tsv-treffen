# Go-Live: Supabase + Auth

Der Code ist vollständig vorbereitet. **Solange keine Supabase-Env-Variablen
gesetzt sind, läuft alles im Dev-Modus** (lokale PGlite-DB, fester Dev-User,
kein Login). Sobald die Variablen gesetzt sind, schalten echte Datenbank und
Anmeldung automatisch scharf — kein Code-Umbau nötig.

> Online gestellt wird erst, wenn alles fertig ist. Diese Anleitung kann auch
> rein lokal gegen Supabase getestet werden, bevor deployt wird.

---

## 1. Supabase-Projekt anlegen (kostenlos)

1. Auf <https://supabase.com> ein Projekt erstellen (Region: **EU – Frankfurt**).
2. Ein **Datenbank-Passwort** vergeben und notieren.

## 2. Zugangsdaten holen

**Settings → Database → Connection string → „Transaction pooler"**
→ ergibt `DATABASE_URL`.

**Settings → API**
→ `Project URL`, `anon public` key, `service_role` key.

## 3. `.env.local` anlegen (lokal) bzw. Env-Variablen in Vercel setzen

```bash
DATABASE_URL=postgres://postgres.PROJECT:PASSWORD@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
NEXT_PUBLIC_SITE_URL=http://localhost:3010   # bzw. die spätere Domain
```

## 4. Schema + Daten in Supabase bringen

Migrationen laufen gegen echtes Postgres **ohne** den PGlite-WASM-Bug:

```bash
# wendet alle Migrationen auf die Supabase-DB an
DATABASE_URL="postgres://…" npm run db:migrate

# optional: Demodaten laden (für einen ersten Test)
DATABASE_URL="postgres://…" npm run db:seed
```

Die echten Mitglieder kommen anschließend über **Admin → Mitglieder →
Importieren** (CSV) rein — wie lokal bereits getestet.

## 5. Auth in Supabase konfigurieren

**Authentication → Providers → Email** aktivieren.
Empfehlung für den Verein: **Magic Link** (kein Passwort nötig — Mitglieder
melden sich per E-Mail-Link an).

**Authentication → URL Configuration:**
- **Site URL**: die spätere Produktions-Domain
- **Redirect URLs** (beide eintragen):
  - `http://localhost:3010/auth/callback`
  - `https://DEINE-DOMAIN/auth/callback`

## 6. Wer darf rein?

Die App verknüpft Login ↔ Mitglied **über die E-Mail-Adresse**:
- Nur wer eine E-Mail hat, die als Mitglied in der DB steht, sieht sein Profil.
- `/admin` ist zusätzlich auf die Rollen **admin** und **obmann** beschränkt.

> Mitglieder ohne E-Mail (z. B. die importierten Ehepartner) können sich
> nicht per Magic-Link anmelden — das ist gewollt. Bei Bedarf später eine
> E-Mail nachtragen.

## 7. Testen

1. Dev-Server neu starten (`npm run dev`).
2. `/login` → E-Mail eines Mitglieds eingeben → „Magic-Link per E-Mail".
3. Link aus der Mail öffnen → landet eingeloggt im Dashboard.
4. `/admin` nur mit admin/obmann-Rolle erreichbar.

## 8. Deploy (erst wenn alles fertig)

- GitHub-Repo → Vercel verbinden.
- Dieselben Env-Variablen in Vercel hinterlegen (mit der echten Domain in
  `NEXT_PUBLIC_SITE_URL` und der Supabase Site-URL/Redirect-URL).
- `@electric-sql/pglite` ist als `serverExternalPackage` markiert und wird in
  Produktion nicht gebraucht (DATABASE_URL ist gesetzt → Postgres-Treiber).

---

### Zurück in den Dev-Modus
Einfach die `NEXT_PUBLIC_SUPABASE_*`-Variablen entfernen/auskommentieren →
die App nutzt wieder die lokale PGlite-DB und den Dev-User.
