'use client';

import { Field } from './Field';

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  id: string;
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: Option<T>[];
  error?: string;
  hint?: string;
};

export function SelectField<T extends string>({
  id, label, value, onChange, options, error, hint,
}: Props<T>) {
  return (
    <Field id={id} label={label} hint={hint} error={error}>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full rounded border px-3 py-2 text-black"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
