import "../assets/errors.scss";
import "../assets/main.scss";

import { appWithTranslation } from "next-i18next";
import { ThemeProvider } from "next-themes";
import App, { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";

import { buildVersion, systemName, Themes, sabaPlayMobileName, sabaPlayKenoName } from "../common/constants";
import { getAppSettings } from "../common/app-settings";
import { useEffect, useState } from "react";
import { getLocalStorageItem, localStorageKeys } from "../common/local-storage";

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
        const operator = op ? (op as string)?.toUpperCase() : getLocalStorageItem(localStorageKeys.operator);
        const isMegaKenoType = getAppSettings().appType === 4 ? "-mega" : "";
        const systemNameKey = `system-name-${systemName}${isMegaKenoType}`;
        setTitle(getBrowserTitle(systemNameKey, operator as string));
        setFaviconName(operator === "SP" ? "sabaplay" : systemName);
    }, [op]);

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
        "system-name-l2": operator === "SP" ? sabaPlayMobileName : "Vgaming Mobi",
        "system-name-l1-mega": "SABA Mega Keno",
        "system-name-l2-mega": operator === "SP" ? sabaPlayKenoName : "Vgaming Keno",
    };
    return browserTitle[systemName] || "";
};
export default appWithTranslation(SabaMobiApp);
