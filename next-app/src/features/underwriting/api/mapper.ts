import { UnderwriteRequestDTO, UnderwriteResponseDTO } from './dto';
import { UnderwriteForm, UnderwriteResult } from '../model/types';

export const formToDTO = (f: UnderwriteForm): UnderwriteRequestDTO => ({
  monthlyIncome: Number(f.monthlyIncome) || 0,
  monthlyDebts: Number(f.monthlyDebts) || 0,
  loanAmount: Number(f.loanAmount) || 0,
  propertyValue: Number(f.propertyValue) || 0,
  fico: Number(f.fico) || 0,
  occupancy: f.occupancy,
});

export const dtoToDomain = (r: UnderwriteResponseDTO): UnderwriteResult => ({
  decision: r.decision,
  dti: r.dti,
  ltv: r.ltv,
  reasons: r.reasons,
  thresholds: r.thresholds,
});