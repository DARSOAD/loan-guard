function toPct(x: number) {
    if (!Number.isFinite(x)) return '—';
    return `${(x * 100).toFixed(2)}%`;
  }
  
  export function MetricsPanel({ dti, ltv }: { dti: number; ltv: number }) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border p-3">
          <div className="text-sm text-neutral-500">DTI</div>
          <div className="text-xl font-semibold">{toPct(dti)}</div>
          <div className="text-xs text-neutral-500">Debt-to-Income ratio</div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-sm text-neutral-500">LTV</div>
          <div className="text-xl font-semibold">{toPct(ltv)}</div>
          <div className="text-xs text-neutral-500">Loan-to-Value ratio</div>
        </div>
      </div>
    );
  }
  