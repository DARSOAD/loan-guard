'use client';

type Props = {
  children?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
};

export function SubmitButton({ children = 'Submit', loading, disabled }: Props) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
    >
      {loading ? 'Submitting…' : children}
    </button>
  );
}
