import { I18n, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextRouter, useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { AuthorizeResponse, ReCheckInResponse, SSOResponse } from "sc-user-service-client/dist/auth";

import { languageMapper } from "../common/constants";
import * as LocalStorageManager from "../common/local-storage";
import Dashboard from "../components/dashboard";
import SplashScreen from "../components/splash-screen/splash-screen";
import { AuthContextProvider } from "../contexts/auth";
import { GetLocalizedErrorMessage } from "../helpers/notice-helper";
import { UserClientCommunication } from "../services";
import { setCharacterName, setUser } from "../utils/sentry";

export type APIErrorProp = {
    message: string;
    errorCode: string;
};

const sessionKey = LocalStorageManager.localStorageKeys.session;
let authorizeInfo: AuthorizeResponse = null;
let session: SSOResponse = null;

const signIn = async (handleSignInSuccess: Function, router: NextRouter, i18n: I18n) => {
    const { settings: settingsService } = UserClientCommunication.getUserClientInstance();
    const settings = await settingsService.getSettings();
    const { lang } = router.query;

    settings.isUM && router.push("/um", "/um", { locale: languageMapper[lang as string] ?? router.locale });

    if (!settings.isUM) {
        router.query.token
            ? handleSignInWithRouteQuery(handleSignInSuccess, router, i18n)
            : handleSignInWithLocalStorageSession(handleSignInSuccess, router, i18n);
    }
};

const handleSignInWithRouteQuery = async (onSignInSuccess: Function, router: NextRouter, i18n: I18n) => {
    const { auth: authService } = UserClientCommunication.getUserClientInstance();
    const { token, lang } = router.query;

    const userSession = await authService.sso(token as string, 2);
    if (userSession && userSession.isAuthenticated) {
        LocalStorageManager.storeLocalStorageItem<SSOResponse>(sessionKey, userSession);
        onSignInSuccess(userSession);

        window.history.pushState(null, "", location.href.split("?")[0]);
        const langCode = languageMapper[lang as string];
        if (router.locale !== langCode && router.locales.indexOf(langCode) > -1) {
            i18n.changeLanguage(langCode);
        }
    } else {
        router.push("/timeout");
    }
};

const handleSignInWithLocalStorageSession = async (onSignInSuccess: Function, router: NextRouter, i18n: I18n) => {
    const { auth: authService } = UserClientCommunication.getUserClientInstance();
    const userSession = LocalStorageManager.getLocalStorageItem<SSOResponse>(sessionKey);
    if (!userSession) {
        router.push("/timeout");
    }

    const verifySessionResponse = await authService.verifySession(userSession?.ss, userSession?.username);
    if (verifySessionResponse.isSuccessful) {
        onSignInSuccess(userSession);

        const langCode = languageMapper[userSession.language];
        if (router.locale !== langCode && router.locales.indexOf(langCode) > -1) {
            i18n.changeLanguage(langCode);
        }
    } else {
        router.push("/timeout");
    }
};

export const signOut = () => {
    LocalStorageManager.removeLocalStorageItem(LocalStorageManager.localStorageKeys.session);
};

function Home() {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const [balance, setBalance] = useState<number>(0);
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const [apiErrorMessage, setApiErrorMessage] = useState<APIErrorProp>();
    const timer = useRef(null);
    const { auth: authService } = UserClientCommunication.getUserClientInstance();
    const { i18n } = useTranslation();

    async function handleSignInSuccess(userSession: SSOResponse) {
        setUser(userSession);
        session = userSession;

        authorizeInfo = (await authService.authorize(userSession.ss, userSession.username)) as AuthorizeResponse;

        if (authorizeInfo.authorized) {
            setBalance(authorizeInfo.user.red);
            setCharacterName(authorizeInfo.user.name);
        }

        reCheckIn();

        setTimeout(() => {
            setLoading(false);
        }, 400);
    }

    function handleShowApiErrorMessage(errorCode: string) {
        setIsShowModal(true);
        setApiErrorMessage({
            errorCode,
            message: GetLocalizedErrorMessage(errorCode),
        });
    }

    function handleRecheckInResponse(reCheckInResult: ReCheckInResponse) {
        if (!reCheckInResult || !reCheckInResult.isSuccessful) {
            signOut();
            router.push("/timeout");
        } else {
            if (reCheckInResult.apiError) {
                reCheckInResult.isDisableAccount &&
                    setTimeout(() => {
                        signOut();
                    }, 10000);

                handleShowApiErrorMessage(reCheckInResult.apiError.errorCode);
            } else {
                setBalance(reCheckInResult.balance);
            }
        }
    }

    function reCheckIn() {
        timer.current = setInterval(async () => {
            const userSession = LocalStorageManager.getLocalStorageItem<SSOResponse>(sessionKey);
            const reCheckInResult = await authService.reCheckIn(userSession?.ss, userSession?.username);

            handleRecheckInResponse(reCheckInResult);
        }, 60 * 1000);
    }

    useEffect(() => {
        router.isReady && signIn(handleSignInSuccess.bind(this), router, i18n);

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
        const { lang } = router.query;
        return <SplashScreen locale={languageMapper[lang as string] ?? router.locale}></SplashScreen>;
    } else {
        const authContextValue = { session, setBalance };
        return (
            <AuthContextProvider value={authContextValue}>
                <Dashboard
                    balance={balance}
                    isShowErrorModal={isShowModal}
                    apiErrorMessage={apiErrorMessage}
                    setIsShowModal={setIsShowModal}
                    setApiErrorMessage={handleShowApiErrorMessage.bind(this)}
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
