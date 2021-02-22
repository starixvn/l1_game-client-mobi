// import BaseSocketIOController from "../../BaseSocketIOController";
import { configs } from "../../../Configs";
import { makeCorsRequest } from "../../helpers/httpHelper";
import { buildServerUrl } from "../../helpers/UrlHelper";
import logger from "../../utils/sentry";

const sentryLogger = logger();

const sessionIdStorageName = "scss";
const sessionExpiredTimeoutMinutes = 19.8;

export function preChecking(cb) {
  const settingUrl = buildServerUrl(configs.ssl, "http", "/api/settings");

  const urlParams = new URLSearchParams(window.location.search);

  makeCorsRequest(
    settingUrl,
    function (settingResponse) {
      try {
        if (
          settingResponse &&
          settingResponse.umInfo &&
          settingResponse.umInfo.isUM
        ) {
          return settingResponse;
        }

        const isSessionExpired = checkAndUpdateRecheckIn(
          urlParams.has("token")
        );
        if (isSessionExpired && !urlParams.has("token")) {
          return settingResponse;
        }
      } catch (ex) {
        sentryLogger.logError(ex);
      }

      cb();
      return void 0;
    },
    true
  );
}

export function checkSSO(labelMessage, onSuccessFunc) {
  let isSuccess = false;
  const urlParams = new URLSearchParams(window.location.search);
  const authData = getSession();

  if (urlParams.has("token")) {
    const url = buildServerUrl(
      configs.ssl,
      "http",
      `/authenticate?token=${urlParams.get("token")}`
    );

    try {
      makeCorsRequest(
        url,
        function (response) {
          if (response.isAuthenticated) {
            sentryLogger.setUser(response);
            response.isSSO = true;
            storeSessionData(response);
            clearTokenOnUrl();
            onSuccessFunc();
          } else {
            labelMessage.string =
              "Đăng nhập thất bại, bạn hãy làm lại thao tác đăng nhập từ đầu.";
          }
        },
        false
      );
    } catch (error) {
      labelMessage.string = "Đăng nhập lỗi.";
      sentryLogger.logError(error);
    }

    isSuccess = true;
  } else if (authData && authData.isAuthenticated && authData.ss) {
    isSuccess = true;
    onSuccessFunc();
  }

  return isSuccess;
}

export function clearTokenOnUrl() {
  try {
    history.pushState(null, "", location.href.split("?")[0]);
  } catch (ex) {
    console.log(ex);
  }
}

export function getSessionKey() {
  if (window.location && window.location.hostname) {
    return `${window.location.hostname}.${sessionIdStorageName}`;
  }

  return sessionIdStorageName;
}

export function signOut() {
  localStorage.removeItem(getSessionKey());
}

export function removeSession() {
  localStorage.removeItem(getSessionKey());
}

export function getSession() {
  return JSON.parse(localStorage.getItem(getSessionKey()));
}

export function isSSO() {
  const session = getSession();
  return session && session.isSSO;
}

export function storeSessionData(data) {
  localStorage.setItem(getSessionKey(), JSON.stringify(data));
}

export function checkAndUpdateRecheckIn(dontClearSession) {
  const session = getSession();
  let isSessionExpired = true;

  try {
    if (session && session.time) {
      const now: any = new Date();
      const lastRecheckIn: any = new Date(session.time);
      const differenceInMinutes = Math.abs(now - lastRecheckIn) / (1000 * 60);

      if (
        differenceInMinutes > sessionExpiredTimeoutMinutes &&
        !dontClearSession
      ) {
        signOut();
      } else {
        session.time = new Date();
        isSessionExpired = false;
        storeSessionData(session);
      }
    } else {
      !dontClearSession && signOut();
    }
  } catch (ex) {
    sentryLogger.logError(ex);
  }

  return isSessionExpired;
}
