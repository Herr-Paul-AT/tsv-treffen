/* ============================================================
   COMPONENTS — Buttons, Forms, Cards, Nav, Badges, Avatars, Overlays
   ============================================================ */

/* —— Button —— */
function Btn({ variant='primary', size='md', icon, iconAfter, children, disabled, className='' }) {
  const sizes = {
    sm: 'h-9 px-3.5 text-[14px] gap-1.5',
    md: 'h-11 px-5 text-[15px] gap-2',
    lg: 'h-12 px-6 text-[16px] gap-2.5',
    xl: 'h-14 px-8 text-[17px] gap-3',
  };
  const variants = {
    primary:    'bg-lake-700 text-paper-50 hover:bg-lake-800 border border-lake-800/40',
    secondary:  'bg-white text-stone-800 border border-stone-200 hover:bg-paper-100',
    ghost:      'bg-transparent text-stone-700 hover:bg-stone-100',
    accent:     'bg-sand-500 text-stone-900 hover:bg-sand-600 border border-sand-700/30',
    destructive:'bg-white text-danger border border-danger/30 hover:bg-danger hover:text-white',
  };
  const dis = disabled ? 'opacity-50 pointer-events-none' : '';
  return (
    <button disabled={disabled} className={[
      'inline-flex items-center justify-center font-medium rounded-md transition-colors',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-lake-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper-100',
      sizes[size], variants[variant], dis, className,
    ].join(' ')}>
      {icon}{children}{iconAfter}
    </button>
  );
}

/* —— Input / Select / Switch / Checkbox / Radio —— */
function TextField({ label, hint, leadIcon, value, placeholder, type='text', error }) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">{label}</span>
      <div className={[
        'mt-2 flex items-center gap-2.5 h-12 px-4 bg-white rounded-md border',
        error ? 'border-danger/60' : 'border-stone-200 focus-within:border-lake-500 focus-within:ring-2 focus-within:ring-lake-500/15',
      ].join(' ')}>
        {leadIcon && <span className="text-stone-400">{leadIcon}</span>}
        <input
          type={type} placeholder={placeholder} defaultValue={value}
          className="bg-transparent flex-1 text-[16px] text-stone-800 placeholder-stone-400 outline-none"/>
      </div>
      {(hint || error) && (
        <span className={`mt-1.5 block text-[13px] ${error ? 'text-danger' : 'text-stone-500'}`}>
          {error || hint}
        </span>
      )}
    </label>
  );
}

function Select({ label, value, items=[] }) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">{label}</span>
      <div className="mt-2 flex items-center justify-between gap-2 h-12 px-4 bg-white rounded-md border border-stone-200 cursor-pointer hover:border-stone-300">
        <span className="text-[16px] text-stone-800">{value}</span>
        <span className="text-stone-400"><I.ChevronDown/></span>
      </div>
    </label>
  );
}

function Checkbox({ label, checked, indeterminate }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <span className={[
        'mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-sm border transition-colors flex-none',
        checked || indeterminate
          ? 'bg-lake-700 border-lake-700 text-paper-50'
          : 'bg-white border-stone-300 hover:border-stone-400',
      ].join(' ')}>
        {checked && <I.Check size={14} stroke={2.4}/>}
        {indeterminate && <span className="w-2.5 h-0.5 bg-paper-50 rounded-full"/>}
      </span>
      <span className="text-[15px] text-stone-700 leading-tight">{label}</span>
    </label>
  );
}

function Radio({ label, checked }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <span className={[
        'mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full border transition-colors flex-none',
        checked ? 'border-lake-700' : 'border-stone-300 hover:border-stone-400',
      ].join(' ')}>
        {checked && <span className="w-2.5 h-2.5 rounded-full bg-lake-700"/>}
      </span>
      <span className="text-[15px] text-stone-700 leading-tight">{label}</span>
    </label>
  );
}

function Switch({ checked, label }) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer">
      <span className={[
        'relative inline-flex w-11 h-6 rounded-full transition-colors',
        checked ? 'bg-lake-600' : 'bg-stone-300',
      ].join(' ')}>
        <span className={[
          'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all',
          checked ? 'left-[22px]' : 'left-0.5',
        ].join(' ')}/>
      </span>
      {label && <span className="text-[15px] text-stone-700">{label}</span>}
    </label>
  );
}

