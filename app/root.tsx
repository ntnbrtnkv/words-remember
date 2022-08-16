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
import Logo from "~/icons/og.png";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Words Remember",
  description: "Create dictionaries and test yourself",
  viewport: "width=device-width,initial-scale=1",
  "og:url": "https://wr.antb.fun",
  "og:title": "Words Remember",
  "og:description": "Create dictionaries and test yourself",
  "og:image": `https://wr.antb.fun${Logo}`,
  "og:type": "website",
  "og:image:type": "image/png",
  "twitter:card": "summary_large_image",
  "twitter:domain": "wr.antb.fun",
  "twitter:url": "https://wr.antb.fun",
  "twitter:title": "Words Remember",
  "twitter:description": "Create dictionaries and test yourself",
  "twitter:image": `https://wr.antb.fun${Logo}`,
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
