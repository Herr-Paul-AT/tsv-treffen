// Einmaliges Skript: kuratierte Fotos optimieren, in Supabase-Storage laden
// und als gallery_images-Zeilen eintragen. Lokal ausführen (nicht Teil der App).
import { config } from 'dotenv';
config({ path: '.env.local' });
config();
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';

const DIR = 'public/fotos';
const BUCKET = 'public-assets';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DB = process.env.DATABASE_URL;
if (!SUPABASE_URL || !KEY || !DB) throw new Error('Env fehlt (SUPABASE_URL / SERVICE_ROLE / DATABASE_URL).');

// Kuratierte Auswahl in Anzeige-Reihenfolge (Nummern aus den Kontaktbögen),
// jeweils mit kurzer Bildunterschrift.
const CURATED = [
  [121, 'Unsere Sandplätze mit Blick auf die Berge'],
  [124, 'Tennisanlage beim Schloss Treffen'],
  [122, 'Vogelperspektive auf die Plätze'],
  [118, 'Die Anlage im Grünen'],
  [112, 'Sandplätze vor der Gerlitzen'],
  [58, 'Aufschlag vor Bergpanorama'],
  [22, 'Vorhand am Netz'],
  [18, 'Volley im Training'],
  [33, 'Aufschlag'],
  [42, 'Match auf Sand'],
  [48, 'Rückhand'],
  [55, 'Sprungaufschlag'],
  [60, 'Konzentration am Platz'],
  [29, 'Beidhändige Rückhand'],
  [39, 'Damentraining'],
  [5, 'Kindertraining'],
  [63, 'Nachwuchs im Spiel'],
  [64, 'Jugendtraining'],
  [66, 'Junge Talente'],
  [67, 'Freude am Tennis'],
  [80, 'Mit Herz dabei'],
  [83, 'Unsere Trainer'],
  [88, 'Vereinsleben'],
  [96, 'Gemeinsam am Platz'],
  [102, 'Doppelpartner'],
  [99, 'Unser Vereinsheim'],
  [100, 'Stüberl & Bar'],
  [110, 'Clubhaus mit Seeblick'],
  [76, 'Fairplay'],
  [77, 'Nach dem Match'],
  [131, 'Doppel am Abend'],
  [9, 'Bereit für den nächsten Ballwechsel'],
  [107, 'TSV Schloss Treffen'],
];

const files = fs.readdirSync(DIR).filter((f) => /\.jpg$/i.test(f));
const byNum = new Map();
for (const f of files) {
  const m = f.match(/\((\d+) von/);
  if (m) byNum.set(Number(m[1]), f);
}

const supabase = createClient(SUPABASE_URL, KEY, { auth: { persistSession: false } });
const sql = postgres(DB, { prepare: false, max: 1 });

let sort = 0;
let ok = 0;
for (const [num, caption] of CURATED) {
  const f = byNum.get(num);
  if (!f) {
    console.log(`  !! Nr ${num} nicht gefunden`);
    continue;
  }
  const buf = await sharp(path.join(DIR, f))
    .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82 })
    .toBuffer();
  const objPath = `galerie/foto-${String(num).padStart(3, '0')}.jpg`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(objPath, buf, { contentType: 'image/jpeg', upsert: true });
  if (error) {
    console.log(`  !! Upload Nr ${num} fehlgeschlagen: ${error.message}`);
    continue;
  }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(objPath);
  await sql`insert into gallery_images (url, caption, sort_order, active) values (${data.publicUrl}, ${caption}, ${sort}, true)`;
  sort += 1;
  ok += 1;
  console.log(`  ✓ Nr ${num} (${Math.round(buf.length / 1024)} KB) → ${caption}`);
}

console.log(`\nFertig: ${ok}/${CURATED.length} Bilder in der Galerie.`);
await sql.end();
