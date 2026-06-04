/**
 * Icon-Set — Outline, 24×24, stroke 1.6 (lucide-Stil, eigenes Set).
 * Source: handoff/ds/icons.jsx
 */
import type { ReactNode, SVGProps } from 'react';

export type IconProps = {
  size?: number;
  stroke?: number;
  className?: string;
} & Omit<SVGProps<SVGSVGElement>, 'children' | 'stroke'>;

type IconBaseProps = IconProps & { children: ReactNode };

function IconBase({ size = 20, stroke = 1.6, className = '', children, ...rest }: IconBaseProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const Icon = {
  Home: (p: IconProps) => (
    <IconBase {...p}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </IconBase>
  ),
  Calendar: (p: IconProps) => (
    <IconBase {...p}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
      <path d="M8 3v4M16 3v4" />
    </IconBase>
  ),
  News: (p: IconProps) => (
    <IconBase {...p}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 8h10M7 12h10M7 16h6" />
    </IconBase>
  ),
  User: (p: IconProps) => (
    <IconBase {...p}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </IconBase>
  ),
  Users: (p: IconProps) => (
    <IconBase {...p}>
      <circle cx="9" cy="8" r="3.5" />
      <circle cx="17" cy="9" r="2.8" />
      <path d="M2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5" />
      <path d="M14.5 14.5c2-.3 5 1 5 4" />
    </IconBase>
  ),
  Ball: (p: IconProps) => (
    <IconBase {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.5 9.5C7 8 10 11 12 12s5 4 8.5 2.5" />
      <path d="M3.5 14.5C7 16 10 13 12 12s5-4 8.5-2.5" />
    </IconBase>
  ),
  Bell: (p: IconProps) => (
    <IconBase {...p}>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </IconBase>
  ),
  Search: (p: IconProps) => (
    <IconBase {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </IconBase>
  ),
  Settings: (p: IconProps) => (
    <IconBase {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .4 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.4 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.4l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .4-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.4-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.4h0a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.4l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.4 1.9v0a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1" />
    </IconBase>
  ),
  Check: (p: IconProps) => (
    <IconBase {...p}>
      <path d="m5 12 5 5L20 7" />
    </IconBase>
  ),
  X: (p: IconProps) => (
    <IconBase {...p}>
      <path d="M6 6 18 18M18 6 6 18" />
    </IconBase>
  ),
  ArrowRight: (p: IconProps) => (
    <IconBase {...p}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </IconBase>
  ),
  ArrowLeft: (p: IconProps) => (
    <IconBase {...p}>
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </IconBase>
  ),
  ChevronDown: (p: IconProps) => (
    <IconBase {...p}>
      <path d="m6 9 6 6 6-6" />
    </IconBase>
  ),
  ChevronRight: (p: IconProps) => (
    <IconBase {...p}>
      <path d="m9 6 6 6-6 6" />
    </IconBase>
  ),
  Plus: (p: IconProps) => (
    <IconBase {...p}>
      <path d="M12 5v14M5 12h14" />
    </IconBase>
  ),
  Minus: (p: IconProps) => (
    <IconBase {...p}>
      <path d="M5 12h14" />
    </IconBase>
  ),
  More: (p: IconProps) => (
    <IconBase {...p}>
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </IconBase>
  ),
  Menu: (p: IconProps) => (
    <IconBase {...p}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </IconBase>
  ),
  Filter: (p: IconProps) => (
    <IconBase {...p}>
      <path d="M3 5h18l-7 9v6l-4-2v-4Z" />
    </IconBase>
  ),
  Pin: (p: IconProps) => (
    <IconBase {...p}>
      <path d="M12 22V13" />
      <path d="M8 5h8l-1.5 8h-5L8 5Z" />
      <path d="M7 5h10" />
    </IconBase>
  ),
  Clock: (p: IconProps) => (
    <IconBase {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </IconBase>
  ),
  MapPin: (p: IconProps) => (
    <IconBase {...p}>
      <path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.5" />
    </IconBase>
  ),
  Mail: (p: IconProps) => (
    <IconBase {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </IconBase>
  ),
  Lock: (p: IconProps) => (
    <IconBase {...p}>
      <rect x="4.5" y="11" width="15" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </IconBase>
  ),
  Eye: (p: IconProps) => (
    <IconBase {...p}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </IconBase>
  ),
  Download: (p: IconProps) => (
    <IconBase {...p}>
      <path d="M12 4v12" />
      <path d="m6 11 6 6 6-6" />
      <path d="M4 20h16" />
    </IconBase>
  ),
  Upload: (p: IconProps) => (
    <IconBase {...p}>
      <path d="M12 20V8" />
      <path d="m6 13 6-6 6 6" />
      <path d="M4 4h16" />
    </IconBase>
  ),
  Trophy: (p: IconProps) => (
    <IconBase {...p}>
      <path d="M7 4h10v4a5 5 0 1 1-10 0V4Z" />
      <path d="M7 6H4a2 2 0 0 0 2 4M17 6h3a2 2 0 0 1-2 4" />
      <path d="M9 17h6l1 4H8l1-4Z" />
      <path d="M12 13v4" />
    </IconBase>
  ),
  Star: (p: IconProps) => (
    <IconBase {...p}>
      <path d="m12 3 2.7 5.7 6.3.9-4.6 4.4 1.1 6.3L12 17.3 6.5 20.3 7.6 14 3 9.6l6.3-.9L12 3Z" />
    </IconBase>
  ),
  Sun: (p: IconProps) => (
    <IconBase {...p}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </IconBase>
  ),
  Mountain: (p: IconProps) => (
    <IconBase {...p}>
      <path d="m3 20 6-10 4 5 3-4 5 9Z" />
    </IconBase>
  ),
  Wave: (p: IconProps) => (
    <IconBase {...p}>
      <path d="M3 12c2 0 2-3 4-3s2 3 4 3 2-3 4-3 2 3 4 3" />
      <path d="M3 17c2 0 2-3 4-3s2 3 4 3 2-3 4-3 2 3 4 3" />
    </IconBase>
  ),
  Phone: (p: IconProps) => (
    <IconBase {...p}>
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <path d="M10 18.5h4" />
    </IconBase>
  ),
  Court: (p: IconProps) => (
    <IconBase {...p}>
      <rect x="3" y="6" width="18" height="12" rx="1" />
      <path d="M12 6v12" />
      <path d="M3 12h18" />
      <path d="M3 9h3M3 15h3M18 9h3M18 15h3" />
    </IconBase>
  ),
  External: (p: IconProps) => (
    <IconBase {...p}>
      <path d="M14 4h6v6" />
      <path d="m20 4-9 9" />
      <path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
    </IconBase>
  ),
  Edit: (p: IconProps) => (
    <IconBase {...p}>
      <path d="M4 20h4l11-11-4-4L4 16v4Z" />
      <path d="m13 5 4 4" />
    </IconBase>
  ),
  Trash: (p: IconProps) => (
    <IconBase {...p}>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M6 7v13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7" />
      <path d="M10 11v6M14 11v6" />
    </IconBase>
  ),
  Cup: (p: IconProps) => (
    <IconBase {...p}>
      <path d="M5 4h12v4a6 6 0 1 1-12 0V4Z" />
      <path d="M17 6h2a2 2 0 0 1 0 4h-2" />
      <path d="M9 17h4l1 4H8l1-4Z" />
    </IconBase>
  ),
  Info: (p: IconProps) => (
    <IconBase {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.5v.5" />
    </IconBase>
  ),
  Cake: (p: IconProps) => (
    <IconBase {...p}>
      <path d="M12 6V3M10 4h4" />
      <rect x="4" y="10" width="16" height="9" rx="1.5" />
      <path d="M4 14c1.5 1.2 3 1.2 4.5 0S11.5 12.8 13 14s3 1.2 4.5 0S20 12.8 20 14" />
      <path d="M4 19h16" />
    </IconBase>
  ),
  Document: (p: IconProps) => (
    <IconBase {...p}>
      <path d="M7 3h7l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v4h4" />
      <path d="M9 13h6M9 17h6" />
    </IconBase>
  ),
} as const;

export type IconName = keyof typeof Icon;
