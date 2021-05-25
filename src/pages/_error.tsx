import * as Sentry from "@sentry/node";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Error = ({ statusCode, hasGetInitialPropsRun, err }) => {
    if (!hasGetInitialPropsRun && err) {
        // getInitialProps is not called in case of
        // https://github.com/vercel/next.js/issues/8592. As a workaround, we pass
        // err via _app.js so it can be captured
        Sentry.captureException(err);
        // Flushing is not required in this case as it only happens on the client
    }

    const { t } = useTranslation("common");
    const router = useRouter();
    const { theme } = useTheme();
    const [isLoading, setIsLoading] = useState(true);

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
                <p className="info">{t("errorPage")}</p>
            </div>
        </div>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"])),
    },
});

export default Error;
