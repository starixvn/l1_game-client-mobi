import * as Sentry from "@sentry/node";

import appSettings from "./../common/app-settings";

export const init = () => {
    Sentry.init({ ...appSettings.sentry });
};
