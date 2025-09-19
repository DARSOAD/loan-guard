'use client';

import type { Thresholds } from '../../model/types';

export function ThresholdTable({ thresholds }: { thresholds: Thresholds }) {
  return (
    <div className="rounded-lg border p-4">
      <h4 className="text-sm font-semibold">Thresholds</h4>
      <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
        <div />
        <div className="font-medium">Approve</div>
        <div className="font-medium">Refer</div>

        <div className="text-neutral-600">DTI</div>
        <div>{(thresholds.approve.dti * 100).toFixed(0)}%</div>
        <div>{(thresholds.refer.dti * 100).toFixed(0)}%</div>

        <div className="text-neutral-600">LTV</div>
        <div>{(thresholds.approve.ltv * 100).toFixed(0)}%</div>
        <div>{(thresholds.refer.ltv * 100).toFixed(0)}%</div>

        <div className="text-neutral-600">FICO</div>
        <div>{thresholds.approve.fico}</div>
        <div>{thresholds.refer.fico}</div>
      </div>
    </div>
  );
}