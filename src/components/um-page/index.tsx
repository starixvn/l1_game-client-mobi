import { useTranslation } from "next-i18next";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { UMInfo } from "sc-user-service-client/dist/settings";
import { convertToGMT8, formatDate } from "../../helpers/time-helper";
import * as LocalStorageManager from "../../common/local-storage";

export const UMPage: React.FC<{ locale: string }> = ({ locale }) => {
    const router = useRouter();
    const { t } = useTranslation(["um", "messages"]);
    const [startTime, setStartTime] = useState<string>(null);
    const [endTime, setEndTime] = useState<string>(null);
    const { theme } = useTheme();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (router.isReady) {
            const template = locale === "vi" ? "hh:mm dd/MM/yyyy" : "hh:mm MM dd, yyyy";
            const umInfo = LocalStorageManager.getLocalStorageItem<UMInfo>(LocalStorageManager.localStorageKeys.umInfo);

            if (umInfo) {
                setStartTime(formatDate(convertToGMT8(new Date(umInfo.start)), template));
                setEndTime(formatDate(convertToGMT8(new Date(umInfo.end)), template));
            }

            setIsLoading(false);
        }
    }, [router]);

    if (isLoading) {
        return <></>;
    }
    return (
        <div className="error-page">
            <img alt="UM" src={`/static/images/um-${theme}.svg`} className="error-background" />
            <p className="um-title">
                {t("messages:sysMaintenance")} <br /> {t("um:umTitleFirst")}
            </p>
            <p className="highlight">{t("um:umContent").toString().replace("{0}", startTime).replace("{1}", endTime)}</p>
            <p>{t("um:umNotice")}</p>
        </div>
    );
};
