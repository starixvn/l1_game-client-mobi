import "../styles/globals.scss";
import "bootstrap/dist/css/bootstrap.css";
import { init } from "../utils/sentry";

init();

import { wrapper } from "../redux";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

// export default wrapper.withRedux(MyApp);
export default MyApp;
