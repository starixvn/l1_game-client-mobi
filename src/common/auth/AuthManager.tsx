import { sentryLogger } from "../../utils/sentry";
import {Session} from "./session-manager"
import * as SessionManager from "./session-manager";
import UserServiceClient from "./user-service-client";

const sessionExpiredTimeoutMinutes = 19.8;


export function checkSSO(onSuccessFunc) {
  let isSuccess = false;
    const urlParams = new URLSearchParams(window.location.search);
    const authData = SessionManager.getSession();
    if (urlParams.has("token")) {
        UserServiceClient.getInstance()
            .authenticate(urlParams.get("token"))
            .then((response:Session) => {
                if (response.isAuthenticated) {
                    // sentryLogger.setUser(response);
                    SessionManager.storeSessionData(response);
                    clearTokenOnUrl();
                    onSuccessFunc();
                }
            })
            .catch((error) => {
                sentryLogger.logError(error);
            });
        isSuccess = true;
    } else if (authData && authData.isAuthenticated && authData.ss) {
        isSuccess = true;
        window.authData = authData;
        sentryLogger.setUser(authData);
        onSuccessFunc();
    }

    return isSuccess;
}

export function clearTokenOnUrl() {
  try {
    window.history.pushState(null, "", location.href.split("?")[0]);
  } catch (ex) {
    console.log(ex);
  }
}

export function signOut() {
  localStorage.removeItem(SessionManager.getSessionKey());
}

export function checkAndUpdateRecheckIn(dontClearSession) {
  const session = SessionManager.getSession();
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
        SessionManager.storeSessionData(session);
      }
    } else {
      !dontClearSession && signOut();
    }
  } catch (ex) {
    sentryLogger.logError(ex);
  }

  return isSessionExpired;
}

export function reCheckIn() {
  const session = SessionManager.getSession();
  console.log(session);
  if (!session) {
     return false;
  }

  UserServiceClient.getInstance()
      .reCheckIn(session.ss, session.username)
      .then((response) => {
          if (response.isSuccessful) {
              return true;
          } else {
             return false;
          }
      })
      .catch(sentryLogger.logError);
}
