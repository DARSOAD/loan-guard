export type Occupancy = 'primary' | 'secondary' | 'investment';
export type Decision = 'Approve' | 'Refer' | 'Decline';

export interface UnderwriteForm {
  monthlyIncome: number | string;
  monthlyDebts: number | string;
  loanAmount: number | string;
  propertyValue: number | string;
  fico: number | string;
  occupancy: Occupancy;
}

export interface Thresholds {
  approve: { dti: number; ltv: number; fico: number };
  refer: { dti: number; ltv: number; fico: number };
}

export interface UnderwriteResult {
  decision: Decision;
  dti: number;
  ltv: number;
  reasons: string[];
  thresholds: Thresholds;
}

export type UnderwritingStatus = 'idle' | 'loading' | 'success' | 'error';

export interface UnderwritingError {
  message: string;
  status?: number;
  details?: unknown;
}


export interface UnderwriteInputSnapshot {
  monthlyIncome: number;
  monthlyDebts: number;
  loanAmount: number;
  propertyValue: number;
  fico: number;
  occupancy: Occupancy;
}

export interface UnderwriteHistoryItem {
  id: string;
  at: number; // epoch ms
  input: UnderwriteInputSnapshot;
  result: UnderwriteResult;
  durationMs?: number;
}

export type UnderwriteHistory = UnderwriteHistoryItem[];
