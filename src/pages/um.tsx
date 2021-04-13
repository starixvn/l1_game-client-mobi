import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useEffect, useState } from "react";
import { UMInfo } from "sc-user-service-client/dist/settings";

import * as LocalStorageManager from "../common/local-storage";
import { convertToGMT8, formatDate } from "../helpers/time-helper";

const UM = () => {
    const template = "hh:mm dd/MM/yyyy";
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
                HỆ THỐNG ĐANG ĐƯỢC BẢO TRÌ.
                <br /> VUI LÒNG QUAY LẠI SAU.
            </p>
            <p className="highlight">{"Thời gian bảo trì từ {0} đến {1} (GMT +8)".replace("{0}", startTime).replace("{1}", endTime)}</p>
            <p>Sau thời gian bảo trì, bạn hãy đăng nhập lại để có thể tiếp tục chơi game.</p>
        </div>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"])),
    },
});

export default UM;
