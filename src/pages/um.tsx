import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { convertToGMT8, formatDate } from "../helpers/time-helper";
import { UserClientCommunication } from "../services";

function UM({ umInfo }) {
    const router = useRouter();
    const { locale } = router;
    const { t } = useTranslation("um");
    const template = locale === "vi" ? "hh:mm dd/MM/yyyy" : "hh:mm MM dd, yyyy";
    const { theme } = useTheme();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, [router.isReady]);

    if (isLoading) {
        return <></>;
    }
    return (
        <div className="error-page">
            <img alt="UM" src={`/static/images/um-${theme}.svg`} className="error-background" />
            <p className="um-title">
                {t("umTitleFirst")} <br /> {t("umTitleSecond")}
            </p>
            <p className="highlight">
                {t("umContent")
                    .toString()
                    .replace("{0}", formatDate(convertToGMT8(new Date(umInfo.start)), template))
                    .replace("{1}", formatDate(convertToGMT8(new Date(umInfo.end)), template))}
            </p>
            <p>{t("umNotice")}</p>
        </div>
    );
}

export async function getServerSideProps({ locale }) {
    const settingsService = UserClientCommunication.getUserClientInstance().settings;
    const settings = await settingsService.getSettings();

    return {
        props: {
            ...(await serverSideTranslations(locale, ["um"])),
            umInfo: settings.umInfo,
        },
    };
}

export default UM;
