'use client';

type Props = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
};

export function Field({ id, label, hint, error, children }: Props) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <div className="mt-1">{children}</div>
      {hint && !error && <p className="mt-1 text-xs text-neutral-500">{hint}</p>}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
