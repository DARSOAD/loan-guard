'use client';

import { useState } from 'react';
import { useUnderwritingStore } from '../model/state';
import type { UnderwriteForm } from '../model/types';
import { validateForm, type FormErrors } from '../model/form.schema';
import { FormFields } from './fragments/FormFields';
import { SubmitButton } from './primitives/SubmitButton';

const initialValues: UnderwriteForm = {
  monthlyIncome: '',
  monthlyDebts: '',
  loanAmount: '',
  propertyValue: '',
  fico: '',
  occupancy: 'primary',
};

export function UnderwriteForm() {
  const { submit, status, error, reset } = useUnderwritingStore();
  const [values, setValues] = useState<UnderwriteForm>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  function onChange<K extends keyof UnderwriteForm>(key: K, value: UnderwriteForm[K]) {
    setValues((s) => ({ ...s, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    const result = validateForm(values);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    await submit(result.data);
  }

  function handleReset() {
    setValues(initialValues);
    setErrors({});
    reset();
  }

  const loading = status === 'loading';

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Underwriting</h2>
        <button
          type="button"
          onClick={handleReset}
          className="text-sm underline disabled:opacity-50"
          disabled={loading}
        >
          Reset
        </button>
      </div>

      <FormFields values={values} errors={errors} onChange={onChange} />

      <div className="pt-2">
        <SubmitButton loading={loading} />
      </div>

      {status === 'error' && error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          <strong>Error:</strong> {error.message}
        </div>
      )}
    </form>
  );
}