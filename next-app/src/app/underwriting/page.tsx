'use client';

import { UnderwriteForm } from '@/features/underwriting/ui/UnderwriteForm';
import { useUnderwritingStore } from '@/features/underwriting/model/state';
import { DecisionCard } from '@/features/underwriting/ui/DecisionCard';
import { MetricsPanel } from '@/features/underwriting/ui/MetricsPanel';
import { ReasonsList } from '@/features/underwriting/ui/ReasonsList';
import HistoryList from '@/features/underwriting/ui/HistoryList';

export default function UnderwritingPage() {
  const { status, result } = useUnderwritingStore();

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <UnderwriteForm />
      {status === 'success' && result && (
        <div className="space-y-4">
          <DecisionCard decision={result.decision} />
          <MetricsPanel dti={result.dti} ltv={result.ltv} />
          <ReasonsList reasons={result.reasons} thresholds={result.thresholds} />
        </div>
      )}
      <HistoryList />
    </div>
  );
}
