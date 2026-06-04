import type { InputHTMLAttributes, ReactNode } from 'react';
import { useId } from 'react';

export type TextFieldProps = {
  label: string;
  hint?: string;
  error?: string;
  leadIcon?: ReactNode;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'className'>;

export function TextField({
  label,
  hint,
  error,
  leadIcon,
  id,
  type = 'text',
  ...rest
}: TextFieldProps) {
  const reactId = useId();
  const inputId = id ?? `tf-${reactId}`;
  const describedBy = hint || error ? `${inputId}-desc` : undefined;

  return (
    <div>
      <label htmlFor={inputId} className="block">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
          {label}
        </span>
        <div
          className={[
            'mt-2 flex items-center gap-2.5 h-12 px-4 bg-white rounded-md border',
            error
              ? 'border-danger/60'
              : 'border-stone-200 focus-within:border-lake-500 focus-within:ring-2 focus-within:ring-lake-500/15',
          ].join(' ')}
        >
          {leadIcon && <span className="text-stone-400">{leadIcon}</span>}
          <input
            id={inputId}
            type={type}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className="bg-transparent flex-1 text-[16px] text-stone-800 placeholder-stone-400 outline-none"
            {...rest}
          />
        </div>
      </label>
      {(hint || error) && (
        <span
          id={describedBy}
          className={`mt-1.5 block text-[13px] ${error ? 'text-danger' : 'text-stone-500'}`}
        >
          {error || hint}
        </span>
      )}
    </div>
  );
}
