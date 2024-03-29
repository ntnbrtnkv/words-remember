/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  serverBuildTarget: "vercel",
  server: process.env.NODE_ENV === "development" ? undefined : "./server.js",
  ignoredRouteFiles: ["**/.*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
  serverDependenciesToBundle: [
    "react-dnd",
    "react-dnd-html5-backend",
    "react-dnd-touch-backend",
    "@react-dnd/invariant",
    "dnd-core",
    "@react-dnd/shallowequal",
    "@react-dnd/asap",
  ],
};