/* —— Badge / Status —— */
function Badge({ tone='neutral', children, icon }) {
  const tones = {
    neutral: 'bg-stone-100 text-stone-700 border-stone-200',
    lake:    'bg-lake-50 text-lake-800 border-lake-100',
    sand:    'bg-sand-50 text-sand-800 border-sand-100',
    forest:  'bg-forest-50 text-forest-800 border-forest-100',
    danger:  'bg-[#FBEDEC] text-danger border-[#F4D5D2]',
    warn:    'bg-[#F8EFE2] text-[#7E5424] border-[#E9D7B7]',
    dark:    'bg-stone-800 text-paper-100 border-stone-800',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 h-6 rounded-full text-[12px] font-medium border ${tones[tone]}`}>
      {icon}{children}
    </span>
  );
}

function StatusDot({ tone='forest', label }) {
  const map = { forest:'bg-forest-500', sand:'bg-sand-500', danger:'bg-danger', lake:'bg-lake-500', stone:'bg-stone-400' };
  return (
    <span className="inline-flex items-center gap-2 text-[13px] font-medium text-stone-700">
      <span className={`relative w-2 h-2 rounded-full ${map[tone]}`}>
        <span className={`absolute inset-0 rounded-full ${map[tone]} opacity-40 animate-ping`}/>
      </span>
      {label}
    </span>
  );
}

/* —— Avatar —— */
function Avatar({ initials, src, size=36, tone='stone' }) {
  const tones = {
    stone:'bg-stone-200 text-stone-700',
    lake: 'bg-lake-100 text-lake-800',
    sand: 'bg-sand-100 text-sand-800',
    forest:'bg-forest-100 text-forest-800',
  };
  if (src) {
    return <div className={`rounded-full overflow-hidden border border-white/60 ph-stripe`}
                style={{ width:size, height:size }} aria-label={initials}/>;
  }
  return (
    <span className={`inline-flex items-center justify-center rounded-full font-medium ${tones[tone]}`}
          style={{ width:size, height:size, fontSize: size*.38 }}>
      {initials}
    </span>
  );
}

function AvatarGroup({ items=[], size=32, max=4 }) {
  const shown = items.slice(0, max);
  const overflow = items.length - shown.length;
  return (
    <div className="inline-flex items-center">
      {shown.map((a,i) => (
        <span key={i} className="-ml-2 first:ml-0 ring-2 ring-paper-100 rounded-full">
          <Avatar {...a} size={size}/>
        </span>
      ))}
      {overflow > 0 && (
        <span className="-ml-2 ring-2 ring-paper-100 rounded-full inline-flex items-center justify-center bg-stone-200 text-stone-700 font-mono text-[11px]"
              style={{ width:size, height:size }}>+{overflow}</span>
      )}
    </div>
  );
}

/* —— Cards —— */
function NewsCard({ pinned, eyebrow, title, excerpt, image='lake', date, author, comments }) {
  return (
    <article className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-card flex flex-col">
      <div className={`relative h-44 ${image === 'sand' ? 'ph-sand' : 'ph-lake'}`}>
        {pinned && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 h-7 rounded-full bg-stone-800 text-paper-50 text-[11px] font-medium">
            <I.Pin size={12}/> Angeheftet
          </span>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-sand-700">{eyebrow}</span>
        <h3 className="font-display text-[22px] leading-[1.15] text-stone-800 mt-2.5">{title}</h3>
        <p className="text-[14px] text-stone-600 leading-[1.55] mt-3 flex-1">{excerpt}</p>
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-stone-100">
          <span className="font-mono text-[11px] text-stone-500 uppercase tracking-[0.14em]">{date} · {author}</span>
          <span className="text-[12px] text-stone-500">{comments} Kommentare</span>
        </div>
      </div>
    </article>
  );
}

function TerminCard({ type='Training', title, time, court, trainer, status, slots }) {
  const toneMap = { Training:'forest', Match:'lake', Event:'sand' };
  const tone = toneMap[type] || 'stone';
  return (
    <article className="bg-white rounded-lg border border-stone-200 p-5 flex gap-5 items-start">
      <div className="flex-none w-16 text-center">
        <div className="font-display text-[28px] text-stone-800 leading-none">{time.day}</div>
        <div className="font-mono text-[11px] text-stone-500 uppercase tracking-[0.14em] mt-1">{time.month}</div>
        <div className="mt-2 text-[13px] text-stone-600 font-medium">{time.hour}</div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <Badge tone={tone}>{type}</Badge>
          {status === 'cancelled' && <Badge tone="danger">Abgesagt</Badge>}
          {status === 'full'      && <Badge tone="warn">Warteliste</Badge>}
        </div>
        <h4 className="font-display text-[20px] text-stone-800 leading-[1.2]">{title}</h4>
        <div className="mt-2 text-[13px] text-stone-500 flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5"><I.MapPin size={14}/>{court}</span>
          {trainer && <span className="inline-flex items-center gap-1.5"><I.User size={14}/>{trainer}</span>}
          {slots && <span className="inline-flex items-center gap-1.5"><I.Users size={14}/>{slots}</span>}
        </div>
      </div>
    </article>
  );
}

function MemberCard({ name, role, since, status='Aktiv', ranking, initials, tone='lake' }) {
  return (
    <article className="bg-white rounded-lg border border-stone-200 p-5 flex items-center gap-4">
      <Avatar initials={initials} size={56} tone={tone}/>
      <div className="flex-1 min-w-0">
        <div className="font-display text-[20px] text-stone-800 leading-[1.1]">{name}</div>
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500 mt-1">{role}</div>
      </div>
      <div className="text-right">
        <div className="text-[13px] text-stone-500">Mitglied seit</div>
        <div className="font-display text-[18px] text-stone-800">{since}</div>
        {ranking && <div className="mt-1 inline-flex items-center gap-1 text-[12px] text-sand-700 font-medium">
          <I.Trophy size={12}/> LK {ranking}
        </div>}
      </div>
    </article>
  );
}

/* —— Top Nav (Desktop) / Bottom Nav (Mobile) —— */
function TopNav() {
  const items = ['Verein', 'News', 'Kalender', 'Mannschaften', 'Mitglieder', 'Platzbuchung'];
  return (
    <header className="bg-paper-50/95 backdrop-blur-sm border-b border-stone-200">
      <div className="h-16 px-8 flex items-center gap-8">
        <TSVLockup height={36}/>
        <nav className="flex items-center gap-1 ml-6">
          {items.map((it, i) => (
            <a key={it} className={[
              'px-3 h-9 inline-flex items-center text-[14px] rounded-md font-medium',
              i === 0 ? 'bg-stone-100 text-stone-800' : 'text-stone-600 hover:bg-stone-100',
            ].join(' ')}>{it}</a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button className="w-10 h-10 inline-flex items-center justify-center rounded-md text-stone-600 hover:bg-stone-100"><I.Search/></button>
          <button className="relative w-10 h-10 inline-flex items-center justify-center rounded-md text-stone-600 hover:bg-stone-100">
            <I.Bell/>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-sand-500 ring-2 ring-paper-50"/>
          </button>
          <div className="ml-2"><Avatar initials="MH" size={36} tone="lake"/></div>
        </div>
      </div>
    </header>
  );
}

function BottomNav({ active=0 }) {
  const items = [
    { icon:<I.Home/>,     label:'Start' },
    { icon:<I.Calendar/>, label:'Kalender' },
    { icon:<I.Ball/>,     label:'Training' },
    { icon:<I.News/>,     label:'News' },
    { icon:<I.User/>,     label:'Profil' },
  ];
  return (
    <nav className="h-[68px] bg-white border-t border-stone-200 grid grid-cols-5 px-2 pb-2 pt-1.5">
      {items.map((it, i) => (
        <button key={it.label} className={[
          'flex flex-col items-center justify-center gap-0.5 rounded-md',
          i === active ? 'text-lake-700' : 'text-stone-500',
        ].join(' ')}>
          {it.icon}
          <span className="text-[10.5px] font-medium">{it.label}</span>
        </button>
      ))}
    </nav>
  );
}

/* —— Modal / Sheet / Toast —— */
function ModalShell({ children }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-stone-900/35 rounded-lg"/>
      <div className="relative m-6 mt-12 bg-white rounded-xl shadow-modal border border-stone-200 p-6 max-w-md">
        {children}
      </div>
    </div>
  );
}
function SheetShell({ children }) {
  return (
    <div className="relative h-full">
      <div className="absolute inset-0 bg-stone-900/35"/>
      <div className="absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl border-t border-stone-200 p-6 shadow-modal">
        <div className="mx-auto w-10 h-1.5 rounded-full bg-stone-200 mb-5"/>
        {children}
      </div>
    </div>
  );
}
function Toast({ icon, title, body, tone='forest' }) {
  const tones = {
    forest:'border-forest-200 bg-white',
    danger:'border-[#F4D5D2] bg-white',
    sand:  'border-sand-200 bg-white',
  };
  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${tones[tone]} shadow-pop max-w-[420px]`}>
      <span className={`mt-0.5 flex-none w-8 h-8 inline-flex items-center justify-center rounded-full ${
        tone==='forest'?'bg-forest-100 text-forest-700':
        tone==='danger'?'bg-[#FBEDEC] text-danger':
        'bg-sand-100 text-sand-800'
      }`}>{icon}</span>
      <div className="flex-1">
        <div className="font-display text-[17px] text-stone-800 leading-tight">{title}</div>
        <div className="text-[13.5px] text-stone-600 mt-0.5">{body}</div>
      </div>
      <button className="text-stone-400 hover:text-stone-600"><I.X size={16}/></button>
    </div>
  );
}

