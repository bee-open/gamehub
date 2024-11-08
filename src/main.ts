import './assets/main.css'
import './index.css'

import {createApp} from 'vue'
import App from './App.vue'
import * as Sentry from "@sentry/vue";
import moment from "moment/moment";

const app = createApp(App);
Sentry.init({
    app,
    dsn: "https://cac54ec6e43ee1c2ebfbd48cdfa94992@o475234.ingest.us.sentry.io/4507563208671232",
    integrations: [
        Sentry.browserTracingIntegration({
            traceFetch: true,
            traceXHR: true,
        }),
        Sentry.globalHandlersIntegration({
            onunhandledrejection: true,
            onerror: true,
        }),
        Sentry.httpClientIntegration({
            failedRequestStatusCodes: [500],
            failedRequestTargets: ["/gamecene/.*", "/game/.*"],
        }),
        Sentry.httpContextIntegration(),
        Sentry.browserApiErrorsIntegration({
            XMLHttpRequest: true,
        }),
        Sentry.breadcrumbsIntegration({
            fetch: true,
            xhr: true,
            console: true,
        }),
    ],
    environment: window["env"] || "debug",
    release: window["release"] || moment().format('YYYY.MM.DD'),
    // Performance Monitoring
    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    // Performance Monitoring
    sampleRate: 0.01, //
    tracesSampleRate: 0.01, //  Capture 100% of the transactions
    tracingOptions: {
        trackComponents: true,
        hooks: ["mount"],
    },
    // Session Replay
    replaysSessionSampleRate: 0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});
app.mount('#app');