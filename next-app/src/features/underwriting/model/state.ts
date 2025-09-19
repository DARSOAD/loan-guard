'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { formToDTO, dtoToDomain } from '../api/mapper';
import { submitUnderwriting } from '../api/service';
import type {
  UnderwriteForm,
  UnderwriteResult,
  UnderwritingError,
  UnderwritingStatus,
  UnderwriteInputSnapshot,
  UnderwriteHistory,
} from './types';
import type { UnderwriteRequestDTO } from '../api/dto';

function toSnapshot(dto: UnderwriteRequestDTO): UnderwriteInputSnapshot {
  return {
    monthlyIncome: dto.monthlyIncome,
    monthlyDebts: dto.monthlyDebts,
    loanAmount: dto.loanAmount,
    propertyValue: dto.propertyValue,
    fico: dto.fico,
    occupancy: dto.occupancy,
  };
}

function genId() {
  return Math.random().toString(36).slice(2) + '-' + Date.now().toString(36);
}

export interface UnderwritingState {
  status: UnderwritingStatus;
  result?: UnderwriteResult;
  error?: UnderwritingError;
  lastDurationMs?: number;

  history: UnderwriteHistory;

  submit: (form: UnderwriteForm) => Promise<void>;
  reset: () => void;

  /** Historial */
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;
}

export const useUnderwritingStore = create<UnderwritingState>()(
  persist(
    (set, get) => ({
      status: 'idle',
      result: undefined,
      error: undefined,
      lastDurationMs: undefined,

      history: [],

      reset: () =>
        set({
          status: 'idle',
          result: undefined,
          error: undefined,
          lastDurationMs: undefined,
        }),

      clearHistory: () => set({ history: [] }),
      removeFromHistory: (id) =>
        set((s) => ({ history: s.history.filter((h) => h.id !== id) })),

      submit: async (form: UnderwriteForm) => {
        set({ status: 'loading', error: undefined });
        try {
          const dto = formToDTO(form);
          const res = await submitUnderwriting(dto);

          if (res.ok) {
            const { data, durationMs } = res.value;
            const result = dtoToDomain(data);

            // guardar resultado actual
            set({ status: 'success', result, lastDurationMs: durationMs });

            // añadir al historial (cap a 20)
            const item = {
              id: genId(),
              at: Date.now(),
              input: toSnapshot(dto),
              result,
              durationMs,
            };
            const prev = get().history;
            const next = [item, ...prev].slice(0, 20);
            set({ history: next });
            return;
          }

          const err = res.error;
          const normalized: UnderwritingError =
            err.type === 'HTTP_ERROR'
              ? {
                  message:
                    (typeof err.body === 'object' &&
                      err.body &&
                      'message' in (err.body as Record<string, unknown>) &&
                      String((err.body as Record<string, unknown>).message)) ||
                    err.message,
                  status: err.status,
                  details:
                    (typeof err.body === 'object' &&
                      err.body &&
                      'details' in (err.body as Record<string, unknown>) &&
                      (err.body as Record<string, unknown>).details) || err.body,
                }
              : { message: err.message };

          set({ status: 'error', error: normalized });
        } catch {
          set({
            status: 'error',
            error: { message: 'Unexpected error submitting underwriting request' },
          });
        }
      },
    }),
    {
      name: 'uw-history', // clave en localStorage
      storage: createJSONStorage(() => localStorage),
      // Solo persistimos el historial; el resto es efímero
      partialize: (s) => ({ history: s.history }),
    }
  )
);
