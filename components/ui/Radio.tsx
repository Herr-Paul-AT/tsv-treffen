'use client';
import { useId } from 'react';

export type RadioProps = {
  label?: string;
  name?: string;
  value?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (value: string) => void;
};

export function Radio({ label, name, value, checked, defaultChecked, onChange }: RadioProps) {
  const id = useId();
  return (
    <label htmlFor={`rd-${id}`} className="flex items-start gap-3 cursor-pointer select-none">
      <span className="relative inline-flex items-center justify-center flex-none">
        <input
          id={`rd-${id}`}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={(e) => onChange?.(e.currentTarget.value)}
          className="peer absolute inset-0 opacity-0 w-5 h-5 cursor-pointer"
        />
        <span
          className={[
            'mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full border transition-colors',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-lake-500/40 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-paper-100',
            checked ? 'border-lake-700' : 'border-stone-300 hover:border-stone-400',
          ].join(' ')}
        >
          {checked && <span className="w-2.5 h-2.5 rounded-full bg-lake-700" />}
        </span>
      </span>
      {label && <span className="text-[15px] text-stone-700 leading-tight">{label}</span>}
    </label>
  );
}
