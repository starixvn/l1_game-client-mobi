import * as Sentry from "@sentry/nextjs";
import { getAppSettings } from "./src/common/app-settings";

const appSettings = getAppSettings();
const sentryConfig = appSettings.sentry || {};

Sentry.init({ ...sentryConfig });
