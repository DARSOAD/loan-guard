'use client';

import { useUnderwritingStore } from '../model/state';

function toPct(x: number) {
  return Number.isFinite(x) ? `${(x * 100).toFixed(2)}%` : '—';
}

export default function HistoryList() {
  const history = useUnderwritingStore((s) => s.history);
  const clear = useUnderwritingStore((s) => s.clearHistory);
  const remove = useUnderwritingStore((s) => s.removeFromHistory);

  if (!history.length) return null;

  return (
    <section className="rounded-lg border p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-base font-semibold">Past evaluations</h3>
        <button
          onClick={clear}
          className="text-sm underline text-neutral-700 hover:text-neutral-900"
        >
          Clear history
        </button>
      </div>

      <ul className="divide-y">
        {history.map((h) => (
          <li key={h.id} className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`inline-block rounded px-2 py-0.5 text-xs text-white ${
                    h.result.decision === 'Approve'
                      ? 'bg-green-600'
                      : h.result.decision === 'Refer'
                      ? 'bg-yellow-500'
                      : 'bg-red-600'
                  }`}
                >
                  {h.result.decision}
                </span>
                <div className="text-sm">
                  <div className="font-medium">
                    DTI {toPct(h.result.dti)} • LTV {toPct(h.result.ltv)}
                  </div>
                  <div className="text-neutral-500">
                    {new Date(h.at).toLocaleString()}
                    {typeof h.durationMs === 'number' ? ` • ${h.durationMs}ms` : null}
                  </div>
                </div>
              </div>
              <button
                onClick={() => remove(h.id)}
                className="text-xs text-neutral-500 hover:text-neutral-800"
                aria-label="Remove from history"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}