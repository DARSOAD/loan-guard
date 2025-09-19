import { createHttpClient } from './httpClient';
import type { HttpClient } from './http.types';
import { env } from '../config/env';

const baseURL =
  env.API_URL ??
  (typeof window !== 'undefined' ? window.location.origin : undefined);

export const http: HttpClient = createHttpClient({
  baseURL,
  timeoutMs: env.TIMEOUT_MS,
  retry: { retries: env.RETRIES, baseDelayMs: env.RETRY_BASE_MS },
});

export * from './http.types';
export { createHttpClient };