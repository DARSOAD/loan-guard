'use client';

import type { UnderwriteForm, Occupancy  } from '../../model/types';
import type { FormErrors } from '../../model/form.schema';
import { NumberField } from '../primitives/NumberField';
import { SelectField } from '../primitives/SelectField';

type Props = {
  values: UnderwriteForm;
  errors: FormErrors;
  onChange: <K extends keyof UnderwriteForm>(key: K, value: UnderwriteForm[K]) => void;
};

const occupancyOptions: { value: Occupancy; label: string }[] = [
    { value: 'primary', label: 'Primary' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'investment', label: 'Investment' },
  ];

export function FormFields({ values, errors, onChange }: Props) {
  return (
    <div className="space-y-4">
      <NumberField
        id="monthlyIncome"
        label="Monthly Income"
        value={values.monthlyIncome}
        onChange={(v) => onChange('monthlyIncome', v)}
        required
        error={errors.monthlyIncome}
      />
      <NumberField
        id="monthlyDebts"
        label="Monthly Debts"
        value={values.monthlyDebts}
        onChange={(v) => onChange('monthlyDebts', v)}
        required
        error={errors.monthlyDebts}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          id="loanAmount"
          label="Loan Amount"
          value={values.loanAmount}
          onChange={(v) => onChange('loanAmount', v)}
          required
          error={errors.loanAmount}
        />
        <NumberField
          id="propertyValue"
          label="Property Value"
          value={values.propertyValue}
          onChange={(v) => onChange('propertyValue', v)}
          required
          error={errors.propertyValue}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          id="fico"
          label="FICO"
          step="1"
          value={values.fico}
          onChange={(v) => onChange('fico', v)}
          required
          error={errors.fico}
        />
       <SelectField<Occupancy>
          id="occupancy"
          label="Occupancy"
          value={values.occupancy}
          onChange={(v) => onChange('occupancy', v)}
          options={occupancyOptions}
          error={errors.occupancy}
        />
      </div>
    </div>
  );
}
