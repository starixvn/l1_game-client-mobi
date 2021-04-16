import "../assets/errors.scss";
import "../assets/main.scss";

import { appWithTranslation } from "next-i18next";
import App, { AppContext } from "next/app";

import { DeviceContextProvider } from "../contexts/device";
import { init } from "../utils/sentry";

init();

class SabaMobiApp extends App<{ isMobile: boolean }> {
    static async getInitialProps({ Component, ctx }: AppContext) {
        let pageProps = {};
        let isMobile = false;
        if (Component.getInitialProps) {
            const mobilePattern = /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i;
            const userAgent = ctx?.req?.headers["user-agent"] ?? navigator.userAgent;
            isMobile = mobilePattern.test(userAgent);
            pageProps = await Component.getInitialProps(ctx);
        }
        return { isMobile, pageProps };
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
