import { describe, it, expect } from 'vitest';
import { formToDTO, dtoToDomain } from '../../api/mapper';
import type { UnderwriteForm } from '../../model/types';
import type { UnderwriteResponseDTO } from '../../api/dto';

describe('mapper', () => {
  it('formToDTO convierte strings a números y conserva occupancy', () => {
    const form: UnderwriteForm = {
      monthlyIncome: '5000',
      monthlyDebts: '1500',
      loanAmount: '200000',
      propertyValue: '285000',
      fico: '700',
      occupancy: 'primary',
    };

    const dto = formToDTO(form);
    expect(dto).toEqual({
      monthlyIncome: 5000,
      monthlyDebts: 1500,
      loanAmount: 200000,
      propertyValue: 285000,
      fico: 700,
      occupancy: 'primary',
    });
  });

  it('dtoToDomain mapea respuesta del backend al modelo de UI', () => {
    const apiResp: UnderwriteResponseDTO = {
      decision: 'Approve',
      dti: 0.3,
      ltv: 0.7,
      reasons: ['Meets standard thresholds'],
      input: {
        monthlyIncome: 5000,
        monthlyDebts: 1500,
        loanAmount: 200000,
        propertyValue: 285000,
        fico: 700,
        occupancy: 'primary',
      },
      thresholds: {
        approve: { dti: 0.43, ltv: 0.8, fico: 680 },
        refer: { dti: 0.5, ltv: 0.95, fico: 660 },
      },
    };

    const domain = dtoToDomain(apiResp);
    expect(domain.decision).toBe('Approve');
    expect(domain.dti).toBe(0.3);
    expect(domain.ltv).toBe(0.7);
    expect(domain.reasons).toHaveLength(1);
    expect(domain.thresholds.approve.fico).toBe(680);
  });
});