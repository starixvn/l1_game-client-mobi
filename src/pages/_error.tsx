import * as Sentry from "@sentry/node";

const Error = ({ statusCode, hasGetInitialPropsRun, err }) => {
    if (!hasGetInitialPropsRun && err) {
        // getInitialProps is not called in case of
        // https://github.com/vercel/next.js/issues/8592. As a workaround, we pass
        // err via _app.js so it can be captured
        Sentry.captureException(err);
        // Flushing is not required in this case as it only happens on the client
    }

    return (
        <div>
            <div className="error-page">
                <img src="/static/images/error.svg" alt="error" className="img-fluid" />
            </div>
        </div>
    );
};

export default Error;
