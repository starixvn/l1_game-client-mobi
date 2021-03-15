import "../styles/globals.scss";
import "bootstrap/dist/css/bootstrap.css";
import { init } from "../utils/sentry";
import { appWithTranslation } from 'next-i18next'

init();

import { wrapper } from "../redux";

const  MyApp = ({ Component, pageProps }) => <Component {...pageProps} />


// export default wrapper.withRedux(MyApp);
export default appWithTranslation(MyApp);
