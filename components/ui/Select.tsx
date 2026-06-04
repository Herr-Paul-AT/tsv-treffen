'use client';
import { useId, useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';

export type SelectOption = { value: string; label: string };

export type SelectProps = {
  label: string;
  value: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
  placeholder?: string;
};

export function Select({ label, value, options, onChange, placeholder }: SelectProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <div ref={ref}>
      <label htmlFor={`sel-${id}`} className="block">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
          {label}
        </span>
        <button
          id={`sel-${id}`}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="mt-2 w-full flex items-center justify-between gap-2 h-12 px-4 bg-white rounded-md border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-lake-500 focus:ring-2 focus:ring-lake-500/15"
        >
          <span className={`text-[16px] ${current ? 'text-stone-800' : 'text-stone-400'}`}>
            {current?.label ?? placeholder ?? ''}
          </span>
          <span className="text-stone-400">
            <Icon.ChevronDown />
          </span>
        </button>
      </label>
      {open && (
        <ul
          role="listbox"
          className="relative z-20 mt-1.5 bg-white rounded-md border border-stone-200 shadow-pop py-1 max-h-72 overflow-y-auto"
        >
          {options.map((o) => (
            <li
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              onClick={() => {
                onChange?.(o.value);
                setOpen(false);
              }}
              className={`px-4 py-2.5 text-[15px] cursor-pointer flex items-center justify-between ${
                o.value === value
                  ? 'bg-lake-50 text-lake-800'
                  : 'text-stone-700 hover:bg-paper-100'
              }`}
            >
              {o.label}
              {o.value === value && <Icon.Check size={16} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
