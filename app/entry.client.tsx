import { RemixBrowser, useLocation, useMatches } from "@remix-run/react";
import { hydrate } from "react-dom";
import * as Sentry from "@sentry/remix";
import { useEffect } from "react";

Sentry.init({
  dsn: window.ENV.SENTRY_DSN,
  environment: window.ENV.ENVIRONMENT,
  tracesSampleRate: 1,
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.remixRouterInstrumentation(
        useEffect,
        useLocation,
        useMatches,
      ),
    }),
  ],
});

hydrate(<RemixBrowser />, document);
