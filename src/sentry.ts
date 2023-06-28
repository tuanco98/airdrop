import * as Sentry from "@sentry/node";
import { config_NODE_ENV, config_SENTRY_DNS, config_SENTRY_SERVER_NAME } from "./config";

const initSentry = () => Sentry.init({ dsn: config_SENTRY_DNS, serverName: config_SENTRY_SERVER_NAME, environment: config_NODE_ENV })

const CaptureException = (error: any, data: any) => {
    Sentry.addBreadcrumb({ data })
    Sentry.captureException(error)
}

export { initSentry, Sentry, CaptureException }