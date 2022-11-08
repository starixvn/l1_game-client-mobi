import "../assets/errors.scss";
import "../assets/main.scss";

import { appWithTranslation } from "next-i18next";
import { ThemeProvider } from "next-themes";
import App, { AppProps } from "next/app";
import Head from "next/head";

import { buildVersion, systemName, Themes } from "../common/constants";
import appSettings from "../common/app-settings";

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
    const isMegaKenoType = appSettings.appType === 4 ? "-mega" : "";
    const title = getBrowserTitle(`system-name-${systemName}${isMegaKenoType}`);

    return (
        <Head>
            <title>{title}</title>
            <link rel="shortcut icon" href={`/favicon-${systemName}.ico?v=${buildVersion}`} />
        </Head>
    );
};
const getBrowserTitle = (systemName) => {
    const browserTitle = {
        "system-name-l1": "Saba Mobi",
        "system-name-l2": "Vgaming Mobi",
        "system-name-l1-mega": "SABA Mega Keno",
        "system-name-l2-mega": "SABA Mega Keno",
    };
    return browserTitle[systemName];
};
export default appWithTranslation(SabaMobiApp);
