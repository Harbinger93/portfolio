import * as Sentry from "@sentry/astro";

Sentry.init({
  dsn: "https://c9cdc427796ce08ddcc2087c7776fbd0@o4501632557555216.ingest.us.sentry.io/4501632694894352",
  // To disable sending user data and HTTP bodies, uncomment the lines below.
  // dataCollection: {
  //   userInfo: false,
  //   httpBodies: [],
  // },
  integrations: [
    Sentry.browserTracingIntegration(),
    // Sentry.replayIntegration(), // Disabled to improve PageSpeed
  ],
  // Enable logs to be sent to Sentry
  enableLogs: true,
  // Define how likely traces are sampled
  tracesSampleRate: 1.0,
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
