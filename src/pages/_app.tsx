import "../assets/errors.scss";
import "../assets/main.scss";

import { appWithTranslation } from "next-i18next";
import { ThemeProvider } from "next-themes";

import { init } from "../utils/sentry";

init();

const SabaMobiApp = ({ Component, pageProps }) => {
    return (
        <ThemeProvider>
            <Component {...pageProps} />
        </ThemeProvider>
    );
};

export default appWithTranslation(SabaMobiApp);
