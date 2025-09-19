  
  export const env = {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    TIMEOUT_MS: Number(process.env.NEXT_PUBLIC_HTTP_TIMEOUT_MS ?? '8000'),
    RETRIES: Number(process.env.NEXT_PUBLIC_HTTP_RETRIES ?? '0'),
    RETRY_BASE_MS: Number(process.env.NEXT_PUBLIC_HTTP_RETRY_BASE_MS ?? '300'),
  };