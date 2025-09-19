'use client';

import type { UnderwriteResult } from '../../model/types';
import { DecisionCard } from '../DecisionCard';
import { MetricsPanel } from '../MetricsPanel';

export function ResultSummary({ result }: { result: UnderwriteResult }) {
  return (
    <div className="space-y-4">
      <DecisionCard decision={result.decision} />
      <MetricsPanel dti={result.dti} ltv={result.ltv} />
    </div>
  );
}