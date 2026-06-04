'use client';
import { useId, useRef, useEffect } from 'react';
import { Icon } from './Icon';

export type CheckboxProps = {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  name?: string;
  value?: string;
};

export function Checkbox({
  label,
  checked,
  defaultChecked,
  indeterminate,
  onChange,
  name,
  value,
}: CheckboxProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = !!indeterminate;
  }, [indeterminate]);

  const isOn = !!checked || !!indeterminate;

  return (
    <label htmlFor={`cb-${id}`} className="flex items-start gap-3 cursor-pointer select-none">
      <span className="relative inline-flex items-center justify-center flex-none">
        <input
          ref={inputRef}
          id={`cb-${id}`}
          type="checkbox"
          name={name}
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={(e) => onChange?.(e.currentTarget.checked)}
          className="peer absolute inset-0 opacity-0 w-5 h-5 cursor-pointer"
        />
        <span
          className={[
            'mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-sm border transition-colors',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-lake-500/40 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-paper-100',
            isOn
              ? 'bg-lake-700 border-lake-700 text-paper-50'
              : 'bg-white border-stone-300 hover:border-stone-400',
          ].join(' ')}
        >
          {checked && !indeterminate && <Icon.Check size={14} stroke={2.4} />}
          {indeterminate && <span className="w-2.5 h-0.5 bg-paper-50 rounded-full" />}
        </span>
      </span>
      {label && <span className="text-[15px] text-stone-700 leading-tight">{label}</span>}
    </label>
  );
}
