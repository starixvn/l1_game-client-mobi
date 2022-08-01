import "../assets/errors.scss";
import "../assets/main.scss";

import { appWithTranslation, useTranslation } from "next-i18next";
import { ThemeProvider } from "next-themes";
import App, { AppProps } from "next/app";
import Head from "next/head";

import { Themes } from "../common/constants";
import appSettings from "../../src/common/app-settings";

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

const AppTilte = () => {
    const { t } = useTranslation("common");

    return (
        <Head>
            <title>{t(`system-name-${appSettings.system.toLocaleLowerCase()}`)}</title>
            <link rel="shortcut icon" href={`/favicon.ico?v=${process.env.buildVersion}`} />
        </Head>
    );
};
export default appWithTranslation(SabaMobiApp);
