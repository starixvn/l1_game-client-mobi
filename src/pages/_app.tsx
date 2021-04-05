import "bootstrap/dist/css/bootstrap.css";
import "../assets/main.scss";
import "../assets/errors.scss";

import { appWithTranslation } from "next-i18next";

import { init } from "../utils/sentry";

init();

const MyApp = ({ Component, pageProps }) => <Component {...pageProps} />;

// export default wrapper.withRedux(MyApp);
export default appWithTranslation(MyApp);
