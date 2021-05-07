import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { isMobileOnly, withOrientationChange } from "react-device-detect";
import { SSOResponse } from "sc-user-service-client/dist/auth";
import { UMInfo } from "sc-user-service-client/dist/settings";

import * as LocalStorageManager from "../common/local-storage";
import Dashboard from "../components/dashboard";
import LandscapeMode from "../components/landscape-mode";
import SplashScreen from "../components/splash-screen/splash-screen";
import { AuthContextProvider } from "../contexts/auth";
import { UserClientCommunication } from "../services";

function Home({ isLandscape }) {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const [session, setSession] = useState<SSOResponse>(null);
    const [balance, setBalance] = useState<number>(0);
    const timer = useRef(null);
    const sessionKey = LocalStorageManager.localStorageKeys.session;
    const { auth: authService, settings: settingsService } = UserClientCommunication.getUserClientInstance();

    async function signIn() {
        const settings = await settingsService.getSettings();
        if (settings.isUM) {
            LocalStorageManager.storeLocalStorageItem<UMInfo>("um_info", settings.umInfo);
            router.push("um");
            return;
        }

        const { token } = router.query;
        if (token) {
            const userSession = await authService.sso(token as string);
            if (userSession && userSession.isAuthenticated) {
                handleSignInSuccess(userSession);
            } else {
                router.push("/timeout");
            }
        } else {
            const userSession = LocalStorageManager.getLocalStorageItem<SSOResponse>(sessionKey);
            if (!userSession) {
                router.push("/timeout");
            }

            const verifySessionResponse = await authService.authorize(userSession.ss, userSession.username);
            if (verifySessionResponse && verifySessionResponse.authorized) {
                handleSignInSuccess(userSession);
            } else {
                router.push("/timeout");
            }
        }
    }

    function handleSignInSuccess(userSession: SSOResponse) {
        setSession(userSession);
        LocalStorageManager.storeLocalStorageItem<SSOResponse>(sessionKey, userSession);
        reCheckIn(userSession);
        window.history.pushState(null, "", location.href.split("?")[0]);
        setTimeout(() => setLoading(false), 1000);
    }

    function reCheckIn(userSession: SSOResponse) {
        timer.current = setInterval(async () => {
            const reCheckInResult = await authService.reCheckIn(userSession.ss, userSession.username);
            if (!reCheckInResult || !reCheckInResult.isSuccessful) {
                router.push("/timeout");
            } else {
                setBalance(reCheckInResult.balance);
            }
        }, 60 * 1000);
    }

    useEffect(() => {
        if (router.isReady) {
            signIn();
        }
    }, [router.isReady]);

    const workerRef = useRef(null);

    useEffect(() => {
        workerRef.current = new Worker("/worker.js", { type: "module" });
        workerRef.current.onmessage = (evt) => workerRef.current.postMessage(evt.data);
        return () => {
            workerRef.current.terminate();
        };
    }, []);

    if (loading) {
        return <SplashScreen></SplashScreen>;
    } else {
        const authContextValue = { session, setBalance };
        return (
            <AuthContextProvider value={authContextValue}>
                {isLandscape && isMobileOnly ? <LandscapeMode /> : <Dashboard balance={balance} updateBalance={setBalance} />}
            </AuthContextProvider>
        );
    }
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, [
            "common",
            "xocxoc",
            "taixiu",
            "baucua",
            "register",
            "bethistory",
            "dragontiger",
            "vipsedie",
            "txturbo",
        ])),
    },
});

export default withOrientationChange(Home);
