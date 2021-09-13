import "../assets/errors.scss";
import "../assets/main.scss";

import { appWithTranslation } from "next-i18next";
import { ThemeProvider } from "next-themes";
import App, { AppContext, AppProps } from "next/app";
import Head from "next/head";

import { Themes } from "../common/constants";
import { buildLocalStorageKey } from "../common/local-storage";

interface KenoSoccerAppProps extends AppProps {
    err: any;
}

class SabaMobiApp extends App<KenoSoccerAppProps> {
    static getInitialProps = async (appContext: AppContext) => {
        const appProps = await App.getInitialProps(appContext);

        return { ...appProps };
    };

    render() {
        const { Component, pageProps, err } = this.props;

        return (
            <ThemeProvider storageKey={buildLocalStorageKey("theme")} defaultTheme={Themes.light}>
                <Head>
                    <title>Saba Mobi</title>
                    <link rel="shortcut icon" href={`/favicon.ico?v=${process.env.buildVersion}`} />
                </Head>
                <Component {...pageProps} err={err} />
            </ThemeProvider>
        );
    }
}

export default appWithTranslation(SabaMobiApp);
