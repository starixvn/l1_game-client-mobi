import "../assets/errors.scss";
import "../assets/main.scss";

import { appWithTranslation } from "next-i18next";

import { init } from "../utils/sentry";

init();

const SabaMobiApp = ({ Component, pageProps }) => <Component {...pageProps} />;

export default appWithTranslation(SabaMobiApp);
