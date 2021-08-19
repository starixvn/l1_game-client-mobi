import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { SSOResponse } from "sc-user-service-client/dist/auth";

import { languageMapper } from "../common/constants";
import { getLocalStorageItem, localStorageKeys } from "../common/local-storage";
import Dashboard from "../components/dashboard";
import SplashScreen from "../components/splash-screen";
import { UMPage } from "../components/um-page";
import { checkUM, sso, verifySession } from "../services/auth-service";
import * as Sentry from "../utils/sentry";

const getUserSession = (token: string) => (token ? sso(token) : verifySession());

function Home() {
    const router = useRouter();
    const [isUM, setIsUm] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [session, setSession] = useState<SSOResponse>(null);
    const [language, setLanguage] = useState<string>(null);

    const { token, lang, gameId } = router.query;
    const { i18n } = useTranslation();

    useEffect(() => {
        const signIn = async () => {
            if (await checkUM()) {
                setIsUm(true);
                return;
            }

            const userSession = await getUserSession(token as string);
            if (userSession && userSession.isAuthenticated) {
                setSession(userSession);
                Sentry.setUser(userSession);
                setLoading(false);

                window.history.pushState(null, "", location.href.split("?")[0]);
            } else {
                router.push("timeout");
            }
        };

        if (router.isReady) {
            const userSession = getLocalStorageItem<SSOResponse>(localStorageKeys.session);
            const locale = languageMapper[(lang as string) ?? userSession?.language] ?? router.locale;
            setLanguage(locale);
            i18n.changeLanguage(locale);

            signIn();
        }
    }, [router]);

    const workerRef = useRef(null);

    useEffect(() => {
        workerRef.current = new Worker("/worker.js", { type: "module" });
        workerRef.current.onmessage = (evt) => workerRef.current.postMessage(evt.data);
        return () => {
            workerRef.current.terminate();
        };
    }, []);

    if (isUM) {
        return <UMPage locale={language} />;
    }

    if (loading) {
        return <SplashScreen locale={language}></SplashScreen>;
    }

    return <Dashboard session={session} queryGame={+gameId} setIsUm={setIsUm} />;
}

export const getStaticProps = async ({ locale }) => {
    return {
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
                "kenopromax",
                "baccarat",
                "vipbaccarat",
                "threecards",
                "minisedie",
                "specialsedie",
                "um",
            ])),
        },
    };
};

export default Home;
