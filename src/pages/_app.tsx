import "../styles/globals.scss";
import "bootstrap/dist/css/bootstrap.css";

import { appWithTranslation } from "next-i18next";

import { init } from "../utils/sentry";

init();

const MyApp = ({ Component, pageProps }) => <Component {...pageProps} />;

// export default wrapper.withRedux(MyApp);
export default appWithTranslation(MyApp);
