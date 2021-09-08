import { SSOResponse } from "sc-user-service-client/dist/auth";

import { UserClientCommunication } from "./user-client-communication";

const { userSettings: userSettingsService } = UserClientCommunication.getUserClientInstance();

export const updateUserQuickBetSetting = (session: SSOResponse, value: boolean) => {
    userSettingsService.updateUserQuickBetSetting(session.ss, session.username, value);
};
