import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'destructive';
type Size = 'sm' | 'md' | 'lg' | 'xl';

export type ButtonProps = {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconAfter?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[14px] gap-1.5',
  md: 'h-11 px-5 text-[15px] gap-2',
  lg: 'h-12 px-6 text-[16px] gap-2.5',
  xl: 'h-14 px-8 text-[17px] gap-3',
};

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-lake-700 text-paper-50 hover:bg-lake-800 border border-lake-800/40',
  secondary: 'bg-white text-stone-800 border border-stone-200 hover:bg-paper-100',
  ghost: 'bg-transparent text-stone-700 hover:bg-stone-100',
  accent: 'bg-sand-500 text-stone-900 hover:bg-sand-600 border border-sand-700/30',
  destructive: 'bg-white text-danger border border-danger/30 hover:bg-danger hover:text-white',
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconAfter,
  children,
  disabled,
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center font-medium rounded-md transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-lake-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper-100',
        SIZE_CLASSES[size],
        VARIANT_CLASSES[variant],
        disabled ? 'opacity-50 pointer-events-none' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {icon}
      {children}
      {iconAfter}
    </button>
  );
}
