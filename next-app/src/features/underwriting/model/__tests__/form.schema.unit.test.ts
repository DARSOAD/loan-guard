import { describe, it, expect } from 'vitest';
import { validateForm } from '../form.schema';
import type { UnderwriteForm } from '../types';

describe('validateForm', () => {
  it('It coerces strings to numbers and validates a valid case.', () => {
    const result = validateForm({
      monthlyIncome: '5000',
      monthlyDebts: '1500',
      loanAmount: '200000',
      propertyValue: '260000',
      fico: '700',
      occupancy: 'primary',
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.fico).toBe(700);
      expect(typeof result.data.monthlyIncome).toBe('number');
    }
  });

  it('It returns field errors when invalid data is provided.', () => {
    const invalidForm: UnderwriteForm = {
        monthlyIncome: '',
        monthlyDebts: '-1',
        loanAmount: '0',
        propertyValue: '0',
        fico: '100',
        occupancy: 'primary',
      };
    
      const result = validateForm(invalidForm);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(Object.keys(result.errors)).toContain('monthlyIncome');
        expect(Object.keys(result.errors)).toContain('monthlyDebts');
        expect(Object.keys(result.errors)).toContain('loanAmount');
        expect(Object.keys(result.errors)).toContain('propertyValue');
        expect(Object.keys(result.errors)).toContain('fico');
      }
  });
});
