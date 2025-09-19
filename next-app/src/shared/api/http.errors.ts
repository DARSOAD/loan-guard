import {
    FinalHttpRequest,
    HttpStatusError,
    NetworkError,
    TimeoutError,
    ParserError,
  } from './http.types';
  
  export function makeHttpStatusError(
    status: number,
    statusText: string,
    body: unknown,
    request: FinalHttpRequest,
    durationMs: number
  ): HttpStatusError {
    return {
      type: 'HTTP_ERROR',
      message: `HTTP ${status} ${statusText}`,
      status,
      statusText,
      body,
      request,
      durationMs,
    };
  }
  
  export function makeTimeoutError(
    timeoutMs: number,
    request: FinalHttpRequest,
    durationMs: number,
    cause?: unknown
  ): TimeoutError {
    return {
      type: 'TIMEOUT',
      message: `Request timed out after ${timeoutMs}ms`,
      timeoutMs,
      request,
      durationMs,
      cause,
    };
  }
  
  export function makeNetworkError(
    request: FinalHttpRequest,
    durationMs: number,
    cause?: unknown
  ): NetworkError {
    return {
      type: 'NETWORK_ERROR',
      message: 'Network error or aborted',
      request,
      durationMs,
      cause,
    };
  }
  
  export function makeParserError(
    message: string,
    request: FinalHttpRequest,
    durationMs: number,
    rawBody?: unknown,
    cause?: unknown
  ): ParserError {
    return {
      type: 'PARSER_ERROR',
      message,
      request,
      durationMs,
      rawBody,
      cause,
    };
  }
  