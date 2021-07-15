import "../assets/errors.scss";
import "../assets/main.scss";

import { appWithTranslation } from "next-i18next";
import { ThemeProvider } from "next-themes";

import { init } from "../utils/sentry";
import { buildLocalStorageKey } from "../common/local-storage";
import { Themes } from "../common/constants";

init();

const SabaMobiApp = ({ Component, pageProps }) => {
    return (
        <ThemeProvider storageKey={buildLocalStorageKey("theme")} defaultTheme={Themes.light}>
            <Component {...pageProps} />
        </ThemeProvider>
    );
};

export default appWithTranslation(SabaMobiApp);
