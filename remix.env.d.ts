/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node/globals" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SENTRY_DSN: string;
      DATABASE_URL: string;
      SHADOW_DATABASE_URL: string;
      SESSION_SECRET: string;
    }
  }

  interface Window {
    ENV: {
      SENTRY_DSN: string;
      ENVIRONMENT: string;
    }
  }
}

export {}