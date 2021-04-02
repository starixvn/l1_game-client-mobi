import "bootstrap/dist/css/bootstrap.css";
import "../assets/main.scss";
import "../assets/session-timeout.scss";
import "../assets/um.scss";

import { appWithTranslation } from "next-i18next";

import { init } from "../utils/sentry";

init();

const MyApp = ({ Component, pageProps }) => <Component {...pageProps} />;

// export default wrapper.withRedux(MyApp);
export default appWithTranslation(MyApp);
