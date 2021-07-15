import * as Sentry from "@sentry/node";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const errorMsg = {
    en: "An error has occurred, please contact CSD for details.",
    vi: "Đã xảy ra lỗi. Vui lòng liên hệ với bộ phận CSKH để được hỗ trợ.",
};

const Error = ({ hasGetInitialPropsRun, err, res }) => {
    if (!hasGetInitialPropsRun && err) {
        Sentry.captureException(err);
    }

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
        <div className="error-page">
            <img className="error-background small" src={`/static/images/error-${theme}.svg`} alt="error" />
            <p className="info">{`${errorMsg[router.locale]}(${statusCode})`}</p>
        </div>
    );
};

export default Error;
