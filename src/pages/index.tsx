import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { SSOResponse } from "sc-user-service-client/dist/auth";

import { languageMapper } from "../common/constants";
import { getLocalStorageItem, localStorageKeys } from "../common/local-storage";
import Dashboard from "../components/dashboard";
import SplashScreen from "../components/splash-screen";
import { checkUM, sso, verifySession } from "../services/auth-service";
import * as Sentry from "../utils/sentry";

function Home() {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const [session, setSession] = useState<SSOResponse>(null);
    const { token, lang } = router.query;
    const { i18n } = useTranslation();

    useEffect(() => {
        const signIn = async () => {
            const userSession = token ? await sso(token as string) : await verifySession();
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
            i18n.changeLanguage(locale);

            if (!checkUM()) {
                router.push("/um", "/um", { locale });
                return;
            }

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
        if (!router.isReady) {
            return <></>;
        }

        const { lang } = router.query;
        const userSession = getLocalStorageItem<SSOResponse>(localStorageKeys.session);
        const locale = languageMapper[(lang as string) ?? userSession?.language] ?? router.locale;

        return <SplashScreen locale={locale}></SplashScreen>;
    }

    const buildId = process.env.buildVersion;
    return <Dashboard session={session} buildId={buildId} />;
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
            ])),
        },
    };
};

export default Home;
