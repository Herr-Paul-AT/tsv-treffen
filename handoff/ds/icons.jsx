/* ============================================================
   ICON SET — outline, 24×24, stroke 1.6
   Spare, generic icons in lucide style. Inline SVG only.
   ============================================================ */

const Ico = ({ children, size = 20, stroke = 1.6, className = '' }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={stroke}
    strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true"
  >{children}</svg>
);

const I = {
  Home:     (p) => <Ico {...p}><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></Ico>,
  Calendar: (p) => <Ico {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M8 3v4M16 3v4"/></Ico>,
  News:     (p) => <Ico {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/></Ico>,
  User:     (p) => <Ico {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></Ico>,
  Users:    (p) => <Ico {...p}><circle cx="9" cy="8" r="3.5"/><circle cx="17" cy="9" r="2.8"/><path d="M2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5"/><path d="M14.5 14.5c2-.3 5 1 5 4"/></Ico>,
  Ball:     (p) => <Ico {...p}><circle cx="12" cy="12" r="9"/><path d="M3.5 9.5C7 8 10 11 12 12s5 4 8.5 2.5"/><path d="M3.5 14.5C7 16 10 13 12 12s5-4 8.5-2.5"/></Ico>,
  Bell:     (p) => <Ico {...p}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 19a2 2 0 0 0 4 0"/></Ico>,
  Search:   (p) => <Ico {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></Ico>,
  Settings: (p) => <Ico {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .4 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.4 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.4l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .4-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.4-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.4h0a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.4l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.4 1.9v0a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1"/></Ico>,
  Check:    (p) => <Ico {...p}><path d="m5 12 5 5L20 7"/></Ico>,
  X:        (p) => <Ico {...p}><path d="M6 6 18 18M18 6 6 18"/></Ico>,
  ArrowRight:(p)=> <Ico {...p}><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></Ico>,
  ArrowLeft:(p) => <Ico {...p}><path d="M19 12H5"/><path d="m11 6-6 6 6 6"/></Ico>,
  ChevronDown:(p)=> <Ico {...p}><path d="m6 9 6 6 6-6"/></Ico>,
  ChevronRight:(p)=> <Ico {...p}><path d="m9 6 6 6-6 6"/></Ico>,
  Plus:     (p) => <Ico {...p}><path d="M12 5v14M5 12h14"/></Ico>,
  Minus:    (p) => <Ico {...p}><path d="M5 12h14"/></Ico>,
  More:     (p) => <Ico {...p}><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></Ico>,
  Menu:     (p) => <Ico {...p}><path d="M3 6h18M3 12h18M3 18h18"/></Ico>,
  Filter:   (p) => <Ico {...p}><path d="M3 5h18l-7 9v6l-4-2v-4Z"/></Ico>,
  Pin:      (p) => <Ico {...p}><path d="M12 22V13"/><path d="M8 5h8l-1.5 8h-5L8 5Z"/><path d="M7 5h10"/></Ico>,
  Clock:    (p) => <Ico {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Ico>,
  MapPin:   (p) => <Ico {...p}><path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/></Ico>,
  Mail:     (p) => <Ico {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></Ico>,
  Lock:     (p) => <Ico {...p}><rect x="4.5" y="11" width="15" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></Ico>,
  Eye:      (p) => <Ico {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></Ico>,
  Logo:     () => null, // resolved by Logo.jsx
  Download: (p) => <Ico {...p}><path d="M12 4v12"/><path d="m6 11 6 6 6-6"/><path d="M4 20h16"/></Ico>,
  Upload:   (p) => <Ico {...p}><path d="M12 20V8"/><path d="m6 13 6-6 6 6"/><path d="M4 4h16"/></Ico>,
  Trophy:   (p) => <Ico {...p}><path d="M7 4h10v4a5 5 0 1 1-10 0V4Z"/><path d="M7 6H4a2 2 0 0 0 2 4M17 6h3a2 2 0 0 1-2 4"/><path d="M9 17h6l1 4H8l1-4Z"/><path d="M12 13v4"/></Ico>,
  Star:     (p) => <Ico {...p}><path d="m12 3 2.7 5.7 6.3.9-4.6 4.4 1.1 6.3L12 17.3 6.5 20.3 7.6 14 3 9.6l6.3-.9L12 3Z"/></Ico>,
  Sun:      (p) => <Ico {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></Ico>,
  Mountain: (p) => <Ico {...p}><path d="m3 20 6-10 4 5 3-4 5 9Z"/></Ico>,
  Wave:     (p) => <Ico {...p}><path d="M3 12c2 0 2-3 4-3s2 3 4 3 2-3 4-3 2 3 4 3"/><path d="M3 17c2 0 2-3 4-3s2 3 4 3 2-3 4-3 2 3 4 3"/></Ico>,
  Phone:    (p) => <Ico {...p}><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10 18.5h4"/></Ico>,
  Court:    (p) => <Ico {...p}><rect x="3" y="6" width="18" height="12" rx="1"/><path d="M12 6v12"/><path d="M3 12h18"/><path d="M3 9h3M3 15h3M18 9h3M18 15h3"/></Ico>,
  External: (p) => <Ico {...p}><path d="M14 4h6v6"/><path d="m20 4-9 9"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></Ico>,
  Edit:     (p) => <Ico {...p}><path d="M4 20h4l11-11-4-4L4 16v4Z"/><path d="m13 5 4 4"/></Ico>,
  Trash:    (p) => <Ico {...p}><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7v13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7"/><path d="M10 11v6M14 11v6"/></Ico>,
  Cup:      (p) => <Ico {...p}><path d="M5 4h12v4a6 6 0 1 1-12 0V4Z"/><path d="M17 6h2a2 2 0 0 1 0 4h-2"/><path d="M9 17h4l1 4H8l1-4Z"/></Ico>,
  Info:     (p) => <Ico {...p}><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></Ico>,
};

Object.assign(window, { Ico, I });
