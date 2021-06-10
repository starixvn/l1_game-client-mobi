import * as Sentry from "@sentry/node";
import { useTranslation, Trans } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Error = ({ hasGetInitialPropsRun, err, res }) => {
    if (!hasGetInitialPropsRun && err) {
        // getInitialProps is not called in case of
        // https://github.com/vercel/next.js/issues/8592. As a workaround, we pass
        // err via _app.js so it can be captured
        Sentry.captureException(err);
        // Flushing is not required in this case as it only happens on the client
    }

    const { t } = useTranslation("messages");
    const router = useRouter();
    const { theme } = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

    useEffect(() => {
        setIsLoading(false);
    }, [router.isReady]);

    if (isLoading) {
        return <></>;
    }

    return (
        <div>
            <div className="error-page">
                <img className="error-background small" src={`/static/images/error-${theme}.svg`} alt="error" />
                <p className="info">
                    <Trans t={t}>{t("errorOccurred", { errorCode: statusCode })}</Trans>
                </p>
            </div>
        </div>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["messages"])),
    },
});

export default Error;
