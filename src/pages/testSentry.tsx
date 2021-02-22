import logger from "../utils/sentry";
const sentryLogger = logger();

const doAsyncWork = () => sentryLogger.log("Test Sentry 123");
doAsyncWork()

const Test1 = () => <h1>Test Sentry</h1>

export default Test1
