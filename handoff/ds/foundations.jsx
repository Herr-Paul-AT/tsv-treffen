/* ============================================================
   FOUNDATIONS — Colors, Type, Spacing, Radius, Shadow, Config
   ============================================================ */

/* —— Color data —— */
const COLOR_SCALES = [
  {
    name: 'Lake', role: 'Primary · Ossiachersee', key: 'lake',
    steps: [
      ['50','#F2F6F9'],['100','#E0EAF1'],['200','#BCCFDC'],['300','#92B0C4'],
      ['400','#6691AC'],['500','#3A6985','base'],['600','#2F586F'],
      ['700','#244658'],['800','#1C3645'],['900','#142733'],
    ],
  },
  {
    name: 'Sand', role: 'Accent · Sandplatz', key: 'sand',
    steps: [
      ['50','#FBF6F0'],['100','#F5EADB'],['200','#EAD2B5'],['300','#DCB388'],
      ['400','#D0A075'],['500','#C39265','base'],['600','#A6794E'],
      ['700','#8A5F3D'],['800','#6E4A30'],['900','#523724'],
    ],
  },
  {
    name: 'Forest', role: 'Success · Gerlitzen-Wald', key: 'forest',
    steps: [
      ['50','#F2F6F2'],['100','#E0EBE1'],['200','#BFD3C1'],['300','#94B498'],
      ['400','#6F9374'],['500','#4F6B53','base'],['600','#3F5742'],
      ['700','#324434'],['800','#263429'],['900','#1A241D'],
    ],
  },
  {
    name: 'Stone', role: 'Neutral · Text & UI', key: 'stone',
    steps: [
      ['50','#F7F6F3'],['100','#ECEAE3'],['200','#D6D2C8'],['300','#B3AFA3'],
      ['400','#7E7C73'],['500','#5A595A'],['600','#3E4448','base'],
      ['700','#2D3134'],['800','#1F2224'],['900','#121314'],
    ],
  },
];

const SEMANTIC = [
  { label:'Success', hex:'#4F6B53', use:'Bestätigungen, Anwesenheit zugesagt' },
  { label:'Warning', hex:'#B07A3D', use:'Vorbehalte, Wartelisten, Hinweise' },
  { label:'Danger',  hex:'#A14841', use:'Fehler, Absagen, Löschen' },
  { label:'Info',    hex:'#3A6985', use:'Allgemeine Informationen' },
];

