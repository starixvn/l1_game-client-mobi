import { useEffect, useState } from "react";
import { useTranslation, Trans } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";

const Custom404 = () => {
    const { t } = useTranslation("messages");
    const { theme } = useTheme();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, [router.isReady]);

    if (isLoading) {
        return <></>;
    }

    return (
        <div className="error-page">
            <img className="error-background small" src={`/static/images/error-${theme}.svg`} alt="error" />
            <p className="info">
                <Trans t={t}>{t("errorOccurred", { errorCode: 404 })}</Trans>
            </p>
        </div>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["messages"])),
    },
});

export default Custom404;
