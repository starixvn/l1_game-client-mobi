import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { isMobileOnly, withOrientationChange } from "react-device-detect";
import { AuthorizeResponse, SSOResponse } from "sc-user-service-client/dist/auth";
import { UMInfo } from "sc-user-service-client/dist/settings";
import { languageMapper } from "../common/constants";
import * as LocalStorageManager from "../common/local-storage";
import Dashboard from "../components/dashboard";
import LandscapeMode from "../components/landscape-mode";
import SplashScreen from "../components/splash-screen/splash-screen";
import { AuthContextProvider } from "../contexts/auth";
import { UserClientCommunication } from "../services";
import { useTranslation } from "next-i18next";

let authorizeInfo: AuthorizeResponse = null;

export const signOut = () => {
    LocalStorageManager.removeLocalStorageItem(LocalStorageManager.localStorageKeys.session);
};

function Home({ isLandscape }) {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const [session, setSession] = useState<SSOResponse>(null);
    const [balance, setBalance] = useState<number>(0);
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const [apiErrorMessage, setApiErrorMessage] = useState<string>("");
    const timer = useRef(null);
    const sessionKey = LocalStorageManager.localStorageKeys.session;
    const { auth: authService, settings: settingsService } = UserClientCommunication.getUserClientInstance();
    const { t } = useTranslation("common");

    async function signIn() {
        const settings = await settingsService.getSettings();
        if (settings.isUM) {
            LocalStorageManager.storeLocalStorageItem<UMInfo>("um_info", settings.umInfo);
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

            const verifySessionResponse = await authService.verifySession(userSession.ss, userSession.username);
            if (verifySessionResponse.isSuccessful) {
                handleSignInSuccess(userSession);
            } else {
                router.push("/timeout");
            }
        }
    }

    async function handleSignInSuccess(userSession: SSOResponse) {
        authorizeInfo = (await authService.authorize(userSession.ss, userSession.username)) as AuthorizeResponse;

        if (authorizeInfo.authorized) {
            setBalance(authorizeInfo.user.red);
        }

        setSession(userSession);
        LocalStorageManager.storeLocalStorageItem<SSOResponse>(sessionKey, userSession);
        reCheckIn(userSession);
        setTimeout(() => setLoading(false), 1000);
    }

    function reCheckIn(userSession: SSOResponse) {
        timer.current = setInterval(async () => {
            const reCheckInResult = await authService.reCheckIn(userSession.ss, userSession.username);
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
                        setApiErrorMessage(t("accountIsLocked"));
                    } else {
                        setApiErrorMessage(`${reCheckInResult.apiError.message} (${reCheckInResult.apiError.errorCode})`);
                    }
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
    }, [router.isReady]);

    const workerRef = useRef(null);

    useEffect(() => {
        workerRef.current = new Worker("/worker.js", { type: "module" });
        workerRef.current.onmessage = (evt) => workerRef.current.postMessage(evt.data);
        return () => {
            workerRef.current.terminate();
        };
    }, []);
    const authContextValue = { session, setBalance };

    return (
        <div id="pt-main" className="pt-perspective">
            <div className={`pt-page pt-page-1 ${loading ? "pt-page-current" : "pt-page-current pt-page-rotatePushLeft"}`}>
                <SplashScreen></SplashScreen>;
            </div>
            <div className={`pt-page pt-page-2 ${loading ? "" : "pt-page-moveFromRight pt-page-current"}`}>
                {!loading && (
                    <AuthContextProvider value={authContextValue}>
                        {isLandscape && isMobileOnly ? (
                            <LandscapeMode />
                        ) : (
                            <Dashboard
                                balance={balance}
                                isShowModal={isShowModal}
                                apiErrorMessage={apiErrorMessage}
                                setIsShowModal={setIsShowModal}
                                setApiErrorMessage={setApiErrorMessage}
                                authorizeInfo={authorizeInfo}
                            />
                        )}
                    </AuthContextProvider>
                )}
            </div>
        </div>
    );
    // if (loading) {
    //     return <SplashScreen></SplashScreen>;
    // } else {
    //     const authContextValue = { session, setBalance };
    //     return (
    //         <AuthContextProvider value={authContextValue}>
    //             {isLandscape && isMobileOnly ? (
    //                 <LandscapeMode />
    //             ) : (
    //                 <Dashboard
    //                     balance={balance}
    //                     isShowModal={isShowModal}
    //                     apiErrorMessage={apiErrorMessage}
    //                     setIsShowModal={setIsShowModal}
    //                     setApiErrorMessage={setApiErrorMessage}
    //                     authorizeInfo={authorizeInfo}
    //                 />
    //             )}
    //         </AuthContextProvider>
    //     );
    // }
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
