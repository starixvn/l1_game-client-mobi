import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";

import styles from "./toast-notification.module.scss";
let intervalId: NodeJS.Timeout;
const INTERVAL_TIME = 15 * 60 * 1000; // 15 minutes
const SHOW_TIME = 60 * 1000; // 1 minute

export const ToastNotification = () => {
    const { t } = useTranslation("common");
    const [isShow, setIsShow] = useState(false);

    const onClose = () => {
        setIsShow(false);
        intervalId && clearInterval(intervalId);
    };

    useEffect(() => {
        setTimeout(() => {
            setIsShow(true);
        }, 1000);
        intervalId = setInterval(() => {
            setIsShow(true);
        }, INTERVAL_TIME);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (isShow) {
            setTimeout(() => {
                setIsShow(false);
            }, SHOW_TIME);
        }
    }, [isShow]);

    return (
        isShow && (
            <div className={styles["toast-notification-container"]}>
                <div className={styles["notification"]}>
                    <span className={`icon-info ${styles["icon-info"]}`}></span>
                    <div className={styles["content"]}>{t("mega-keno-upgrade")}</div>
                    <span className={`icon-close ${styles["icon-close"]}`} onClick={onClose}></span>
                </div>
            </div>
        )
    );
};
