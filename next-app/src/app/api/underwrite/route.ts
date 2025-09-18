import { NextResponse } from 'next/server';
import { z } from 'zod';

const UnderwriteInput = z.object({
  monthlyIncome: z.number().finite().nonnegative(),
  monthlyDebts: z.number().finite().nonnegative(),
  loanAmount: z.number().finite().positive(),
  propertyValue: z.number().finite().positive(),
  fico: z.number().int().min(300).max(850),
  occupancy: z.enum(['primary', 'secondary', 'investment']),
});

type UnderwriteInput = z.infer<typeof UnderwriteInput>;

type Decision = 'Approve' | 'Refer' | 'Decline';

function calcDTI({ monthlyDebts, monthlyIncome }: UnderwriteInput): number {
  if (monthlyIncome === 0) return Number.POSITIVE_INFINITY;
  return monthlyDebts / monthlyIncome; // ratio 0..1
}

function calcLTV({ loanAmount, propertyValue }: UnderwriteInput): number {
  return loanAmount / propertyValue; // ratio 0..1
}


function decide(dti: number, ltv: number, fico: number): Decision {
  if (dti <= 0.43 && ltv <= 0.80 && fico >= 680) return 'Approve';
  if (dti <= 0.50 && ltv <= 0.95 && fico >= 660) return 'Refer';
  return 'Decline';
}

function buildReasons(decision: Decision, dti: number, ltv: number, fico: number): string[] {
  const reasons: string[] = [];
  
  const dtiPct = (dti * 100).toFixed(2) + '%';
  const ltvPct = (ltv * 100).toFixed(2) + '%';

  if (decision === 'Approve') {
    reasons.push(`Meets standard: DTI ${dtiPct} ≤ 43%, LTV ${ltvPct} ≤ 80%, FICO ${fico} ≥ 680`);
    return reasons;
  }

  
  if (dti > 0.43) reasons.push(`DTI too high (${dtiPct}), must be ≤ 43% for Approve`);
  if (ltv > 0.80) reasons.push(`LTV too high (${ltvPct}), must be ≤ 80% for Approve`);
  if (fico < 680) reasons.push(`FICO too low (${fico}), must be ≥ 680 for Approve`);

  if (decision === 'Refer') {
    reasons.push(`Fits refer band: DTI ≤ 50%, LTV ≤ 95%, FICO ≥ 660`);
    
    if (dti <= 0.5) reasons.push(`DTI ok for Refer (${dtiPct} ≤ 50%)`);
    if (ltv <= 0.95) reasons.push(`LTV ok for Refer (${ltvPct} ≤ 95%)`);
    if (fico >= 660) reasons.push(`FICO ok for Refer (${fico} ≥ 660)`);
  }

  if (decision === 'Decline') {
    
    if (dti > 0.5) reasons.push(`DTI exceeds Refer threshold: ${dtiPct} > 50%`);
    if (ltv > 0.95) reasons.push(`LTV exceeds Refer threshold: ${ltvPct} > 95%`);
    if (fico < 660) reasons.push(`FICO below Refer threshold: ${fico} < 660`);
  }

  return reasons;
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = UnderwriteInput.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'ValidationError', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const input = parsed.data;
    const dti = calcDTI(input);
    const ltv = calcLTV(input);
    const decision = decide(dti, ltv, input.fico);
    const reasons = buildReasons(decision, dti, ltv, input.fico);

    return NextResponse.json(
      {
        decision,
        dti,               
        ltv,               
        reasons,           
        input,
        thresholds: {
          approve: { dti: 0.43, ltv: 0.80, fico: 680 },
          refer: { dti: 0.50, ltv: 0.95, fico: 660 },
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
        {
            error: "ServerError",
            message: `Unexpected error processing request: ${error instanceof Error ? error.message : String(error)}`,
        },
      { status: 500 },
    );
  }
}
