interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
    readonly VITE_HTTP_TIMEOUT_MS?: string;
    readonly VITE_HTTP_RETRIES?: string;
    readonly VITE_HTTP_RETRY_BASE_MS?: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }