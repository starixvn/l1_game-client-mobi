import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { AuthorizeResponse, SSOResponse } from "sc-user-service-client/dist/auth";
import { GetLocalizedErrorMessage } from "../helpers/notice-helper";
import { languageMapper } from "../common/constants";
import * as LocalStorageManager from "../common/local-storage";
import Dashboard from "../components/dashboard";
import SplashScreen from "../components/splash-screen/splash-screen";
import { AuthContextProvider } from "../contexts/auth";
import { UserClientCommunication } from "../services";
import { setCharacterName, setUser } from "../utils/sentry";

export type APIErrorProp = {
    message: string;
    errorCode: string;
};
let authorizeInfo: AuthorizeResponse = null;

export const signOut = () => {
    LocalStorageManager.removeLocalStorageItem(LocalStorageManager.localStorageKeys.session);
};

function Home() {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const [session, setSession] = useState<SSOResponse>(null);
    const [balance, setBalance] = useState<number>(0);
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const [apiErrorMessage, setApiErrorMessage] = useState<APIErrorProp>({ message: "", errorCode: "" });
    const timer = useRef(null);
    const sessionKey = LocalStorageManager.localStorageKeys.session;
    const { auth: authService, settings: settingsService } = UserClientCommunication.getUserClientInstance();
    const { t } = useTranslation("messages");

    async function signIn() {
        const settings = await settingsService.getSettings();
        if (settings.isUM) {
            router.push("um");
            return;
        }

        const { token } = router.query;
        if (token) {
            const userSession = await authService.sso(token as string, 2);
            if (userSession && userSession.isAuthenticated) {
                handleSignInSuccess(userSession);

                window.history.pushState(null, "", location.href.split("?")[0]);
                const langCode = languageMapper[userSession.language];
                if (router.locale !== langCode && router.locales.indexOf(langCode) > -1) {
                    router.push("/", "/", { locale: langCode });
                }
            } else {
                router.push("/timeout");
            }
        } else {
            const userSession = LocalStorageManager.getLocalStorageItem<SSOResponse>(sessionKey);
            if (!userSession) {
                router.push("/timeout");
            }

            const verifySessionResponse = await authService.verifySession(userSession?.ss, userSession?.username);
            if (verifySessionResponse.isSuccessful) {
                handleSignInSuccess(userSession);
            } else {
                router.push("/timeout");
            }
        }
    }

    async function handleSignInSuccess(userSession: SSOResponse) {
        setUser(userSession);
        authorizeInfo = (await authService.authorize(userSession.ss, userSession.username)) as AuthorizeResponse;

        if (authorizeInfo.authorized) {
            setBalance(authorizeInfo.user.red);
            setCharacterName(authorizeInfo.user.name);
        }

        setSession(userSession);
        LocalStorageManager.storeLocalStorageItem<SSOResponse>(sessionKey, userSession);
        reCheckIn();
        setTimeout(() => setLoading(false), 1000);
    }

    function reCheckIn() {
        timer.current = setInterval(async () => {
            const userSession = LocalStorageManager.getLocalStorageItem<SSOResponse>(sessionKey);
            const reCheckInResult = await authService.reCheckIn(userSession?.ss, userSession?.username);
            if (!reCheckInResult || !reCheckInResult.isSuccessful) {
                signOut();
                router.push("/timeout");
            } else {
                if (reCheckInResult.apiError) {
                    setIsShowModal(true);
                    if (reCheckInResult.isDisableAccount) {
                        setTimeout(() => {
                            signOut();
                        }, 10000);
                    }
                    setApiErrorMessage({
                        message: GetLocalizedErrorMessage(reCheckInResult.apiError.errorCode),
                        errorCode: reCheckInResult.apiError.errorCode,
                    });
                } else {
                    setBalance(reCheckInResult.balance);
                }
            }
        }, 60 * 1000);
    }

    useEffect(() => {
        if (router.isReady) {
            signIn();
        }

        return () => clearInterval(timer.current);
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
                <Dashboard
                    balance={balance}
                    isShowModal={isShowModal}
                    apiErrorMessage={apiErrorMessage}
                    setIsShowModal={setIsShowModal}
                    setApiErrorMessage={setApiErrorMessage}
                    authorizeInfo={authorizeInfo}
                />
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
            "messages",
        ])),
    },
});

export default Home;
