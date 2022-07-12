import "../assets/errors.scss";
import "../assets/main.scss";

import { appWithTranslation } from "next-i18next";
import { ThemeProvider } from "next-themes";
import App, { AppProps } from "next/app";
import Head from "next/head";

import { Themes } from "../common/constants";

interface KenoSoccerAppProps extends AppProps {
    err: any;
}

class SabaMobiApp extends App<KenoSoccerAppProps> {
    render() {
        const { Component, pageProps, err } = this.props;

        return (
            <ThemeProvider defaultTheme={Themes.light}>
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