/* ============================================================
   COMPONENTS · GRID SHOWCASE
   ============================================================ */
function ComponentShowcase() {
  return (
    <div className="space-y-16">
      {/* Buttons */}
      <Block label="Buttons · Varianten & Größen">
        <div className="col-span-12 bg-white rounded-md border border-stone-200 p-8 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Btn variant="primary">Termin annehmen</Btn>
            <Btn variant="secondary">Details ansehen</Btn>
            <Btn variant="accent" icon={<I.Ball size={16}/>}>Platz reservieren</Btn>
            <Btn variant="ghost">Abbrechen</Btn>
            <Btn variant="destructive" icon={<I.Trash size={16}/>}>Absagen</Btn>
            <Btn variant="primary" disabled>Geschlossen</Btn>
          </div>
          <hr className="border-stone-100"/>
          <div className="flex flex-wrap items-end gap-3">
            <Btn size="sm" variant="primary">Small · 36 px</Btn>
            <Btn size="md" variant="primary">Medium · 44 px</Btn>
            <Btn size="lg" variant="primary">Large · 48 px</Btn>
            <Btn size="xl" variant="primary" iconAfter={<I.ArrowRight size={18}/>}>XL · 56 px Touch</Btn>
          </div>
          <hr className="border-stone-100"/>
          <div className="flex flex-wrap items-center gap-3">
            <Btn variant="primary" icon={<I.Plus size={16}/>}>Neuer Termin</Btn>
            <Btn variant="secondary" iconAfter={<I.External size={14}/>}>Zu eTennis</Btn>
            <Btn variant="ghost" icon={<I.Filter size={16}/>}>Filter</Btn>
          </div>
        </div>
      </Block>

      {/* Forms */}
      <Block label="Eingabefelder · Selectoren · Toggles">
        <div className="col-span-7 bg-white rounded-md border border-stone-200 p-8 space-y-5">
          <TextField label="E-Mail" leadIcon={<I.Mail size={16}/>} value="m.hofmann@tsv-treffen.at"/>
          <TextField label="Passwort" leadIcon={<I.Lock size={16}/>} type="password" value="••••••••" hint="Mindestens 8 Zeichen, eine Zahl"/>
          <TextField label="Telefon" placeholder="+43 ..." error="Bitte gib eine gültige Nummer ein."/>
          <Select label="Mannschaft" value="Herren II · Bezirksliga Ost" items={[]}/>
        </div>
        <div className="col-span-5 bg-white rounded-md border border-stone-200 p-8 space-y-7">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500 mb-3">Checkboxes</div>
            <div className="space-y-3">
              <Checkbox label="Ich nehme am Training am Mittwoch teil" checked/>
              <Checkbox label="Bringe Gast mit (max. 1)" />
              <Checkbox label="Mehrere Trainings ausgewählt" indeterminate/>
            </div>
          </div>
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500 mb-3">Radio</div>
            <div className="space-y-3">
              <Radio label="Zusagen" checked/>
              <Radio label="Vielleicht"/>
              <Radio label="Absagen"/>
            </div>
          </div>
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500 mb-3">Toggles</div>
            <div className="space-y-3">
              <Switch checked label="Push-Benachrichtigungen"/>
              <Switch label="E-Mail-Zusammenfassung wöchentlich"/>
            </div>
          </div>
        </div>
      </Block>

      {/* Cards */}
      <Block label="Karten · News · Termine · Mitglieder">
        <div className="col-span-4">
          <NewsCard
            pinned eyebrow="Saisoneröffnung"
            title="Saisonstart 2026 am 12. April"
            excerpt="Auftakt mit dem traditionellen Eröffnungsdoppel im Schlosshof — anschließend gemeinsamer Empfang."
            date="04. März" author="M. Pirker" comments={12} image="sand"/>
        </div>
        <div className="col-span-4">
          <NewsCard
            eyebrow="Vereinsmeisterschaft"
            title="Vereinsmeisterschaft 2026 — Anmeldung offen"
            excerpt="Vier Klassen, drei Wochenenden. Anmeldeschluss ist der 15. Mai, Auslosung am Vereinsabend."
            date="28. Feb." author="K. Wallner" comments={4} image="lake"/>
        </div>
        <div className="col-span-4">
          <NewsCard
            eyebrow="Mannschaftsspiel"
            title="Herren II gewinnt 5:1 gegen Villach"
            excerpt="Souveräner Saisonauftakt in der Bezirksliga Ost. Doppel-Punkt entschied das knappe Match auf Platz 1."
            date="22. Mai" author="J. Steiner" comments={8} image="sand"/>
        </div>

        <div className="col-span-7 space-y-3">
          <TerminCard type="Training" title="Mannschaftstraining Herren II"
            time={{ day:14, month:'Mai', hour:'18:00 – 20:00' }}
            court="Platz 1 & 2" trainer="M. Pirker" slots="6 von 8"/>
          <TerminCard type="Match" title="Bezirksliga · TSV vs. Velden"
            time={{ day:18, month:'Mai', hour:'14:00' }}
            court="Heim · Platz 1–3" status="full"/>
          <TerminCard type="Event" title="Sommerfest im Schlosshof"
            time={{ day:21, month:'Jun', hour:'17:00' }}
            court="Schlosshof Treffen"/>
          <TerminCard type="Training" title="Kindertraining U12"
            time={{ day:15, month:'Mai', hour:'16:00 – 17:30' }}
            court="Platz 4" trainer="A. Brunner" status="cancelled"/>
        </div>
        <div className="col-span-5 space-y-3">
          <MemberCard initials="MH" name="Martin Hofmann" role="Obmann · Mannschaftsführer Herren II"
            since="2014" ranking="11.3" tone="lake"/>
          <MemberCard initials="KW" name="Katharina Wallner" role="Jugendleiterin"
            since="2018" ranking="9.7" tone="sand"/>
          <MemberCard initials="JS" name="Julian Steiner" role="Aktiv · Herren II"
            since="2021" ranking="14.1" tone="forest"/>
        </div>
      </Block>

      {/* Navigation */}
      <Block label="Navigation">
        <div className="col-span-12 rounded-md border border-stone-200 overflow-hidden">
          <TopNav/>
        </div>
        <div className="col-span-4 rounded-md border border-stone-200 overflow-hidden">
          <BottomNav active={0}/>
        </div>
        <div className="col-span-8 rounded-md border border-stone-200 bg-white p-7">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500 mb-4">Breadcrumb</div>
          <div className="flex items-center gap-2 text-[14px] text-stone-500 mb-8">
            <a className="hover:text-stone-800">Verein</a>
            <I.ChevronRight size={14}/>
            <a className="hover:text-stone-800">Mannschaften</a>
            <I.ChevronRight size={14}/>
            <span className="text-stone-800 font-medium">Herren II · Bezirksliga Ost</span>
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500 mb-4">Tabs</div>
          <div className="flex items-center border-b border-stone-200">
            {['Übersicht','Spieler','Termine','Tabelle','Statistik'].map((t, i) => (
              <button key={t} className={[
                'px-4 h-11 text-[14px] font-medium relative',
                i === 0 ? 'text-stone-800' : 'text-stone-500 hover:text-stone-700',
              ].join(' ')}>
                {t}
                {i === 0 && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-lake-700"/>}
              </button>
            ))}
          </div>
        </div>
      </Block>

      {/* Badges, Tags, Status */}
      <Block label="Badges · Tags · Status">
        <div className="col-span-12 bg-white rounded-md border border-stone-200 p-8 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="lake">Training</Badge>
            <Badge tone="sand">Match</Badge>
            <Badge tone="forest" icon={<I.Check size={11}/>}>Zugesagt</Badge>
            <Badge tone="warn">Warteliste</Badge>
            <Badge tone="danger" icon={<I.X size={11}/>}>Abgesagt</Badge>
            <Badge tone="dark">Vorstand</Badge>
            <Badge tone="neutral">Gast</Badge>
            <Badge tone="lake" icon={<I.Trophy size={11}/>}>Bezirksliga Ost</Badge>
          </div>
          <hr className="border-stone-100"/>
          <div className="flex flex-wrap items-center gap-6">
            <StatusDot tone="forest" label="Plätze offen"/>
            <StatusDot tone="sand" label="Wenige Plätze"/>
            <StatusDot tone="danger" label="Belegt"/>
            <StatusDot tone="lake" label="Live · Bezirksliga"/>
            <StatusDot tone="stone" label="Saisonpause"/>
          </div>
        </div>
      </Block>

      {/* Avatars */}
      <Block label="Avatare · Avatar-Gruppe">
        <div className="col-span-12 bg-white rounded-md border border-stone-200 p-8 flex items-center gap-10 flex-wrap">
          <div className="flex items-center gap-4">
            <Avatar initials="MH" size={64} tone="lake"/>
            <Avatar initials="KW" size={48} tone="sand"/>
            <Avatar initials="JS" size={40} tone="forest"/>
            <Avatar initials="AB" size={32} tone="stone"/>
            <Avatar initials="LP" size={24} tone="lake"/>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">Group · 8 Spieler</span>
            <AvatarGroup max={4} items={[
              { initials:'MH', tone:'lake' },{ initials:'KW', tone:'sand' },
              { initials:'JS', tone:'forest' },{ initials:'AB', tone:'stone' },
              { initials:'LP', tone:'lake' },{ initials:'EM', tone:'sand' },
              { initials:'TW', tone:'forest' },{ initials:'RS', tone:'stone' },
            ]}/>
          </div>
        </div>
      </Block>

      {/* Overlays */}
      <Block label="Overlays · Modal · Sheet · Toast">
        <div className="col-span-5 bg-paper-200 rounded-md p-1 h-[360px] overflow-hidden">
          <div className="h-full bg-paper-100 rounded-md relative">
            <ModalShell>
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">Bestätigung</div>
              <h4 className="font-display text-[22px] text-stone-800 mt-2">Training am Mittwoch absagen?</h4>
              <p className="text-[14px] text-stone-600 mt-2 leading-relaxed">
                Du sagst das Mannschaftstraining am 14. Mai 18:00 ab. Trainer und Mannschaftskollegen werden informiert.
              </p>
              <div className="flex justify-end gap-2 mt-6">
                <Btn variant="ghost" size="sm">Doch teilnehmen</Btn>
                <Btn variant="destructive" size="sm">Absagen</Btn>
              </div>
            </ModalShell>
          </div>
        </div>
        <div className="col-span-4 bg-paper-200 rounded-md p-1 h-[360px] overflow-hidden">
          <div className="h-full bg-paper-100 rounded-md relative">
            <SheetShell>
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">Termin-Details</div>
              <h4 className="font-display text-[20px] text-stone-800 mt-2">Mannschaftstraining</h4>
              <div className="mt-3 space-y-2 text-[14px] text-stone-600">
                <div className="flex items-center gap-2"><I.Clock size={14}/> Mi 18:00 – 20:00</div>
                <div className="flex items-center gap-2"><I.MapPin size={14}/> Platz 1 &amp; 2</div>
                <div className="flex items-center gap-2"><I.Users size={14}/> 6 von 8 zugesagt</div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-5">
                <Btn variant="primary">Zusagen</Btn>
                <Btn variant="secondary">Absagen</Btn>
              </div>
            </SheetShell>
          </div>
        </div>
        <div className="col-span-3 space-y-3">
          <Toast tone="forest" icon={<I.Check size={16}/>}
            title="Zusage gespeichert" body="Du bist für Mi 18:00 im Training."/>
          <Toast tone="danger" icon={<I.X size={16}/>}
            title="Training abgesagt" body="Die Mannschaft wurde informiert."/>
          <Toast tone="sand" icon={<I.Info size={16}/>}
            title="Wetterwarnung" body="Regen ab 17 Uhr — Halle 3 reserviert."/>
        </div>
      </Block>
    </div>
  );
}

Object.assign(window, {
  Btn, TextField, Select, Checkbox, Radio, Switch,
  Badge, StatusDot, Avatar, AvatarGroup,
  NewsCard, TerminCard, MemberCard,
  TopNav, BottomNav, ModalShell, SheetShell, Toast,
  ComponentShowcase,
});
