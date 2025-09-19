import { z } from 'zod';
import type { UnderwriteForm } from './types';

const num = (schema: z.ZodNumber) =>
  z.preprocess((v) => {
    if (v === '' || v === null || v === undefined) return undefined;
    if (typeof v === 'string') return Number(v);
    return v;
  }, schema);

export const UnderwriteFormSchema = z.object({
  monthlyIncome:  num(z.number().nonnegative()),
  monthlyDebts:   num(z.number().nonnegative()),
  loanAmount:     num(z.number().positive()),
  propertyValue:  num(z.number().positive()),
  fico:           num(z.number().int().min(300).max(850)),
  occupancy: z.enum(['primary', 'secondary', 'investment']),
});

export type UnderwriteFormValues = z.infer<typeof UnderwriteFormSchema>;
export type FormErrors = Partial<Record<keyof UnderwriteFormValues, string>>;

export function validateForm(
  values: UnderwriteForm
): { ok: true; data: UnderwriteFormValues } | { ok: false; errors: FormErrors } {
  const parsed = UnderwriteFormSchema.safeParse(values);
  if (parsed.success) return { ok: true, data: parsed.data };

  const fieldErrors = parsed.error.flatten().fieldErrors;
  const mapped: FormErrors = {};
  for (const [k, arr] of Object.entries(fieldErrors)) {
    if (arr && arr.length) mapped[k as keyof FormErrors] = arr[0]!;
  }
  return { ok: false, errors: mapped };
}