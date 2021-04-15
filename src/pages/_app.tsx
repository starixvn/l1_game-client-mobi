import "../assets/errors.scss";
import "../assets/main.scss";

import { appWithTranslation } from "next-i18next";
import App, { AppContext } from "next/app";

import { DeviceContextProvider } from "../contexts/device";
import { init } from "../utils/sentry";

init();

class SabaMobiApp extends App<{ isMobile: boolean }> {
    static async getInitialProps(appContext: AppContext) {
        const mobilePattern = /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i;
        const userAgent = appContext.ctx?.req?.headers["user-agent"] ?? navigator.userAgent;
        const isMobile = mobilePattern.test(userAgent);

        const appProps = await App.getInitialProps(appContext);

        return { isMobile, ...appProps };
    }

    render() {
        const { Component, isMobile, pageProps } = this.props;
        return (
            <DeviceContextProvider value={{ isMobile }}>
                <Component {...pageProps} />
            </DeviceContextProvider>
        );
    }
}

export default appWithTranslation(SabaMobiApp);
