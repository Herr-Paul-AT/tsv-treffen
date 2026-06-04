/* ============================================================
   TSV SCHLOSS TREFFEN — LOGO LIBRARY (Richtung 03)
   Tennisball als Sonne · Gerlitzen · Schloss · Ossiachersee
   ============================================================ */

/* Pure mark (no text), scalable */
function TSVMark({
  size = 96,
  variant = 'color',   // 'color' | 'mono' | 'negative' | 'compact'
  className = '',
}) {
  const palette = {
    color:    { stone:'#3E4448', lake:'#3A6985', sand:'#C39265', forest:'#4F6B53', frame:'#3E4448' },
    mono:     { stone:'#1F2224', lake:'#1F2224', sand:'#1F2224', forest:'#1F2224', frame:'#1F2224' },
    negative: { stone:'#FFFFFF', lake:'#FFFFFF', sand:'#FFFFFF', forest:'#FFFFFF', frame:'#FFFFFF' },
  };
  const isNeg = variant === 'negative';
  const isMono = variant === 'mono';
  const isCompact = variant === 'compact';
  const c = palette[isCompact ? 'color' : variant] || palette.color;
  const ballFill = (isMono || isNeg) ? c.sand : '#C39265';
  const seamCol  = isNeg ? '#1F2224' : (isMono ? '#FFFFFF' : '#3E4448');

  return (
    <svg
      viewBox="0 0 160 160"
      width={size} height={size}
      xmlns="http://www.w3.org/2000/svg"
      role="img" aria-label="TSV Schloss Treffen"
      className={className}
    >
      {/* circle frame */}
      <circle cx="80" cy="80" r="74" fill="none" stroke={c.frame} strokeWidth="2.5"/>
      <circle cx="80" cy="80" r="66" fill="none" stroke={c.frame} strokeWidth="0.6" opacity=".4"/>
      <defs>
        <clipPath id={`r3clip-${size}-${variant}`}>
          <circle cx="80" cy="80" r="66"/>
        </clipPath>
      </defs>
      <g clipPath={`url(#r3clip-${size}-${variant})`}>
        {/* tennis ball as sun */}
        <circle cx="104" cy="54" r="15" fill={ballFill}/>
        <path d="M90.5 50 Q104 62 117.5 50" fill="none" stroke={seamCol}
              strokeWidth="1.6" strokeLinecap="round"
              opacity={(isMono||isNeg) ? .9 : .8}/>
        <path d="M90.5 50 Q104 38 117.5 50" fill="none" stroke={seamCol}
              strokeWidth="1.0" strokeLinecap="round"
              opacity={(isMono||isNeg) ? .35 : .3}/>
        {/* mountains */}
        <path d="M14 100 L40 70 L62 88 L88 50 L120 80 L146 95 L146 110 L14 110 Z"
              fill={c.forest} opacity={(isMono||isNeg) ? 1 : .92}/>
        <path d="M14 102 L34 88 L56 96 L78 84 L102 96 L124 90 L146 102 L146 110 L14 110 Z"
              fill={c.forest} opacity={(isMono||isNeg) ? .6 : .55}/>
        {/* castle */}
        <g fill={c.stone}>
          <rect x="62" y="92" width="6" height="22"/>
          <rect x="62" y="89" width="2" height="3"/>
          <rect x="66" y="89" width="2" height="3"/>
          <rect x="68" y="98" width="16" height="16"/>
          <rect x="76" y="86" width="6" height="12"/>
          <rect x="76" y="83" width="2" height="3"/>
          <rect x="80" y="83" width="2" height="3"/>
          <rect x="86" y="92" width="6" height="22"/>
          <rect x="86" y="89" width="2" height="3"/>
          <rect x="90" y="89" width="2" height="3"/>
        </g>
        {/* water */}
        <path d="M16 122 L144 122" stroke={c.lake} strokeWidth="2.4" strokeLinecap="round"/>
        <path d="M22 130 L138 130" stroke={c.lake} strokeWidth="2.2" strokeLinecap="round" opacity=".7"/>
        <path d="M30 138 L130 138" stroke={c.lake} strokeWidth="1.8" strokeLinecap="round" opacity=".45"/>
      </g>
    </svg>
  );
}

/* Wordmark only */
function TSVWordmark({ color = '#3E4448', accent = '#C39265', size = 'lg', subtitle = true }) {
  const sizes = {
    sm: { title: 18, sub: 9,  gap: 6 },
    md: { title: 26, sub: 10, gap: 8 },
    lg: { title: 40, sub: 11, gap: 10 },
    xl: { title: 56, sub: 12, gap: 12 },
  }[size];
  return (
    <div className="flex flex-col items-center" style={{ gap: sizes.gap }}>
      <div className="font-display"
        style={{
          fontWeight: 500, color,
          fontSize: sizes.title, lineHeight: .95, letterSpacing: '-0.005em',
        }}>
        Schloss Treffen
      </div>
      {subtitle && (
        <div className="flex items-center" style={{ gap: 12, color: accent }}>
          <span style={{ width: 28, height: 1, background: 'currentColor', opacity: .6 }}/>
          <span className="font-mono" style={{
            fontSize: Math.max(10, sizes.sub),
            letterSpacing: '0.42em', color, opacity: .8,
            textTransform: 'uppercase', fontWeight: 500,
          }}>TSV · Tennis</span>
          <span style={{ width: 28, height: 1, background: 'currentColor', opacity: .6 }}/>
        </div>
      )}
    </div>
  );
}

/* Horizontal lockup — mark + wordmark for headers */
function TSVLockup({ height = 36, color = '#3E4448', accent = '#C39265' }) {
  return (
    <div className="flex items-center" style={{ gap: 12 }}>
      <TSVMark size={height} variant="color"/>
      <div className="flex flex-col leading-none" style={{ gap: 3 }}>
        <span className="font-display" style={{
          fontWeight: 600, color, fontSize: height * 0.5,
          letterSpacing: '-0.005em', lineHeight: 1,
        }}>Schloss Treffen</span>
        <span className="font-mono uppercase" style={{
          fontSize: Math.max(9, height * 0.22),
          letterSpacing: '0.32em', color, opacity: .65, fontWeight: 500,
        }}>TSV · Tennis · Kärnten</span>
      </div>
    </div>
  );
}

Object.assign(window, { TSVMark, TSVWordmark, TSVLockup });