/* —— Section wrapper —— */
function Section({ id, eyebrow, title, lead, children }) {
  return (
    <section id={id} className="border-t border-stone-200 bg-paper-50">
      <div className="max-w-[1280px] mx-auto px-12 py-24">
        <div className="grid grid-cols-12 gap-8 mb-16">
          <div className="col-span-3">
            <div className="font-mono text-xs text-stone-500 rule-eyebrow uppercase tracking-[0.18em]">
              {eyebrow}
            </div>
          </div>
          <div className="col-span-9 max-w-3xl">
            <h2 className="font-display font-medium text-[44px] leading-[1.05] tracking-[-0.015em] text-stone-800">
              {title}
            </h2>
            {lead && <p className="mt-5 text-[18px] leading-[1.55] text-stone-600 max-w-2xl">{lead}</p>}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

/* —— Sub-block heading —— */
function Block({ label, hint, children, cols = 12 }) {
  return (
    <div className="mb-16">
      <div className="flex items-baseline justify-between mb-5">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">{label}</h3>
        {hint && <span className="font-mono text-[11px] text-stone-400">{hint}</span>}
      </div>
      <div className={`grid grid-cols-${cols} gap-4`}>{children}</div>
    </div>
  );
}

/* ============================================================
   FOUNDATIONS · COLOR
   ============================================================ */
function FoundationsColor() {
  return (
    <div>
      {/* Big color scales */}
      {COLOR_SCALES.map((scale) => (
        <div key={scale.key} className="mb-10">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="font-display text-h3 text-stone-800">{scale.name}</span>
              <span className="ml-3 font-mono text-[11px] uppercase tracking-[0.18em] text-stone-400">{scale.role}</span>
            </div>
            <span className="font-mono text-[11px] text-stone-400">10 Stufen</span>
          </div>
          <div className="grid grid-cols-10 gap-[2px] overflow-hidden rounded-sm">
            {scale.steps.map(([step, hex, isBase]) => {
              const dark = parseInt(step) >= 500;
              return (
                <div key={step}
                  className="aspect-[3/4] flex flex-col justify-end p-3 relative"
                  style={{ background: hex, color: dark ? '#F5F1E5' : '#1F2224' }}>
                  {isBase && (
                    <span className="absolute top-2 right-2 font-mono text-[9px] uppercase tracking-[.16em] opacity-70">
                      Base
                    </span>
                  )}
                  <div className="font-mono text-[11px] opacity-70 uppercase tracking-wider">{scale.key}-{step}</div>
                  <div className="font-mono text-[12px] mt-0.5">{hex}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Semantic */}
      <Block label="Semantische Farben" hint="WCAG AA gegen Paper-100">
        {SEMANTIC.map((s) => (
          <div key={s.label} className="col-span-3 bg-white rounded-md border border-stone-200 overflow-hidden">
            <div className="h-20" style={{ background: s.hex }}/>
            <div className="p-4">
              <div className="flex items-baseline justify-between">
                <span className="font-display text-h4 text-stone-800">{s.label}</span>
                <span className="font-mono text-[11px] text-stone-500">{s.hex}</span>
              </div>
              <p className="mt-1 text-[13px] text-stone-500 leading-snug">{s.use}</p>
            </div>
          </div>
        ))}
      </Block>

      {/* Surface combos */}
      <Block label="Oberflächen · Surface-System">
        <div className="col-span-4 rounded-md overflow-hidden border border-stone-200">
          <div className="bg-paper-100 p-8 h-44 flex items-end">
            <span className="font-display text-h3 text-stone-800">Paper · 100</span>
          </div>
          <div className="bg-white px-5 py-3 font-mono text-[11px] text-stone-500 uppercase tracking-[0.14em] border-t border-stone-200">
            Standard-App-Hintergrund · #F5F1E5
          </div>
        </div>
        <div className="col-span-4 rounded-md overflow-hidden border border-stone-200">
          <div className="bg-white p-8 h-44 flex items-end">
            <span className="font-display text-h3 text-stone-800">Paper · 50 / Weiß</span>
          </div>
          <div className="bg-white px-5 py-3 font-mono text-[11px] text-stone-500 uppercase tracking-[0.14em] border-t border-stone-200">
            Karten, Modals, Eingabefelder
          </div>
        </div>
        <div className="col-span-4 rounded-md overflow-hidden border border-stone-700">
          <div className="bg-stone-800 p-8 h-44 flex items-end">
            <span className="font-display text-h3 text-paper-100">Stone · 800</span>
          </div>
          <div className="bg-stone-800 px-5 py-3 font-mono text-[11px] text-stone-300 uppercase tracking-[0.14em] border-t border-stone-700">
            Dark-Akzentflächen, Toasts, Hero
          </div>
        </div>
      </Block>
    </div>
  );
}

/* ============================================================
   FOUNDATIONS · TYPOGRAPHY
   ============================================================ */
function FoundationsType() {
  const samples = [
    { role:'Display · Fraunces 500', size:'56px', cls:'font-display text-[56px] leading-[1.04] tracking-[-0.02em] text-stone-800', text:'Schloss Treffen' },
    { role:'H1 · Fraunces 500',      size:'40px', cls:'font-display text-[40px] leading-[1.08] tracking-[-0.015em] text-stone-800', text:'Vereinsmeisterschaft 2026' },
    { role:'H2 · Fraunces 500',      size:'32px', cls:'font-display text-[32px] leading-[1.12] tracking-[-0.01em] text-stone-800', text:'Sommerfest im Schlosshof' },
    { role:'H3 · Manrope 600',       size:'24px', cls:'font-sans font-semibold text-[24px] leading-[1.2] text-stone-800', text:'Mannschaftsmeisterschaft Bezirksliga' },
    { role:'H4 · Manrope 600',       size:'20px', cls:'font-sans font-semibold text-[20px] leading-[1.3] text-stone-800', text:'Training U12 am Mittwoch' },
    { role:'Body Large · Manrope 400', size:'18px', cls:'font-sans text-[18px] leading-[1.55] text-stone-700', text:'Die Outdoor-Saison startet am 12. April mit dem traditionellen Eröffnungsdoppel.' },
    { role:'Body · Manrope 400',     size:'16px', cls:'font-sans text-[16px] leading-[1.55] text-stone-700', text:'Anmeldungen für das Vorbereitungstraining nehmen wir bis Ende März entgegen.' },
    { role:'Small · Manrope 500',    size:'14px', cls:'font-sans font-medium text-[14px] leading-[1.5] text-stone-600', text:'Trainer: M. Pirker · Platz 2 · Sandplatz' },
    { role:'Caption · DM Mono 500',  size:'12px', cls:'font-mono text-[12px] tracking-[0.16em] uppercase text-stone-500', text:'Saison · April – Oktober' },
  ];
  return (
    <div>
      <Block label="Type-Skala" hint="Body min. 16px · Senioren-tauglich">
        <div className="col-span-12 bg-white border border-stone-200 rounded-md overflow-hidden">
          {samples.map((s, i) => (
            <div key={i} className="grid grid-cols-12 px-7 py-6 border-b border-stone-100 last:border-b-0 items-baseline">
              <div className="col-span-3 font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
                {s.role}
                <div className="text-stone-400 normal-case tracking-normal mt-1">{s.size}</div>
              </div>
              <div className="col-span-9">
                <div className={s.cls}>{s.text}</div>
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Block label="Schriftpaarung · Lizenz">
        <div className="col-span-4 bg-white border border-stone-200 rounded-md p-7">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-sand-700">Display</span>
          <div className="font-display text-[64px] leading-none text-stone-800 mt-4">Fraunces</div>
          <p className="mt-3 text-[14px] text-stone-600 leading-snug">Optical-size Variable. Trägt das Wappen-Gefühl ins Web, ohne pathetisch zu werden.</p>
          <div className="font-mono text-[11px] text-stone-400 mt-4">Google Fonts · OFL · Variable</div>
        </div>
        <div className="col-span-4 bg-white border border-stone-200 rounded-md p-7">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-lake-600">Text</span>
          <div className="font-sans font-semibold text-[64px] leading-none text-stone-800 mt-4">Manrope</div>
          <p className="mt-3 text-[14px] text-stone-600 leading-snug">Hohe x-Höhe, sehr gut lesbar auf Mobile. Funktioniert von 14 px bis 32 px ohne Tradeoff.</p>
          <div className="font-mono text-[11px] text-stone-400 mt-4">Google Fonts · OFL · 200–800</div>
        </div>
        <div className="col-span-4 bg-white border border-stone-200 rounded-md p-7">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-forest-600">Caption</span>
          <div className="font-mono text-[56px] leading-none text-stone-800 mt-4">DM Mono</div>
          <p className="mt-3 text-[14px] text-stone-600 leading-snug">Labels, Daten, Mikro-Caps. Bringt die Vereinscharakter-Note rein, sparsam einsetzen.</p>
          <div className="font-mono text-[11px] text-stone-400 mt-4">Google Fonts · OFL · 400 / 500</div>
        </div>
      </Block>
    </div>
  );
}

/* ============================================================
   FOUNDATIONS · SPACING / RADIUS / SHADOW
   ============================================================ */
function FoundationsScales() {
  const spacings = [
    [1,4],[2,8],[3,12],[4,16],[5,20],[6,24],[8,32],[10,40],[12,48],[16,64],[20,80],[24,96],
  ];
  const radii = [
    ['xs',2],['sm',4],['md',8],['lg',12],['xl',16],['2xl',24],['full',999,'pill'],
  ];
  const shadows = [
    { name:'card',  cls:'shadow-card',  use:'Standard-Karten' },
    { name:'pop',   cls:'shadow-pop',   use:'Dropdowns, Tooltips' },
    { name:'modal', cls:'shadow-modal', use:'Modals, Sheets' },
  ];

  return (
    <div>
      {/* Spacing */}
      <Block label="Spacing · 4-px Basis" hint="Vorzugsweise 4 / 8 / 12 / 16 / 24 / 32 / 48">
        <div className="col-span-12 bg-white border border-stone-200 rounded-md p-8">
          <div className="space-y-3">
            {spacings.map(([n, px]) => (
              <div key={n} className="flex items-center gap-6">
                <div className="font-mono text-[11px] text-stone-500 w-14 uppercase tracking-[0.14em]">{n}</div>
                <div className="font-mono text-[12px] text-stone-700 w-14">{px}px</div>
                <div className="bg-lake-500 h-3 rounded-xs" style={{ width: px }}/>
              </div>
            ))}
          </div>
        </div>
      </Block>

      {/* Radius */}
      <Block label="Border-Radius" hint="Maximal 16 px, sonst pill">
        {radii.map(([k, v, label]) => (
          <div key={k} className="col-span-2 bg-white border border-stone-200 rounded-md p-5 flex flex-col gap-3">
            <div className="aspect-square bg-stone-100 border border-stone-200" style={{ borderRadius: label === 'pill' ? 999 : v }}/>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-stone-500">{k}</div>
              <div className="font-mono text-[12px] text-stone-700 mt-0.5">{label === 'pill' ? '999px (pill)' : `${v}px`}</div>
            </div>
          </div>
        ))}
      </Block>

      {/* Shadow */}
      <Block label="Shadow · Subtil & sand-warm" hint="rgba(62,68,72,…)">
        {shadows.map((s) => (
          <div key={s.name} className="col-span-4 bg-paper-100 rounded-md p-8">
            <div className={`h-32 bg-white rounded-md ${s.cls} flex items-center justify-center`}>
              <span className="font-display text-h3 text-stone-800">{s.name}</span>
            </div>
            <div className="mt-4 font-mono text-[11px] text-stone-500 uppercase tracking-[0.14em]">{s.use}</div>
          </div>
        ))}
      </Block>
    </div>
  );
}

/* ============================================================
   FOUNDATIONS · TAILWIND CONFIG SNIPPET
   ============================================================ */
function FoundationsConfig() {
  const code = `// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  theme: {
    extend: {
      colors: {
        lake:   { 50:'#F2F6F9', 100:'#E0EAF1', 200:'#BCCFDC', 300:'#92B0C4',
                  400:'#6691AC', 500:'#3A6985', 600:'#2F586F', 700:'#244658',
                  800:'#1C3645', 900:'#142733' },
        sand:   { 50:'#FBF6F0', 100:'#F5EADB', 200:'#EAD2B5', 300:'#DCB388',
                  400:'#D0A075', 500:'#C39265', 600:'#A6794E', 700:'#8A5F3D',
                  800:'#6E4A30', 900:'#523724' },
        forest: { 50:'#F2F6F2', 100:'#E0EBE1', 200:'#BFD3C1', 300:'#94B498',
                  400:'#6F9374', 500:'#4F6B53', 600:'#3F5742', 700:'#324434',
                  800:'#263429', 900:'#1A241D' },
        stone:  { 50:'#F7F6F3', 100:'#ECEAE3', 200:'#D6D2C8', 300:'#B3AFA3',
                  400:'#7E7C73', 500:'#5A595A', 600:'#3E4448', 700:'#2D3134',
                  800:'#1F2224', 900:'#121314' },
        paper:  { 50:'#FBF8F1', 100:'#F5F1E5', 200:'#EDE6D8', 300:'#DCD2BD' },
        success:'#4F6B53', warning:'#B07A3D', danger:'#A14841', info:'#3A6985',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans:    ['Manrope',  'system-ui', 'sans-serif'],
        mono:    ['DM Mono',  'ui-monospace', 'monospace'],
      },
      borderRadius: { xs:'2px', sm:'4px', md:'8px', lg:'12px', xl:'16px', '2xl':'24px' },
      boxShadow: {
        card:  '0 1px 0 rgba(62,68,72,.04), 0 1px 2px rgba(62,68,72,.06)',
        pop:   '0 4px 12px -2px rgba(62,68,72,.10), 0 2px 4px -2px rgba(62,68,72,.06)',
        modal: '0 24px 60px -12px rgba(20,30,40,.25), 0 8px 24px -8px rgba(20,30,40,.15)',
      },
    },
  },
} satisfies Config;`;

  return (
    <Block label="Tailwind Config" hint="Copy & paste-bereit">
      <div className="col-span-12 bg-stone-900 rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-3 border-b border-stone-800">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-400">tailwind.config.ts</span>
          <span className="font-mono text-[11px] text-stone-500">v4-ready</span>
        </div>
        <pre className="p-6 font-mono text-[12.5px] leading-[1.65] text-paper-100 overflow-x-auto"><code>{code}</code></pre>
      </div>
    </Block>
  );
}

Object.assign(window, {
  Section, Block,
  FoundationsColor, FoundationsType, FoundationsScales, FoundationsConfig,
});
