import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useEffect, useState } from "react";
import { UMInfo } from "sc-user-service-client/dist/settings";
import { useTranslation } from "next-i18next";
import * as LocalStorageManager from "../common/local-storage";
import { convertToGMT8, formatDate } from "../helpers/time-helper";
import { useRouter } from "next/router";

const UM = () => {
    const router = useRouter();
    const { locale } = router;
    const { t } = useTranslation("um");
    const template = locale === "vi" ? "hh:mm dd/MM/yyyy" : "hh:mm MM dd, yyyy";
    const [startTime, setStartTime] = useState<string>(null);
    const [endTime, setEndTime] = useState<string>(null);

    useEffect(() => {
        const umInfo = LocalStorageManager.getLocalStorageItem<UMInfo>("um_info");

        if (umInfo) {
            setStartTime(formatDate(convertToGMT8(new Date(umInfo.start)), template));
            setEndTime(formatDate(convertToGMT8(new Date(umInfo.end)), template));
        }
    }, [process.browser]);

    return (
        <div className="error-page">
            <img alt="SessionTimeout" src="/static/images/um-bg.jpg" className="img-fluid" />
            <p className="um-title">
                {t("umTitleFirst")} <br /> {t("umTitleSecond")}
            </p>
            <p className="highlight">{t("umContent").toString().replace("{0}", startTime).replace("{1}", endTime)}</p>
            <p>{t("umNotice")}</p>
        </div>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["um"])),
    },
});

export default UM;
