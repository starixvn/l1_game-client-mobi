import { SSOResponse } from "sc-user-service-client/dist/auth";

import { getLocalStorageItem, localStorageKeys, removeLocalStorageItem, storeLocalStorageItem } from "../common/local-storage";
import { UserClientCommunication } from "./user-client-communication";

const { auth: authService, userSettings: userSettingsService } = UserClientCommunication.getUserClientInstance();

export const sso = async (token: string): Promise<SSOResponse> => {
    const userSession = await authService.sso(token, 2);

    if (userSession && userSession.isAuthenticated) {
        storeLocalStorageItem<SSOResponse>(localStorageKeys.session, userSession);
    }

    return userSession;
};

export const verifySession = async (): Promise<SSOResponse> => {
    const userSession = getLocalStorageItem<SSOResponse>(localStorageKeys.session);

    if (!userSession) {
        return null;
    }

    const verifySessionResponse = await authService.verifySession(userSession?.ss, userSession?.username);

    if (verifySessionResponse && verifySessionResponse.isSuccessful) {
        return userSession;
    }

    return null;
};

export const clearSession = () => removeLocalStorageItem(localStorageKeys.session);

export const reCheckIn = async (userSession: SSOResponse) => {
    return authService.reCheckIn(userSession?.ss, userSession?.username);
};

export const createNickname = async (userSession: SSOResponse, nickname: string, avatarId: number) => {
    return authService.signName(userSession.ss, userSession.username, nickname, avatarId);
};

export const authorize = async (userSession: SSOResponse) => {
    return authService.authorize(userSession.ss, userSession.username);
};

export const updateThemeSetting = async (userSession: SSOResponse, theme) => {
    return userSettingsService.updateUserThemeSetting(userSession.ss, userSession.username, theme);
};

export const updateSignInSMStatus = async (userSession: SSOResponse) => {
    return userSettingsService.updateSignInSMStatus(userSession.ss, userSession.username);
};

export const getBalance = async (userSession: SSOResponse) => {
    return authService.getBalance(userSession.ss, userSession.username);
};
