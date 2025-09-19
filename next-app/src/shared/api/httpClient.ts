import {
    ApiResult,
    FinalHttpRequest,
    HttpClient,
    HttpClientConfig,
    HttpRequest,
    HttpResponse,
  } from './http.types';
  import { buildURL, mergeHeaders, toBodyAndHeaders, sleep, backoffDelay } from './http.utils';
  import { parseJsonOrError } from './http.parsers';
  import { makeHttpStatusError, makeNetworkError, makeTimeoutError } from './http.errors';
  
  export function createHttpClient(config: HttpClientConfig = {}): HttpClient {
    const {
      baseURL,
      defaultHeaders,
      timeoutMs = 8000,
      retry = { retries: 0, baseDelayMs: 300 },
      fetch: fetchImpl,
      now = () => Date.now(),
    } = config;
  
    const _fetch = fetchImpl ?? fetch;
    const maxAttempts = Math.max(1, (retry?.retries ?? 0) + 1);
  
    async function post<T>(
      path: string,
      body: unknown,
      opts?: Omit<HttpRequest, 'path' | 'method' | 'body'>
    ): Promise<ApiResult<T>> {
      const url = buildURL(baseURL, path);
      const merged = mergeHeaders(defaultHeaders, mergeHeaders({ Accept: 'application/json' }, opts?.headers));
      const { body: finalBody, headers } = toBodyAndHeaders(body, merged);
  
      let attempt = 0;
  
      while (attempt < maxAttempts) {
        attempt += 1;
  
        const controller = new AbortController();
        const userSignal = opts?.signal;
        if (userSignal) {
          if (userSignal.aborted) controller.abort();
          else userSignal.addEventListener('abort', () => controller.abort(), { once: true });
        }
  
        const startedAt = now();
        let timedOut = false;
  
        const init: RequestInit = {
          method: 'POST',
          headers,
          body: finalBody ?? null,
          signal: controller.signal,
          credentials: opts?.credentials,
        };
  
        const finalReq: FinalHttpRequest = {
          url,
          method: 'POST',
          headers,
          body: init.body ?? null,
          signal: controller.signal,
          init,
          meta: { startedAt, attempt },
        };
  
        const timer =
          timeoutMs && timeoutMs > 0
            ? setTimeout(() => {
                timedOut = true;
                controller.abort();
              }, timeoutMs)
            : undefined;
  
        try {
          const res = await _fetch(url, init);
          const durationMs = now() - startedAt;
  
          const parsed = await parseJsonOrError<T>(res, finalReq, durationMs);
          if (!parsed.ok) {
            return { ok: false, error: parsed.error };
          }
  
          const response: HttpResponse<T> = {
            status: res.status,
            ok: res.ok,
            headers: res.headers,
            data: parsed.data,
            raw: res,
            durationMs,
          };
  
          if (res.ok) return { ok: true, value: response };
  
          const httpErr = makeHttpStatusError(res.status, res.statusText, parsed.data, finalReq, durationMs);
          const isRetryable = attempt < maxAttempts && res.status >= 500 && res.status < 600;
          if (isRetryable) {
            await sleep(backoffDelay(attempt, retry?.baseDelayMs));
            continue;
          }
          return { ok: false, error: httpErr };
        } catch (cause) {
          const durationMs = now() - startedAt;
  
          if (timedOut) {
            const terr = makeTimeoutError(timeoutMs ?? 0, finalReq, durationMs, cause);
            if (attempt < maxAttempts) {
              await sleep(backoffDelay(attempt, retry?.baseDelayMs));
              continue;
            }
            return { ok: false, error: terr };
          }
  
          const nerr = makeNetworkError(finalReq, durationMs, cause);
          if (attempt < maxAttempts) {
            await sleep(backoffDelay(attempt, retry?.baseDelayMs));
            continue;
          }
          return { ok: false, error: nerr };
        } finally {
          if (timer) clearTimeout(timer);
        }
      }
  
      return {
        ok: false,
        error: {
          type: 'NETWORK_ERROR',
          message: 'Exhausted retries without response',
        },
      };
    }
  
    const client: HttpClient = { post };
    return client;
  }
  