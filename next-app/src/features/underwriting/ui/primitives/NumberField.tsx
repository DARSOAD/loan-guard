'use client';

import { Field } from './Field';

type Props = {
  id: string;
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  step?: string;
  required?: boolean;
  error?: string;
  hint?: string;
};

export function NumberField({
  id,
  label,
  value,
  onChange,
  step = '0.01',
  required,
  error,
  hint,
}: Props) {
  return (
    <Field id={id} label={label} hint={hint} error={error}>
      <input
        id={id}
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border px-3 py-2 text-black"
        required={required}
        inputMode="decimal"
      />
    </Field>
  );
}
