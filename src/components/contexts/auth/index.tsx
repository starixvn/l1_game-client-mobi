import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import * as SessionManager from "../../../common/auth/session-manager";
import { UserService } from "../../../services";
import { Session } from "../../../services/user/user";

export const AuthContext = React.createContext<Session>({ isAuthenticated: false, ss: "", username: "", language: "" });
AuthContext.displayName = "AuthContext";

export const AuthContextProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function loadSession() {
            const { token } = router.query;

            if (token) {
                const userSession = await UserService.signIn(token as string);
                if (userSession && userSession.isAuthenticated) {
                    setSession(userSession);
                    SessionManager.storeSessionData(userSession);
                } else {
                    router.push("/timeout");
                }
            } else {
                const userSession = SessionManager.getSession();
                if (!userSession) {
                    router.push("/timeout");
                }

                const verifySessionResponse = await UserService.verifySession(userSession);
                if (verifySessionResponse && verifySessionResponse.isSuccessful) {
                    setSession(userSession);
                } else {
                    router.push("/timeout");
                }
            }
        }
        if (router.isReady) {
            loadSession();
        }
    }, [router.isReady]);
    return <AuthContext.Provider value={session}>{children}</AuthContext.Provider>;
};

AuthContextProvider.AuthContextProvider;

export const AuthContextConsumer = AuthContext.Consumer;
export const useAuthContext = () => React.useContext(AuthContext);
