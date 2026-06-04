'use client';
import { useId } from 'react';

export type SwitchProps = {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  name?: string;
};

export function Switch({ label, checked, defaultChecked, onChange, name }: SwitchProps) {
  const id = useId();
  return (
    <label
      htmlFor={`sw-${id}`}
      className="inline-flex items-center gap-3 cursor-pointer select-none"
    >
      <span className="relative inline-block w-11 h-6">
        <input
          id={`sw-${id}`}
          type="checkbox"
          role="switch"
          name={name}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={(e) => onChange?.(e.currentTarget.checked)}
          className="peer absolute inset-0 opacity-0 cursor-pointer"
        />
        <span
          className={[
            'absolute inset-0 rounded-full transition-colors',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-lake-500/40 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-paper-100',
            checked ? 'bg-lake-600' : 'bg-stone-300',
          ].join(' ')}
        />
        <span
          className={[
            'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all',
            checked ? 'left-[22px]' : 'left-0.5',
          ].join(' ')}
        />
      </span>
      {label && <span className="text-[15px] text-stone-700">{label}</span>}
    </label>
  );
}
