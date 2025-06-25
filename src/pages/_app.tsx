import "../assets/errors.scss";
import "../assets/main.scss";

import { appWithTranslation } from "next-i18next";
import { ThemeProvider } from "next-themes";
import App, { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";

import { buildVersion, systemName, Themes, sabaPlayMobileName, sabaPlayKenoName, isSabaPlay } from "../common/constants";
import { getAppSettings } from "../common/app-settings";
import { useEffect, useState } from "react";
import { getLocalStorageItem, localStorageKeys, storeLocalStorageItem } from "../common/local-storage";

interface KenoSoccerAppProps extends AppProps {
    err: any;
}

class SabaMobiApp extends App<KenoSoccerAppProps> {
    render() {
        const { Component, pageProps, err } = this.props;

        return (
            <ThemeProvider defaultTheme={Themes.light}>
                <AppTilte />
                <Component {...pageProps} err={err} />
            </ThemeProvider>
        );
    }
}

export const AppTilte = () => {
    const [title, setTitle] = useState("");
    const [faviconName, setFaviconName] = useState("");
    const router = useRouter();
    const { op } = router.query;

    useEffect(() => {
        if (!router.isReady) return;

        const operator = getOperator();
        const isMegaKenoType = getAppSettings().appType === 4 ? "-mega" : "";
        const systemNameKey = `system-name-${systemName}${isMegaKenoType}`;
        setTitle(getBrowserTitle(systemNameKey, operator as string));
        setFaviconName(isSabaPlay(operator as string) ? "sabaplay" : systemName);
    }, [op, router.isReady]);


    const getOperator = () => {
        if(op) {
            const operator = (op as string)?.toUpperCase();
            storeLocalStorageItem(localStorageKeys.operator, operator);
            
            return operator;
        }

        return getLocalStorageItem(localStorageKeys.operator);
    }

    return (
        <Head>
            <title>{title}</title>
            <link rel="shortcut icon" href={`/favicon-${faviconName}.ico?v=${buildVersion}`} />
        </Head>
    );
};

const getBrowserTitle = (systemName: string, operator?: string) => {
    const browserTitle = {
        "system-name-l1": "Saba Mobi",
        "system-name-l2": isSabaPlay(operator) ? sabaPlayMobileName : "Vgaming Mobi",
        "system-name-l1-mega": "SABA Mega Keno",
        "system-name-l2-mega": isSabaPlay(operator) ? sabaPlayKenoName : "Vgaming Keno",
    };
    return browserTitle[systemName] || "";
};
export default appWithTranslation(SabaMobiApp);
