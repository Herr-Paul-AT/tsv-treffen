/* ============================================================
   SCREEN MOCKUPS — Mobile-first + 1 Desktop
   ============================================================ */

/* —— Phone frame (390 × 844) —— */
function Phone({ label, statusbar='light', children }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative bg-stone-900 rounded-[44px] p-[10px] shadow-modal"
        style={{ width: 390 + 20, height: 844 + 20 }}>
        <div className="absolute inset-0 rounded-[44px] ring-1 ring-stone-700/40 pointer-events-none"/>
        <div className="relative w-[390px] h-[844px] rounded-[36px] overflow-hidden bg-paper-100">
          {/* notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[120px] h-[28px] rounded-full bg-stone-900 z-50"/>
          {/* status bar */}
          <div className={`absolute top-0 left-0 right-0 h-[44px] flex items-center justify-between px-7 z-40 pointer-events-none ${statusbar === 'dark' ? 'text-paper-50' : 'text-stone-800'}`}>
            <span className="font-mono text-[13px] font-medium tracking-tight">9:41</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[11px]">●●●●</span>
              <svg width="16" height="11" viewBox="0 0 16 11" fill="none"><path d="M0 8h2v3H0zM4 6h2v5H4zM8 3h2v8H8zM12 0h2v11h-2z" fill="currentColor"/></svg>
              <svg width="22" height="10" viewBox="0 0 22 10" fill="none"><rect x="0.5" y="0.5" width="18" height="9" rx="2" stroke="currentColor"/><rect x="2" y="2" width="14" height="6" fill="currentColor"/><rect x="19" y="3" width="2" height="4" fill="currentColor"/></svg>
            </div>
          </div>
          {/* home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[140px] h-[5px] rounded-full bg-stone-800/30 z-40"/>
          {/* content */}
          <div className="absolute inset-0 overflow-hidden">{children}</div>
        </div>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500 rule-eyebrow">{label}</span>
      </div>
    </div>
  );
}

