export type OccupancyDTO = 'primary' | 'secondary' | 'investment';
export type DecisionDTO = 'Approve' | 'Refer' | 'Decline';

export interface UnderwriteRequestDTO {
  monthlyIncome: number;
  monthlyDebts: number;
  loanAmount: number;
  propertyValue: number;
  fico: number;
  occupancy: OccupancyDTO;
}

export interface ThresholdsDTO {
  approve: { dti: number; ltv: number; fico: number };
  refer:   { dti: number; ltv: number; fico: number };
}

export interface UnderwriteResponseDTO {
  decision: DecisionDTO;
  dti: number;       // 0..1
  ltv: number;       // 0..1
  reasons: string[];
  input: UnderwriteRequestDTO;
  thresholds: ThresholdsDTO;
}


export interface ValidationErrorDTO {
  error: 'ValidationError';
  details: unknown;
}
export interface ServerErrorDTO {
  error: 'ServerError';
  message: string;
}
