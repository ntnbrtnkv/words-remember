import * as build from "@remix-run/dev/server-build";
import { createRequestHandler } from "@remix-run/vercel";
import * as Sentry from "@sentry/remix";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1,
});

export default createRequestHandler({ build, mode: process.env.NODE_ENV });