/* —— Screen header (in-app) —— */
function MobileHeader({ title, lead, action, onBack }) {
  return (
    <div className="pt-[52px] px-5 pb-3 flex items-center gap-3">
      {onBack && (
        <button className="w-10 h-10 -ml-2 inline-flex items-center justify-center rounded-full text-stone-700 hover:bg-stone-100">
          <I.ArrowLeft/>
        </button>
      )}
      <div className="flex-1 min-w-0">
        {lead && <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-stone-500">{lead}</div>}
        <div className="font-display text-[24px] leading-[1.1] text-stone-800 truncate">{title}</div>
      </div>
      {action}
    </div>
  );
}

/* ============================================================
   01 · LANDING (öffentlich)
   ============================================================ */
function ScreenLanding() {
  return (
    <div className="h-full overflow-y-auto bg-paper-100">
      {/* Hero */}
      <div className="relative h-[460px] bg-stone-800 overflow-hidden">
        <div className="absolute inset-0 ph-stripe-dark"/>
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/50 via-stone-900/10 to-stone-900/85"/>
        {/* faint mark */}
        <div className="absolute -right-6 top-12 opacity-15 pointer-events-none">
          <TSVMark size={260} variant="negative"/>
        </div>
        <div className="relative h-full flex flex-col justify-end p-6 pb-7 text-paper-50">
          <div className="flex items-center justify-between pt-[34px]">
            <TSVLockup height={36} color="#FBF8F1" accent="#C39265"/>
            <button className="text-paper-50/90 w-10 h-10 inline-flex items-center justify-center"><I.Menu/></button>
          </div>
          <div className="mt-auto">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-sand-300">Saison 2026 · 12. April</span>
            <h1 className="font-display text-[40px] leading-[1.02] tracking-[-0.01em] mt-3">
              Tennis am Fuße<br/>der Gerlitzen.
            </h1>
            <p className="text-[15px] text-paper-100/85 mt-3 leading-[1.5] max-w-[300px]">
              Vier Sandplätze, ein See, ein Schloss im Rücken.<br/>Spielen, trainieren, dazugehören.
            </p>
            <div className="flex gap-2 mt-5">
              <Btn variant="accent" size="lg">Mitglied werden</Btn>
              <Btn variant="ghost" size="lg" className="!text-paper-50 hover:!bg-white/10">Platz buchen</Btn>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="mx-5 -mt-8 relative z-10 bg-white rounded-xl border border-stone-200 shadow-card p-5 grid grid-cols-3 gap-3">
        <div className="text-center"><div className="font-display text-[28px] text-stone-800 leading-none">4</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-stone-500 mt-1">Sand­plätze</div></div>
        <div className="text-center border-l border-stone-100"><div className="font-display text-[28px] text-stone-800 leading-none">186</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-stone-500 mt-1">Mit­glieder</div></div>
        <div className="text-center border-l border-stone-100"><div className="font-display text-[28px] text-stone-800 leading-none">7</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-stone-500 mt-1">Mann­schaften</div></div>
      </div>

      {/* News */}
      <div className="px-5 mt-8">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-[22px] text-stone-800">Aus dem Verein</h2>
          <a className="font-mono text-[11px] uppercase tracking-[0.14em] text-lake-700">Alle ansehen</a>
        </div>
        <div className="mt-3 space-y-3">
          <article className="bg-white rounded-lg border border-stone-200 overflow-hidden">
            <div className="h-32 ph-sand"/>
            <div className="p-4">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-sand-700">Saisoneröffnung</span>
              <h3 className="font-display text-[17px] text-stone-800 mt-1.5 leading-[1.2]">
                Saisonstart am 12. April mit Eröffnungsdoppel
              </h3>
              <div className="font-mono text-[10.5px] text-stone-500 mt-2 uppercase tracking-[0.14em]">04. März · M. Pirker</div>
            </div>
          </article>
          <article className="bg-white rounded-lg border border-stone-200 overflow-hidden">
            <div className="h-32 ph-lake"/>
            <div className="p-4">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-lake-700">Mannschaftsspiel</span>
              <h3 className="font-display text-[17px] text-stone-800 mt-1.5 leading-[1.2]">
                Herren II startet 5:1 in die Bezirksliga
              </h3>
              <div className="font-mono text-[10.5px] text-stone-500 mt-2 uppercase tracking-[0.14em]">22. Mai · J. Steiner</div>
            </div>
          </article>
        </div>
      </div>

      {/* Sponsors */}
      <div className="px-5 mt-8 pb-8">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500">Sponsoren der Saison 2026</h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {['Raiffeisen Treffen','Gerlitzen Bergbahn','Seestern Marina','Brauerei Hirt','Wirt am See','Gemeinde Treffen'].map((s)=>(
            <div key={s} className="bg-white border border-stone-200 rounded-md h-16 flex items-center justify-center text-center px-2">
              <span className="font-display text-[12px] text-stone-700 leading-tight">{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   02 · LOGIN
   ============================================================ */
function ScreenLogin() {
  return (
    <div className="h-full bg-paper-100 flex flex-col">
      <div className="pt-[64px] px-7">
        <TSVMark size={72} variant="color"/>
      </div>
      <div className="px-7 mt-7">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500">Mitgliederbereich</span>
        <h1 className="font-display text-[34px] leading-[1.05] text-stone-800 mt-2">
          Willkommen<br/>zurück.
        </h1>
        <p className="text-[15px] text-stone-600 mt-2 leading-[1.55] max-w-[280px]">
          Melde dich an, um Trainings zu bestätigen, Plätze zu buchen und News deiner Mannschaft zu sehen.
        </p>
      </div>
      <div className="flex-1 px-7 mt-7 space-y-4">
        <TextField label="E-Mail" leadIcon={<I.Mail size={16}/>} placeholder="vorname.name@…"/>
        <TextField label="Passwort" leadIcon={<I.Lock size={16}/>} type="password" placeholder="••••••••"/>
        <a className="block text-right font-mono text-[11px] uppercase tracking-[0.14em] text-lake-700 -mt-1">Passwort vergessen?</a>
      </div>
      <div className="px-7 pb-7 space-y-3">
        <Btn variant="primary" size="xl" className="w-full">Anmelden</Btn>
        <Btn variant="ghost" size="lg" className="w-full !text-stone-700">Als Gast fortfahren</Btn>
        <div className="pt-2 text-center font-mono text-[11px] text-stone-500 uppercase tracking-[0.16em]">
          Neu hier?  <a className="text-lake-700">Mitglied werden</a>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   03 · DASHBOARD (Mitglied)
   ============================================================ */
function ScreenDashboard() {
  return (
    <div className="h-full bg-paper-100 flex flex-col">
      <MobileHeader
        lead="Mittwoch · 14. Mai"
        title="Servus, Martin"
        action={<button className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-white border border-stone-200 text-stone-700"><I.Bell size={18}/></button>}
      />
      <div className="flex-1 overflow-y-auto px-5 pb-24">
        {/* Next training callout */}
        <div className="bg-stone-800 text-paper-50 rounded-xl overflow-hidden relative">
          <div className="absolute -top-6 -right-8 opacity-10"><TSVMark size={180} variant="negative"/></div>
          <div className="relative p-5">
            <div className="flex items-center justify-between">
              <Badge tone="dark"><span className="text-sand-300">●</span>&nbsp;Nächstes Training</Badge>
              <span className="font-mono text-[11px] text-paper-100/70 uppercase tracking-[0.14em]">heute · in 4 h</span>
            </div>
            <h3 className="font-display text-[24px] leading-[1.15] mt-3">Mannschaftstraining Herren II</h3>
            <div className="mt-3 grid grid-cols-3 gap-3 text-[12.5px] text-paper-100/85">
              <div className="flex items-center gap-1.5"><I.Clock size={13}/>18:00–20:00</div>
              <div className="flex items-center gap-1.5"><I.MapPin size={13}/>Platz 1 &amp; 2</div>
              <div className="flex items-center gap-1.5"><I.Users size={13}/>6 von 8</div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button className="h-11 rounded-md bg-sand-500 text-stone-900 font-medium text-[15px] inline-flex items-center justify-center gap-2">
                <I.Check size={16}/> Zusagen
              </button>
              <button className="h-11 rounded-md bg-white/10 text-paper-50 border border-white/15 font-medium text-[15px]">
                Absagen
              </button>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          {[
            { icon:<I.Court size={20}/>,    label:'Platz buchen' },
            { icon:<I.Calendar size={20}/>, label:'Kalender' },
            { icon:<I.Trophy size={20}/>,   label:'Tabelle' },
          ].map((a) => (
            <button key={a.label} className="bg-white rounded-lg border border-stone-200 p-3.5 flex flex-col items-start gap-2">
              <span className="w-9 h-9 rounded-md bg-lake-50 text-lake-700 inline-flex items-center justify-center">{a.icon}</span>
              <span className="text-[13px] font-medium text-stone-800 leading-tight">{a.label}</span>
            </button>
          ))}
        </div>

        {/* News strip */}
        <div className="mt-6">
          <div className="flex items-baseline justify-between">
            <h3 className="font-display text-[18px] text-stone-800">Aus dem Verein</h3>
            <a className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-lake-700">Alle</a>
          </div>
          <div className="mt-3 space-y-2.5">
            <a className="block bg-white rounded-lg border border-stone-200 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Badge tone="sand">Saisoneröffnung</Badge>
                <span className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em]">04. März</span>
              </div>
              <div className="font-display text-[16.5px] text-stone-800 leading-[1.2]">Saisonstart 2026 am 12. April</div>
            </a>
            <a className="block bg-white rounded-lg border border-stone-200 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Badge tone="lake">Bezirksliga</Badge>
                <span className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em]">22. Mai</span>
              </div>
              <div className="font-display text-[16.5px] text-stone-800 leading-[1.2]">Herren II gewinnt 5:1 gegen Villach</div>
            </a>
          </div>
        </div>

        {/* Court status */}
        <div className="mt-6 bg-white rounded-lg border border-stone-200 p-4">
          <div className="flex items-baseline justify-between">
            <h3 className="font-display text-[18px] text-stone-800">Plätze · jetzt</h3>
            <span className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em]">Aktualisiert 14:02</span>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-3">
            {[
              ['1','frei','forest'],['2','frei','forest'],['3','belegt','danger'],['4','wenig','sand'],
            ].map(([n,s,t]) => (
              <div key={n} className="rounded-md border border-stone-200 p-3 text-center">
                <div className="font-display text-[24px] text-stone-800 leading-none">{n}</div>
                <StatusDot tone={t} label={s}/>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute left-0 right-0 bottom-0"><BottomNav active={0}/></div>
    </div>
  );
}

/* ============================================================
   04 · NEWS-DETAIL
   ============================================================ */
function ScreenNewsDetail() {
  return (
    <div className="h-full bg-paper-100 overflow-y-auto">
      <div className="relative h-[280px] ph-sand">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/30 to-transparent"/>
        <div className="absolute top-[52px] left-4 right-4 flex items-center justify-between">
          <button className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-white/90 text-stone-700 shadow-card"><I.ArrowLeft/></button>
          <div className="flex gap-2">
            <button className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-white/90 text-stone-700 shadow-card"><I.Star size={18}/></button>
            <button className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-white/90 text-stone-700 shadow-card"><I.More/></button>
          </div>
        </div>
      </div>
      <div className="px-5 -mt-10 pb-12 relative">
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-card">
          <div className="flex items-center gap-2">
            <Badge tone="sand">Saisoneröffnung</Badge>
            <span className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em]">04. März 2026</span>
          </div>
          <h1 className="font-display text-[28px] leading-[1.08] text-stone-800 mt-3">
            Saisonstart 2026 am 12. April im Schlosshof.
          </h1>
          <div className="mt-4 flex items-center gap-3 pb-4 border-b border-stone-100">
            <Avatar initials="MP" size={36} tone="lake"/>
            <div className="flex-1">
              <div className="text-[13.5px] font-medium text-stone-800">Markus Pirker</div>
              <div className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em]">Trainer · Mannschaftsführer</div>
            </div>
            <button className="text-[12.5px] text-lake-700 font-medium">Folgen</button>
          </div>
          <div className="mt-4 text-[15px] text-stone-700 leading-[1.65] space-y-3">
            <p>Liebe Mitglieder, der Frühling ist da — und damit auch der Auftakt zur neuen Outdoor-Saison auf unseren vier Sandplätzen.</p>
            <p>Wir starten am Samstag, 12. April, um 10 Uhr mit dem traditionellen Eröffnungsdoppel. Anschließend laden wir alle Mitglieder, Familien und Sponsoren zum gemeinsamen Frühschoppen in den Schlosshof.</p>
            <p>Die Anmeldung zum Doppel erfolgt direkt in der App. Plätze sind begrenzt — wer früh dran ist, kommt sicher rein.</p>
          </div>
          <div className="mt-5 pt-4 border-t border-stone-100 flex items-center gap-4">
            <span className="font-mono text-[11px] text-stone-500 uppercase tracking-[0.14em]">12 Kommentare</span>
            <AvatarGroup max={3} size={24} items={[{ initials:'KW', tone:'sand' },{ initials:'JS', tone:'forest' },{ initials:'AB', tone:'stone' }, { initials:'+9' }]}/>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Btn variant="primary" size="lg" className="flex-1">Zum Doppel anmelden</Btn>
          <Btn variant="secondary" size="lg" icon={<I.Calendar size={16}/>}>In Kalender</Btn>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   05 · KALENDER
   ============================================================ */
function ScreenCalendar() {
  const days = ['Mo','Di','Mi','Do','Fr','Sa','So'];
  const dates = [12,13,14,15,16,17,18];
  const active = 2;
  const blocks = [
    { day:0, time:'17:00', dur:1, label:'Kindertraining U10', tone:'forest' },
    { day:2, time:'18:00', dur:2, label:'Training Herren II', tone:'forest' },
    { day:3, time:'16:00', dur:1.5, label:'Damen 35+ Training', tone:'forest' },
    { day:5, time:'14:00', dur:3, label:'Bezirksliga vs. Velden', tone:'lake' },
    { day:6, time:'10:00', dur:2, label:'Mixed Turnier · Doppel', tone:'sand' },
  ];
  const toneBg = { forest:'bg-forest-50 border-forest-200 text-forest-800',
                   lake:'bg-lake-50 border-lake-200 text-lake-800',
                   sand:'bg-sand-50 border-sand-200 text-sand-800' };

  return (
    <div className="h-full bg-paper-100 flex flex-col">
      <MobileHeader
        lead="KW 20 · Mai 2026"
        title="Kalender"
        action={<button className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-white border border-stone-200 text-stone-700"><I.Plus size={18}/></button>}
      />

      <div className="px-5">
        <div className="flex items-center gap-1.5 mb-2">
          {['Alle','Training','Match','Events'].map((f,i)=>(
            <button key={f} className={[
              'px-3 h-8 rounded-full text-[12.5px] font-medium border',
              i === 0 ? 'bg-stone-800 text-paper-50 border-stone-800' : 'bg-white text-stone-700 border-stone-200',
            ].join(' ')}>{f}</button>
          ))}
        </div>
        <div className="bg-white rounded-lg border border-stone-200 px-2 py-3 grid grid-cols-7 gap-0.5">
          {days.map((d, i) => (
            <button key={d} className={[
              'flex flex-col items-center gap-1 py-2 rounded-md',
              i === active ? 'bg-lake-700 text-paper-50' : 'text-stone-700 hover:bg-stone-50',
            ].join(' ')}>
              <span className={`font-mono text-[10px] uppercase tracking-[0.14em] ${i === active ? 'text-paper-100/70' : 'text-stone-500'}`}>{d}</span>
              <span className="font-display text-[19px] leading-none">{dates[i]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 mt-4 pb-24">
        <div className="relative bg-white rounded-lg border border-stone-200">
          {/* hours */}
          {[14,15,16,17,18,19,20,21].map((h,i)=>(
            <div key={h} className="grid grid-cols-[44px_1fr] border-t first:border-t-0 border-stone-100">
              <div className="font-mono text-[11px] text-stone-400 pt-1.5 pl-3 uppercase tracking-[0.12em]">{h}:00</div>
              <div className="h-14 relative">
                {blocks.filter(b => b.day === active && parseInt(b.time) === h).map((b,j)=>(
                  <div key={j} className={`absolute left-2 right-3 top-1 rounded-md border px-3 py-2 ${toneBg[b.tone]}`}
                       style={{ height: `${b.dur * 56 - 8}px` }}>
                    <div className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-70">{b.time}</div>
                    <div className="text-[13.5px] font-medium leading-tight mt-0.5">{b.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500 mb-2">Diese Woche</h3>
          <div className="space-y-2">
            {blocks.slice(2, 5).map((b, i) => (
              <div key={i} className="bg-white rounded-md border border-stone-200 p-3 flex items-center gap-3">
                <div className={`w-1 h-10 rounded-full ${b.tone === 'forest' ? 'bg-forest-500' : b.tone === 'lake' ? 'bg-lake-500' : 'bg-sand-500'}`}/>
                <div className="flex-1">
                  <div className="text-[13.5px] font-medium text-stone-800 leading-tight">{b.label}</div>
                  <div className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em] mt-1">{['Do','Fr','Sa'][i]} · {b.time}</div>
                </div>
                <I.ChevronRight size={16} className="text-stone-400"/>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute left-0 right-0 bottom-0"><BottomNav active={1}/></div>
    </div>
  );
}

/* ============================================================
   06 · ANWESENHEIT (zu-/absagen)
   ============================================================ */
function ScreenAttendance() {
  const yes = [
    { initials:'MH', tone:'lake' },{ initials:'KW', tone:'sand' },
    { initials:'JS', tone:'forest' },{ initials:'AB', tone:'stone' },
    { initials:'LP', tone:'lake' },{ initials:'EM', tone:'sand' },
  ];
  const maybe = [{ initials:'TW', tone:'forest' }];
  const no = [{ initials:'RS', tone:'stone' }];

  return (
    <div className="h-full bg-paper-100 flex flex-col">
      <MobileHeader onBack title="Mannschafts­training" lead="Herren II · 14. Mai · 18:00"/>
      <div className="flex-1 overflow-y-auto px-5 pb-32">
        {/* Hero card */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="h-32 ph-lake relative">
            <div className="absolute bottom-3 left-4">
              <Badge tone="lake">Training · Mannschaft</Badge>
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em]">Datum</div>
                <div className="font-display text-[20px] text-stone-800 leading-tight mt-1">Mi 14. Mai</div>
              </div>
              <div className="border-l border-r border-stone-100">
                <div className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em]">Uhrzeit</div>
                <div className="font-display text-[20px] text-stone-800 leading-tight mt-1">18:00 – 20:00</div>
              </div>
              <div>
                <div className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em]">Plätze</div>
                <div className="font-display text-[20px] text-stone-800 leading-tight mt-1">1 &amp; 2</div>
              </div>
            </div>
            <hr className="my-4 border-stone-100"/>
            <div className="flex items-center gap-3">
              <Avatar initials="MP" size={36} tone="lake"/>
              <div className="flex-1">
                <div className="text-[13.5px] font-medium text-stone-800">Markus Pirker</div>
                <div className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em]">Trainer</div>
              </div>
              <button className="w-9 h-9 rounded-md border border-stone-200 inline-flex items-center justify-center text-stone-600"><I.Mail size={16}/></button>
            </div>
          </div>
        </div>

        {/* Status segmented */}
        <div className="mt-5">
          <div className="font-mono text-[11px] text-stone-500 uppercase tracking-[0.18em]">Deine Rückmeldung</div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <button className="h-14 rounded-lg bg-forest-500 text-paper-50 font-medium text-[14px] flex flex-col items-center justify-center gap-0.5">
              <I.Check size={18}/> Zusagen
            </button>
            <button className="h-14 rounded-lg bg-white border border-stone-200 text-stone-700 font-medium text-[14px] flex flex-col items-center justify-center gap-0.5">
              <I.Clock size={18}/> Vielleicht
            </button>
            <button className="h-14 rounded-lg bg-white border border-stone-200 text-stone-700 font-medium text-[14px] flex flex-col items-center justify-center gap-0.5">
              <I.X size={18}/> Absagen
            </button>
          </div>
          <div className="mt-2 font-mono text-[10.5px] text-forest-700 uppercase tracking-[0.14em] flex items-center gap-1.5">
            <I.Check size={11}/> Du hast zugesagt · vor 12 Min
          </div>
        </div>

        {/* Roster */}
        <div className="mt-6 bg-white rounded-lg border border-stone-200 p-4">
          <h3 className="font-display text-[18px] text-stone-800">Mannschaft · 8 Spieler</h3>
          <div className="mt-3 space-y-3">
            <div>
              <div className="font-mono text-[10.5px] text-forest-700 uppercase tracking-[0.18em] mb-1.5">Zugesagt · {yes.length}</div>
              <AvatarGroup items={yes} max={6} size={32}/>
            </div>
            <div>
              <div className="font-mono text-[10.5px] text-sand-700 uppercase tracking-[0.18em] mb-1.5">Vielleicht · {maybe.length}</div>
              <AvatarGroup items={maybe} size={32}/>
            </div>
            <div>
              <div className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.18em] mb-1.5">Abgesagt · {no.length}</div>
              <AvatarGroup items={no} size={32}/>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-0 right-0 bottom-0"><BottomNav active={2}/></div>
    </div>
  );
}

/* ============================================================
   07 · PROFIL
   ============================================================ */
function ScreenProfile() {
  return (
    <div className="h-full bg-paper-100 flex flex-col">
      <div className="pt-[52px] px-5 pb-2 flex items-center justify-between">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-stone-500">Profil</span>
        <button className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-white border border-stone-200 text-stone-700"><I.Settings size={18}/></button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24">
        {/* Hero */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <div className="flex items-center gap-4">
            <Avatar initials="MH" size={72} tone="lake"/>
            <div className="flex-1">
              <div className="font-display text-[24px] text-stone-800 leading-[1.05]">Martin Hofmann</div>
              <div className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.16em] mt-1">Mitglied seit 2014</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge tone="dark">Obmann</Badge>
                <Badge tone="lake">Herren II</Badge>
                <Badge tone="sand" icon={<I.Trophy size={11}/>}>LK 11.3</Badge>
              </div>
            </div>
          </div>
          <Btn variant="secondary" size="md" icon={<I.Edit size={16}/>} className="mt-4 w-full">Profil bearbeiten</Btn>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="bg-white rounded-md border border-stone-200 p-3 text-center">
            <div className="font-display text-[24px] text-stone-800 leading-none">24</div>
            <div className="font-mono text-[10px] text-stone-500 uppercase tracking-[0.14em] mt-1">Trainings 26</div>
          </div>
          <div className="bg-white rounded-md border border-stone-200 p-3 text-center">
            <div className="font-display text-[24px] text-stone-800 leading-none">9 : 3</div>
            <div className="font-mono text-[10px] text-stone-500 uppercase tracking-[0.14em] mt-1">Bilanz</div>
          </div>
          <div className="bg-white rounded-md border border-stone-200 p-3 text-center">
            <div className="font-display text-[24px] text-stone-800 leading-none">86%</div>
            <div className="font-mono text-[10px] text-stone-500 uppercase tracking-[0.14em] mt-1">Anwesenheit</div>
          </div>
        </div>

        {/* Sections */}
        <div className="mt-6 bg-white rounded-lg border border-stone-200 overflow-hidden">
          {[
            { icon:<I.Calendar/>, label:'Meine Termine',         hint:'3 diese Woche' },
            { icon:<I.Bell/>,     label:'Benachrichtigungen',    hint:'Push & E-Mail' },
            { icon:<I.Court/>,    label:'Platzbuchungen',        hint:'2 offen' },
            { icon:<I.Trophy/>,   label:'Mannschaft Herren II',  hint:'Bezirksliga Ost' },
            { icon:<I.Mail/>,     label:'Beitragskonto',         hint:'2026 bezahlt' },
            { icon:<I.Info/>,     label:'Vereinsstatuten',       hint:'PDF' },
          ].map((it, i, arr) => (
            <button key={it.label} className={[
              'w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-paper-50',
              i < arr.length - 1 ? 'border-b border-stone-100' : '',
            ].join(' ')}>
              <span className="w-9 h-9 rounded-md bg-paper-100 text-stone-700 inline-flex items-center justify-center">{it.icon}</span>
              <div className="flex-1">
                <div className="text-[15px] font-medium text-stone-800 leading-tight">{it.label}</div>
                <div className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em] mt-0.5">{it.hint}</div>
              </div>
              <I.ChevronRight size={16} className="text-stone-400"/>
            </button>
          ))}
        </div>

        <button className="mt-6 w-full h-12 inline-flex items-center justify-center gap-2 rounded-md text-danger font-medium text-[15px] border border-danger/20 bg-white">
          Abmelden
        </button>
      </div>

      <div className="absolute left-0 right-0 bottom-0"><BottomNav active={4}/></div>
    </div>
  );
}

/* ============================================================
   08 · PLATZBUCHUNG (Einstieg)
   ============================================================ */
function ScreenBooking() {
  const courts = [
    { n:'1', state:'frei',   tone:'forest', next:'Frei bis 18:00' },
    { n:'2', state:'frei',   tone:'forest', next:'Frei bis 17:30' },
    { n:'3', state:'belegt', tone:'danger', next:'Belegt bis 16:00' },
    { n:'4', state:'wenig',  tone:'sand',   next:'Nur 17:30–19:00' },
  ];
  return (
    <div className="h-full bg-paper-100 flex flex-col">
      <MobileHeader title="Platzbuchung" lead="Heute · 14:02"/>
      <div className="flex-1 overflow-y-auto px-5 pb-24">
        {/* Stat row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white rounded-md border border-stone-200 p-3.5">
            <div className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em]">Offene Slots</div>
            <div className="font-display text-[28px] text-stone-800 mt-1 leading-none">14</div>
            <div className="font-mono text-[10.5px] text-forest-700 uppercase tracking-[0.14em] mt-1">Heute · alle Plätze</div>
          </div>
          <div className="bg-white rounded-md border border-stone-200 p-3.5">
            <div className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em]">Deine Buchungen</div>
            <div className="font-display text-[28px] text-stone-800 mt-1 leading-none">2</div>
            <div className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em] mt-1">Mi 17:00, Sa 09:00</div>
          </div>
        </div>

        {/* Court grid */}
        <h3 className="font-mono text-[11px] text-stone-500 uppercase tracking-[0.18em] mt-6">Aktuelle Belegung</h3>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {courts.map(c => (
            <div key={c.n} className="bg-white rounded-lg border border-stone-200 p-4 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-stone-500">Sand­platz</div>
                <span className={`w-2 h-2 rounded-full ${c.tone==='forest'?'bg-forest-500':c.tone==='sand'?'bg-sand-500':'bg-danger'}`}/>
              </div>
              <div className="font-display text-[44px] text-stone-800 leading-none mt-1.5">{c.n}</div>
              <div className={`mt-2 text-[12px] font-medium ${c.tone==='forest'?'text-forest-700':c.tone==='sand'?'text-sand-700':'text-danger'}`}>
                {c.state}
              </div>
              <div className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em] mt-1">{c.next}</div>
            </div>
          ))}
        </div>

        {/* External booking */}
        <div className="mt-6 bg-stone-800 text-paper-50 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10"><TSVMark size={140} variant="negative"/></div>
          <div className="relative">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-sand-300">Slot reservieren</div>
            <h3 className="font-display text-[22px] mt-2 leading-[1.15]">
              Buchung läuft über eTennis.
            </h3>
            <p className="text-[13.5px] text-paper-100/80 mt-2 leading-[1.5]">
              Wir leiten dich mit deinem Vereinslogin direkt zum Buchungssystem — kein zweites Konto, keine Eingabe nochmal.
            </p>
            <Btn variant="accent" size="lg" iconAfter={<I.External size={16}/>} className="mt-4 w-full">
              Zu eTennis öffnen
            </Btn>
            <div className="mt-3 font-mono text-[10.5px] text-paper-100/60 uppercase tracking-[0.14em] flex items-center gap-2">
              <I.Info size={12}/> Storno bis 4 h vorher kostenfrei
            </div>
          </div>
        </div>

        {/* Mini regeln */}
        <div className="mt-4 bg-white rounded-md border border-stone-200 p-4">
          <h4 className="font-display text-[16px] text-stone-800">Regeln · Kurz</h4>
          <ul className="mt-2 space-y-1.5 text-[13.5px] text-stone-600">
            <li className="flex gap-2"><span className="text-sand-700">·</span> Max. 2 offene Buchungen pro Mitglied</li>
            <li className="flex gap-2"><span className="text-sand-700">·</span> Standardblock 90 Minuten</li>
            <li className="flex gap-2"><span className="text-sand-700">·</span> Bei Regen Halle 3 in Villach reserviert</li>
          </ul>
        </div>
      </div>

      <div className="absolute left-0 right-0 bottom-0"><BottomNav active={2}/></div>
    </div>
  );
}

/* ============================================================
   09 · ADMIN · MITGLIEDERLISTE (Desktop)
   ============================================================ */
function ScreenAdminMembers() {
  const rows = [
    { initials:'MH', name:'Martin Hofmann',     email:'m.hofmann@tsv-treffen.at',  team:'Herren II',   status:'Aktiv',      since:2014, lk:'11.3', dues:'Bezahlt',  tone:'lake' },
    { initials:'KW', name:'Katharina Wallner',  email:'k.wallner@tsv-treffen.at',  team:'Damen 35+',   status:'Aktiv',      since:2018, lk:'9.7',  dues:'Bezahlt',  tone:'sand' },
    { initials:'JS', name:'Julian Steiner',     email:'j.steiner@gmail.com',       team:'Herren II',   status:'Aktiv',      since:2021, lk:'14.1', dues:'Bezahlt',  tone:'forest' },
    { initials:'AB', name:'Anna Brunner',       email:'a.brunner@tsv-treffen.at',  team:'Jugend U12',  status:'Aktiv',      since:2019, lk:'—',    dues:'Bezahlt',  tone:'stone' },
    { initials:'LP', name:'Leon Pirker',        email:'leon.pirker@web.at',        team:'Herren I',    status:'Pausiert',   since:2017, lk:'7.4',  dues:'Offen',    tone:'lake' },
    { initials:'EM', name:'Eva Maria Rauter',   email:'evam.rauter@gmx.at',        team:'Damen 35+',   status:'Aktiv',      since:2022, lk:'12.8', dues:'Bezahlt',  tone:'sand' },
    { initials:'TW', name:'Tobias Wieser',      email:'t.wieser@tsv-treffen.at',   team:'Herren II',   status:'Probe',      since:2026, lk:'15.0', dues:'Anteilig', tone:'forest' },
    { initials:'RS', name:'Renate Steiner',     email:'r.steiner@aon.at',          team:'Damen 50+',   status:'Aktiv',      since:2009, lk:'13.2', dues:'Bezahlt',  tone:'stone' },
    { initials:'GP', name:'Gregor Pucher',      email:'gp@pucher-bau.at',          team:'Vorstand',    status:'Ehrenmitgl.',since:2003, lk:'—',    dues:'Bezahlt',  tone:'lake' },
    { initials:'NK', name:'Nina Köfer',         email:'n.koefer@tsv-treffen.at',   team:'Jugend U16',  status:'Aktiv',      since:2024, lk:'14.6', dues:'Bezahlt',  tone:'sand' },
  ];
  const duesTone = { Bezahlt:'forest', Offen:'danger', Anteilig:'warn' };
  const statusTone = { Aktiv:'lake', Pausiert:'neutral', Probe:'sand', 'Ehrenmitgl.':'dark' };

  return (
    <div className="bg-paper-100 border border-stone-200 rounded-lg overflow-hidden">
      <TopNav/>
      <div className="px-8 py-6">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">Adminbereich</div>
            <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">Mitglieder</h1>
          </div>
          <div className="flex items-center gap-2">
            <Btn variant="secondary" icon={<I.Download size={16}/>}>Export CSV</Btn>
            <Btn variant="primary" icon={<I.Plus size={16}/>}>Mitglied anlegen</Btn>
          </div>
        </div>

        {/* Stat tiles */}
        <div className="mt-6 grid grid-cols-4 gap-3">
          {[
            { l:'Gesamt',     v:'186', s:'+12 in 2026', tone:'lake' },
            { l:'Aktiv',      v:'171', s:'92 % Anteil', tone:'forest' },
            { l:'Beiträge offen', v:'7', s:'EUR 1.260', tone:'danger' },
            { l:'Probemitgl.', v:'8',  s:'4 in Bearbeitung', tone:'sand' },
          ].map(t => (
            <div key={t.l} className="bg-white rounded-lg border border-stone-200 p-5">
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">{t.l}</div>
              <div className="font-display text-[36px] text-stone-800 mt-1 leading-none">{t.v}</div>
              <div className={`mt-2 text-[12.5px] font-medium ${
                t.tone==='lake'?'text-lake-700':t.tone==='forest'?'text-forest-700':
                t.tone==='danger'?'text-danger':'text-sand-700'
              }`}>{t.s}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mt-6 flex items-center gap-3">
          <div className="flex-1 h-11 bg-white rounded-md border border-stone-200 px-4 flex items-center gap-2.5 max-w-md">
            <I.Search size={16} className="text-stone-400"/>
            <input className="flex-1 bg-transparent text-[14px] outline-none" placeholder="Suche nach Name, E-Mail, Mannschaft…"/>
            <span className="font-mono text-[10.5px] text-stone-400 uppercase">⌘K</span>
          </div>
          <button className="h-11 px-4 inline-flex items-center gap-2 rounded-md bg-white border border-stone-200 text-[14px] text-stone-700">
            <I.Filter size={15}/> Mannschaft <I.ChevronDown size={14} className="text-stone-400"/>
          </button>
          <button className="h-11 px-4 inline-flex items-center gap-2 rounded-md bg-white border border-stone-200 text-[14px] text-stone-700">
            Status <I.ChevronDown size={14} className="text-stone-400"/>
          </button>
          <button className="h-11 px-4 inline-flex items-center gap-2 rounded-md bg-white border border-stone-200 text-[14px] text-stone-700">
            Beitrag <I.ChevronDown size={14} className="text-stone-400"/>
          </button>
          <span className="ml-auto font-mono text-[11px] text-stone-500 uppercase tracking-[0.14em]">10 von 186</span>
        </div>

        {/* Table */}
        <div className="mt-4 bg-white rounded-lg border border-stone-200 overflow-hidden">
          <div className="grid grid-cols-[40px_minmax(220px,1fr)_140px_120px_80px_120px_40px] gap-3 px-5 py-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-500 bg-paper-50 border-b border-stone-200">
            <span><Checkbox/></span>
            <span>Name · E-Mail</span>
            <span>Mannschaft</span>
            <span>Status</span>
            <span>LK</span>
            <span>Beitrag 26</span>
            <span></span>
          </div>
          {rows.map((r, i) => (
            <div key={r.email} className={[
              'grid grid-cols-[40px_minmax(220px,1fr)_140px_120px_80px_120px_40px] gap-3 px-5 py-3 items-center',
              i % 2 ? '' : 'bg-paper-50/40',
              'border-b border-stone-100 last:border-b-0 hover:bg-paper-50',
            ].join(' ')}>
              <Checkbox/>
              <div className="flex items-center gap-3 min-w-0">
                <Avatar initials={r.initials} size={36} tone={r.tone}/>
                <div className="min-w-0">
                  <div className="text-[14px] font-medium text-stone-800 leading-tight truncate">{r.name}</div>
                  <div className="font-mono text-[11px] text-stone-500 truncate">{r.email}</div>
                </div>
              </div>
              <span className="text-[13.5px] text-stone-700">{r.team}</span>
              <Badge tone={statusTone[r.status]}>{r.status}</Badge>
              <span className="font-mono text-[12.5px] text-stone-700">{r.lk}</span>
              <Badge tone={duesTone[r.dues]}>{r.dues}</Badge>
              <button className="text-stone-400 hover:text-stone-700 w-7 h-7 rounded-md inline-flex items-center justify-center hover:bg-stone-100"><I.More size={16}/></button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-stone-500 uppercase tracking-[0.14em]">
          <span>Seite 1 von 19</span>
          <div className="flex items-center gap-1.5">
            <button className="w-9 h-9 rounded-md bg-white border border-stone-200 inline-flex items-center justify-center text-stone-600 hover:bg-paper-50"><I.ArrowLeft size={14}/></button>
            {['1','2','3','…','19'].map((n,i)=>(
              <button key={i} className={[
                'w-9 h-9 rounded-md text-[13px] font-medium',
                i === 0 ? 'bg-stone-800 text-paper-50' : 'bg-white border border-stone-200 text-stone-700 hover:bg-paper-50',
              ].join(' ')}>{n}</button>
            ))}
            <button className="w-9 h-9 rounded-md bg-white border border-stone-200 inline-flex items-center justify-center text-stone-600 hover:bg-paper-50"><I.ArrowRight size={14}/></button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MOCKUP SECTION (lays out all screens)
   ============================================================ */
function MockupsShowcase() {
  return (
    <div className="space-y-16">
      {/* Mobile-first row 1 — Public + Login + Dashboard */}
      <div>
        <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500 mb-8">Öffentlich · Mitgliederbereich</h3>
        <div className="flex gap-10 flex-wrap justify-center">
          <Phone label="01 · Landing"     statusbar="dark"><ScreenLanding/></Phone>
          <Phone label="02 · Login"       statusbar="light"><ScreenLogin/></Phone>
          <Phone label="03 · Dashboard"   statusbar="light"><ScreenDashboard/></Phone>
        </div>
      </div>

      <div>
        <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500 mb-8">Inhalte · Kalender · Anwesenheit</h3>
        <div className="flex gap-10 flex-wrap justify-center">
          <Phone label="04 · News-Detail" statusbar="light"><ScreenNewsDetail/></Phone>
          <Phone label="05 · Kalender"    statusbar="light"><ScreenCalendar/></Phone>
          <Phone label="06 · Anwesenheit" statusbar="light"><ScreenAttendance/></Phone>
        </div>
      </div>

      <div>
        <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500 mb-8">Profil · Platzbuchung</h3>
        <div className="flex gap-10 flex-wrap justify-center">
          <Phone label="07 · Profil"        statusbar="light"><ScreenProfile/></Phone>
          <Phone label="08 · Platzbuchung"  statusbar="light"><ScreenBooking/></Phone>
        </div>
      </div>

      <div>
        <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500 mb-8">Adminbereich · Desktop</h3>
        <div className="flex justify-center">
          <div className="max-w-[1200px] w-full">
            <ScreenAdminMembers/>
            <div className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500 text-center rule-eyebrow">09 · Mitgliederliste</div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MockupsShowcase });
