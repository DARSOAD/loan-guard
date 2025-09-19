export type HttpMethod = 'POST';

export interface HttpClientConfig {
  baseURL?: string;
  defaultHeaders?: HeadersInit;
  timeoutMs?: number;
  retry?: {
    retries: number;
    baseDelayMs?: number;
  };
  fetch?: typeof fetch;
  now?: () => number;
}

export type ApiResult<T> =
  | { ok: true; value: HttpResponse<T> }
  | { ok: false; error: HttpError };

export interface HttpResponse<T = unknown> {
  status: number;
  ok: boolean;
  headers: Headers;
  data: T;
  raw: Response;
  durationMs: number;
}

export interface HttpRequest {
  path: string;
  method?: HttpMethod;
  headers?: HeadersInit;
  body?: unknown;
  signal?: AbortSignal;
  credentials?: RequestCredentials;
}

export interface FinalHttpRequest {
  url: string;
  method: HttpMethod;
  headers: HeadersInit;
  body?: BodyInit | null;
  signal?: AbortSignal;
  init: RequestInit;
  meta: {
    startedAt: number;
    attempt: number;
  };
}

export type HttpErrorKind =
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'HTTP_ERROR'
  | 'PARSER_ERROR';

export interface HttpErrorBase {
  type: HttpErrorKind;
  message: string;
  request?: FinalHttpRequest;
  durationMs?: number;
  cause?: unknown;
}

export interface NetworkError extends HttpErrorBase {
  type: 'NETWORK_ERROR';
}

export interface TimeoutError extends HttpErrorBase {
  type: 'TIMEOUT';
  timeoutMs: number;
}

export interface ParserError extends HttpErrorBase {
  type: 'PARSER_ERROR';
  rawBody?: unknown;
}

export interface HttpStatusError extends HttpErrorBase {
  type: 'HTTP_ERROR';
  status: number;
  statusText: string;
  body?: unknown;
}

export type HttpError =
  | NetworkError
  | TimeoutError
  | ParserError
  | HttpStatusError;

export interface HttpClient {
  post<T = unknown>(
    path: string,
    body: unknown,
    opts?: Omit<HttpRequest, 'path' | 'method' | 'body'>
  ): Promise<ApiResult<T>>;
}
