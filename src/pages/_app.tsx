import "../assets/errors.scss";
import "../assets/main.scss";

import { appWithTranslation } from "next-i18next";
import { ThemeProvider } from "next-themes";

import { init } from "../utils/sentry";
import { buildLocalStorageKey } from "../common/local-storage";
import { Themes } from "../common/constants";
import { useEffect } from "react";

init();

const SabaMobiApp = ({ Component, pageProps }) => {
    useEffect(() => {
        document.title = "Saba Mobi";
    }, []);

    return (
        <ThemeProvider storageKey={buildLocalStorageKey("theme")} defaultTheme={Themes.light}>
            <Component {...pageProps} />
        </ThemeProvider>
    );
};

export default appWithTranslation(SabaMobiApp);
