import "bootstrap/dist/css/bootstrap.css";
import "slick-carousel/slick/slick.scss";
import "slick-carousel/slick/slick-theme.scss";
import "../assets/main.scss";
import "../assets/errors.scss";

import { appWithTranslation } from "next-i18next";

import { init } from "../utils/sentry";

init();
const MyApp = ({ Component, pageProps }) => <Component {...pageProps} />;

export default appWithTranslation(MyApp);
