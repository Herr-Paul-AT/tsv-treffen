/* ============================================================
   APP SHELL — Hero, Sticky SideNav, Sections
   ============================================================ */

function NavLink({ href, label, sub, active }) {
  return (
    <a href={href} className={[
      'block pl-5 -ml-px border-l py-1.5 transition-colors',
      active ? 'border-stone-800 text-stone-900' : 'border-stone-200 text-stone-500 hover:text-stone-800 hover:border-stone-400',
    ].join(' ')}>
      <div className="font-mono text-[10.5px] uppercase tracking-[0.16em]">{label}</div>
      {sub && <div className="text-[12px] mt-0.5 opacity-70">{sub}</div>}
    </a>
  );
}

function SideNav() {
  const [active, setActive] = React.useState('foundations');
  React.useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    document.querySelectorAll('section[id]').forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const items = [
    { id:'foundations',     label:'01 · Foundations',     sub:'Farbe · Typo · Spacing' },
    { id:'typography',      label:'02 · Typografie' },
    { id:'scales',          label:'03 · Spacing · Radius · Shadow' },
    { id:'config',          label:'04 · Tailwind Config' },
    { id:'components',      label:'05 · Komponenten' },
    { id:'mockups',         label:'06 · Screen Mockups',  sub:'8 mobile + 1 desktop' },
  ];

  return (
    <aside className="sticky top-24 w-[220px] flex-none">
      <div className="font-display text-[15px] text-stone-800 mb-4">Inhalt</div>
      <nav className="border-l border-stone-200">
        {items.map(it => (
          <NavLink key={it.id} href={`#${it.id}`} label={it.label} sub={it.sub} active={active === it.id}/>
        ))}
      </nav>
      <div className="mt-10 pt-6 border-t border-stone-200">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400">Version</div>
        <div className="font-display text-[18px] text-stone-700 mt-1">v0.1 · 2026</div>
        <p className="text-[12px] text-stone-500 mt-3 leading-snug">
          Greenfield-Marke für die neue Vereinsplattform. Basis: Richtung 03 — Landschaft &amp; Verein.
        </p>
      </div>
    </aside>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-paper-100/85 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-[1280px] mx-auto px-12 h-16 flex items-center justify-between">
        <TSVLockup height={32}/>
        <div className="flex items-center gap-6">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">Design System</span>
          <a href="#mockups" className="font-mono text-[11px] uppercase tracking-[0.18em] text-lake-700">Mockups ↓</a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-stone-900 text-paper-100">
      {/* Decorative big mark */}
      <div className="absolute -right-12 -top-16 opacity-[0.08]">
        <TSVMark size={620} variant="negative"/>
      </div>
      <div className="relative max-w-[1280px] mx-auto px-12 pt-28 pb-24">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-sand-300 rule-eyebrow">
          TSV Schloss Treffen · Kärnten · 2026
        </div>
        <h1 className="font-display font-medium text-[88px] leading-[0.95] tracking-[-0.02em] mt-8 max-w-[1000px]">
          Ein Design-System aus<br/>Berg, See und Sandplatz.
        </h1>
        <p className="text-[20px] leading-[1.55] text-paper-100/75 mt-8 max-w-[640px]">
          Token, Komponenten und Screens für die neue Vereinsplattform.
          Mobile-first, Senioren-tauglich, hochwertig — aufgebaut auf der
          Bildmarke „Landschaft &amp; Verein" mit dem Tennisball als Sonne über der Gerlitzen.
        </p>

        {/* Brand chips */}
        <div className="mt-12 grid grid-cols-5 gap-3 max-w-[860px]">
          {[
            ['Lake',   '#3A6985'],
            ['Sand',   '#C39265'],
            ['Forest', '#4F6B53'],
            ['Stone',  '#3E4448'],
            ['Paper',  '#EDE6D8'],
          ].map(([n, hex]) => (
            <div key={n} className="rounded-md overflow-hidden border border-white/10">
              <div className="h-16" style={{ background: hex }}/>
              <div className="bg-stone-900 px-3 py-2.5 flex items-baseline justify-between">
                <span className="font-display text-[15px] text-paper-100">{n}</span>
                <span className="font-mono text-[10.5px] text-paper-100/55">{hex}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-stone-900 text-paper-100/75 mt-24">
      <div className="max-w-[1280px] mx-auto px-12 py-16 grid grid-cols-12 gap-8">
        <div className="col-span-5">
          <TSVLockup height={40} color="#FBF8F1" accent="#C39265"/>
          <p className="text-[14px] mt-6 max-w-md leading-[1.6]">
            Tennisverein in Treffen am Ossiachersee · Kärnten · Österreich.
            Sandplatz-Tennis am Fuße der Gerlitzen, zwischen Schloss und See.
          </p>
        </div>
        <div className="col-span-3">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-paper-100/45">System</div>
          <ul className="mt-3 space-y-1.5 text-[14px]">
            <li><a href="#foundations">Foundations</a></li>
            <li><a href="#components">Komponenten</a></li>
            <li><a href="#mockups">Mockups</a></li>
            <li><a href="#config">Tailwind Config</a></li>
          </ul>
        </div>
        <div className="col-span-4">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-paper-100/45">Marke</div>
          <ul className="mt-3 space-y-1.5 text-[14px]">
            <li>Richtung 03 · Landschaft &amp; Verein</li>
            <li>Tennisball als Sonne über der Gerlitzen</li>
            <li>Fonts: Fraunces · Manrope · DM Mono</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-12 py-5 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-paper-100/45">
          <span>TSV Schloss Treffen — Design System v0.1</span>
          <span>Mai 2026</span>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <div className="bg-paper-100 text-stone-800">
      <Header/>
      <Hero/>

      <Section
        id="foundations"
        eyebrow="01 · Foundations"
        title="Farbe ist der schnellste Weg, regional zu klingen."
        lead="Vier benannte Hauptfarben aus der Landschaftsmarke, in 10 Stufen jeweils. Paper als warmer Default-Hintergrund. Semantische Farben spiegeln den Charakter, statt aus dem Bootstrap-Topf zu kommen."
      >
        <FoundationsColor/>
      </Section>

      <Section
        id="typography"
        eyebrow="02 · Typografie"
        title="Eine Display-Serife, eine ruhige Sans, ein Caps-Mono."
        lead="Fraunces für Charakter, Manrope für Lesbarkeit ab 14 px, DM Mono für die Vereinsfarbe in Labels. Body nie unter 16 px — die App muss auch mit 70+ funktionieren."
      >
        <FoundationsType/>
      </Section>

      <Section
        id="scales"
        eyebrow="03 · Spacing · Radius · Shadow"
        title="Ruhig skaliert, subtil schattiert."
        lead="4-Pixel-Basis, maximal 16 px Radius (sonst Pill), Shadows mit Stone statt Schwarz — alles, was der Marke einen warmen, gesetzten Charakter gibt statt SaaS-Plastik."
      >
        <FoundationsScales/>
      </Section>

      <Section
        id="config"
        eyebrow="04 · Tailwind Config"
        title="Eine Datei, eine Marke."
        lead="Token-Definitionen für Next.js-Setup. Direkt in den Repo legen — alle weiteren Designs kommen aus diesem File."
      >
        <FoundationsConfig/>
      </Section>

      <Section
        id="components"
        eyebrow="05 · Komponenten"
        title="Komponenten, die zusammen klingen."
        lead="Keine generischen shadcn-Renderings. Jede Komponente bezieht die Markensprache — von der Touch-Größe der Buttons (min. 44 px) bis zur Schraffur der Bildplatzhalter."
      >
        <ComponentShowcase/>
      </Section>

      <Section
        id="mockups"
        eyebrow="06 · Screen Mockups"
        title="Acht Screens am Handy, einer am Desktop."
        lead="Realistische App-Screens mit echtem Vereinsinhalt — Saisonstart, Bezirksliga, Sommerfest im Schlosshof, Anwesenheit beim Mittwochtraining. Keine Lorem-Ipsum-Wüste."
      >
        <MockupsShowcase/>
      </Section>

      <Footer/>
    </div>
  );
}

/* Mount */
const root = ReactDOM.createRoot(document.getElementById('root'));

/* Wrap with sticky sidenav layout */
function AppWithNav() {
  return (
    <div>
      <Header/>
      <Hero/>
      <div className="max-w-[1280px] mx-auto px-12">
        <div className="flex gap-12 pt-16">
          <SideNav/>
          <main className="flex-1 min-w-0 pb-16">
            <AppSections/>
          </main>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

function AppSections() {
  return (
    <div className="space-y-24">
      <section id="foundations">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500 rule-eyebrow">01 · Foundations</div>
        <h2 className="font-display font-medium text-[48px] leading-[1.05] tracking-[-0.015em] text-stone-800 mt-5">
          Farbe ist der schnellste Weg,<br/>regional zu klingen.
        </h2>
        <p className="text-[18px] leading-[1.55] text-stone-600 mt-5 max-w-2xl">
          Vier benannte Hauptfarben aus der Landschaftsmarke, jeweils in 10 Stufen. Paper als warmer
          Default-Hintergrund. Semantische Farben spiegeln den Charakter, statt aus dem Bootstrap-Topf zu kommen.
        </p>
        <div className="mt-12"><FoundationsColor/></div>
      </section>

      <section id="typography" className="pt-8 border-t border-stone-200">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500 rule-eyebrow mt-10">02 · Typografie</div>
        <h2 className="font-display font-medium text-[48px] leading-[1.05] tracking-[-0.015em] text-stone-800 mt-5">
          Eine Display-Serife, eine ruhige<br/>Sans, ein Caps-Mono.
        </h2>
        <p className="text-[18px] leading-[1.55] text-stone-600 mt-5 max-w-2xl">
          Fraunces für Charakter, Manrope für Lesbarkeit ab 14 px, DM Mono für die Vereinsfarbe in Labels.
          Body nie unter 16 px — die App muss auch mit 70+ funktionieren.
        </p>
        <div className="mt-12"><FoundationsType/></div>
      </section>

      <section id="scales" className="pt-8 border-t border-stone-200">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500 rule-eyebrow mt-10">03 · Spacing · Radius · Shadow</div>
        <h2 className="font-display font-medium text-[48px] leading-[1.05] tracking-[-0.015em] text-stone-800 mt-5">
          Ruhig skaliert,<br/>subtil schattiert.
        </h2>
        <p className="text-[18px] leading-[1.55] text-stone-600 mt-5 max-w-2xl">
          4-Pixel-Basis, maximal 16 px Radius (sonst Pill), Shadows mit Stone statt Schwarz — alles, was
          der Marke einen warmen, gesetzten Charakter gibt statt SaaS-Plastik.
        </p>
        <div className="mt-12"><FoundationsScales/></div>
      </section>

      <section id="config" className="pt-8 border-t border-stone-200">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500 rule-eyebrow mt-10">04 · Tailwind Config</div>
        <h2 className="font-display font-medium text-[48px] leading-[1.05] tracking-[-0.015em] text-stone-800 mt-5">
          Eine Datei,<br/>eine Marke.
        </h2>
        <p className="text-[18px] leading-[1.55] text-stone-600 mt-5 max-w-2xl">
          Token-Definitionen für Next.js-Setup. Direkt in den Repo legen — alle weiteren Designs kommen aus diesem File.
        </p>
        <div className="mt-12"><FoundationsConfig/></div>
      </section>

      <section id="components" className="pt-8 border-t border-stone-200">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500 rule-eyebrow mt-10">05 · Komponenten</div>
        <h2 className="font-display font-medium text-[48px] leading-[1.05] tracking-[-0.015em] text-stone-800 mt-5">
          Komponenten,<br/>die zusammen klingen.
        </h2>
        <p className="text-[18px] leading-[1.55] text-stone-600 mt-5 max-w-2xl">
          Keine generischen shadcn-Renderings. Jede Komponente bezieht die Markensprache — von der Touch-Größe
          der Buttons (min. 44 px) bis zur Schraffur der Bildplatzhalter.
        </p>
        <div className="mt-12"><ComponentShowcase/></div>
      </section>

      <section id="mockups" className="pt-8 border-t border-stone-200">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500 rule-eyebrow mt-10">06 · Screen Mockups</div>
        <h2 className="font-display font-medium text-[48px] leading-[1.05] tracking-[-0.015em] text-stone-800 mt-5">
          Acht Screens am Handy,<br/>einer am Desktop.
        </h2>
        <p className="text-[18px] leading-[1.55] text-stone-600 mt-5 max-w-2xl">
          Realistische App-Screens mit echtem Vereinsinhalt — Saisonstart, Bezirksliga, Sommerfest im
          Schlosshof, Anwesenheit beim Mittwochtraining. Keine Lorem-Ipsum-Wüste.
        </p>
        <div className="mt-16"><MockupsShowcase/></div>
      </section>
    </div>
  );
}

root.render(<AppWithNav/>);
