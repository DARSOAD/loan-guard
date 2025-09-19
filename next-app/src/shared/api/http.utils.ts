export function buildURL(baseURL: string | undefined, path: string): string {
    if (!baseURL) return path;
    if (/^https?:\/\//i.test(path)) return path;
    const needsSlashA = baseURL.endsWith('/') ? '' : '/';
    const needsSlashB = path.startsWith('/') ? '' : '/';
    return `${baseURL}${needsSlashA}${needsSlashB === '/' ? '' : ''}${path}`;
  }
  
  export function mergeHeaders(a?: HeadersInit, b?: HeadersInit): HeadersInit {
    const h = new Headers(a || {});
    if (b) new Headers(b).forEach((v, k) => h.set(k, v));
    return h;
  }
  
  export function toBodyAndHeaders(
    body: unknown,
    headers?: HeadersInit
  ): { body?: BodyInit | null; headers: HeadersInit } {
    const base = new Headers(headers || {});
    if (body === undefined || body === null) return { body: undefined, headers: base };
  
    if (
      typeof body === 'string' ||
      body instanceof Blob ||
      body instanceof ArrayBuffer ||
      body instanceof FormData ||
      body instanceof URLSearchParams ||
      ArrayBuffer.isView(body)
    ) {
      return { body: body as BodyInit, headers: base };
    }
  
    if (!base.has('Content-Type')) base.set('Content-Type', 'application/json');
    return { body: JSON.stringify(body), headers: base };
  }
  
  export function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }
  
  export function backoffDelay(attempt: number, baseDelayMs = 300): number {
    return baseDelayMs * Math.pow(2, Math.max(0, attempt - 1));
  }
  