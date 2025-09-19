import type { Decision } from '../model/types';

function color(decision: Decision) {
  switch (decision) {
    case 'Approve':
      return 'bg-green-600';
    case 'Refer':
      return 'bg-yellow-500';
    case 'Decline':
      return 'bg-red-600';
  }
}

export function DecisionCard({ decision }: { decision: Decision }) {
  return (
    <div className="rounded-lg border p-4">
      <div className={`inline-block rounded px-3 py-1 text-white ${color(decision)}`}>
        {decision}
      </div>
      <p className="mt-2 text-sm text-neutral-700">
        Underwriting decision based on DTI, LTV, and FICO thresholds.
      </p>
    </div>
  );
}
