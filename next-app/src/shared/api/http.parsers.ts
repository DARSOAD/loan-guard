import { FinalHttpRequest } from './http.types';
import { makeParserError } from './http.errors';

export async function parseJsonOrError<T>(
  res: Response,
  request: FinalHttpRequest,
  durationMs: number
): Promise<{ ok: true; data: T } | { ok: false; error: ReturnType<typeof makeParserError> }> {
  try {
    const data = (await res.json()) as T;
    return { ok: true, data };
  } catch (e) {
    const err = makeParserError('Invalid JSON response', request, durationMs, undefined, e);
    return { ok: false, error: err };
  }
}
