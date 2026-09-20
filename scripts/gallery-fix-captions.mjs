// Einmalig: Bildtexte laut Gert (Sept. 2026) setzen, #28 löschen, drei Fotos ergänzen.
import { config } from 'dotenv';
config({ path: '.env.local' });
config();
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';

const sql = postgres(process.env.DATABASE_URL, { prepare: false, max: 1 });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// sort_order → neuer Text (Nummern wie in /admin/galerie angezeigt)
const CAPTIONS = {
  0: 'Unsere Sandplätze mit Blick auf das Vereinshaus',
  3: 'Die Anlage aus der Vogelperspektive mit Blick auf das Schloss Treffen',
  4: 'Die Plätze mit Blick auf den Oswaldiberg',
  5: 'In Bewegung',
  6: 'Vorhand',
  7: 'Treffpunkt',
  12: 'Fokus',
  13: 'Der perfekte Aufwurf',
  16: 'Head Coach Selina',
  17: 'Trophy-Stellung Aufschlag',
  18: 'Return',
  19: 'Sweet Spot',
  20: 'Mit Herz dabei – unser Obmann',
  21: 'Platzpflege',
  22: 'Unser Kassier',
  24: 'Gemütlichkeit',
  27: 'Zeitlos',
  29: 'Fairplay, Freundschaft und Spaß am Spiel',
  30: 'Jugendtraining',
  31: 'Koordination',
};
const DELETE = [28];
// Ergänzungen: [Foto-Nr, Text]
const ADD = [
  [116, 'Die drei Plätze von oben'],
  [91, 'Unser Schriftführer Thomas'],
  [6, 'Coaching'],
];

let changed = 0;
for (const [order, caption] of Object.entries(CAPTIONS)) {
  const r = await sql`update gallery_images set caption=${caption} where sort_order=${Number(order)} returning id`;
  if (r.length) changed++;
  else console.log(`  !! kein Bild mit #${order}`);
}
console.log(`Texte aktualisiert: ${changed}/${Object.keys(CAPTIONS).length}`);
for (const order of DELETE) {
  const r = await sql`delete from gallery_images where sort_order=${order} returning caption`;
  console.log(r.length ? `  gelöscht #${order} („${r[0].caption}")` : `  !! #${order} nicht gefunden`);
}

const DIR = 'public/fotos';
const files = fs.readdirSync(DIR).filter((f) => /\.jpg$/i.test(f));
const byNum = new Map(files.map((f) => [Number((f.match(/\((\d+) von/) || [])[1]), f]));
const maxRow = await sql`select coalesce(max(sort_order),-1)::int m from gallery_images`;
let sort = maxRow[0].m + 1;
for (const [num, caption] of ADD) {
  const f = byNum.get(num);
  if (!f) { console.log(`  !! Nr ${num} fehlt`); continue; }
  const buf = await sharp(path.join(DIR, f)).resize(1600, 1600, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 82 }).toBuffer();
  const objPath = `galerie/foto-${String(num).padStart(3, '0')}.jpg`;
  const { error } = await supabase.storage.from(BUCKET_NAME()).upload(objPath, buf, { contentType: 'image/jpeg', upsert: true });
  if (error) { console.log(`  !! Upload Nr ${num}: ${error.message}`); continue; }
  const { data } = supabase.storage.from(BUCKET_NAME()).getPublicUrl(objPath);
  await sql`insert into gallery_images (url, caption, sort_order, active) values (${data.publicUrl}, ${caption}, ${sort++}, true)`;
  console.log(`  + Nr ${num} → „${caption}"`);
}
function BUCKET_NAME() { return 'public-assets'; }

const all = await sql`select sort_order, caption from gallery_images order by sort_order`;
console.log('\nGalerie jetzt (' + all.length + '):');
all.forEach((g) => console.log(`  #${g.sort_order} ${g.caption}`));
await sql.end();
