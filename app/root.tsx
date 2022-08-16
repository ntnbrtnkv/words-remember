import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { withSentry } from "@sentry/remix";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./session.server";
import Logo from "~/icons/logo.webp";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Words remember",
  viewport: "width=device-width,initial-scale=1",
  "og:title": "Words Remember - create dictionaries and test yourself",
  "og:type": "website",
  "og:image": Logo,
  "og:image:type": "image/webp",
});

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  env: {
    SENTRY_DSN: string | undefined;
    ENVIRONMENT: string | undefined;
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    user: await getUser(request),
    env: {
      SENTRY_DSN: process.env.SENTRY_DSN,
      ENVIRONMENT: process.env.NODE_ENV,
    },
  });
};

function App() {
  const { env } = useLoaderData() as LoaderData;

  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(env)}`,
          }}
        />
        <LiveReload />
      </body>
    </html>
  );
}

export default withSentry(App);
