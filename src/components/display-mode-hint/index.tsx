import React, { useRef } from "react";
import { useTranslation } from "next-i18next";
import { localStorageKeys, storeLocalStorageItem } from "../../common/local-storage";
import styles from "./display-mode-hint.module.scss";

const displayModeHintStorageKey = localStorageKeys.displayModeHint;

export const DisplayModeHint: React.FC<{ onCloseHint: Function }> = ({ onCloseHint }) => {
    const { t } = useTranslation("common");
    const hintRef = useRef<HTMLDivElement>(null);

    const handleDismissHint = () => {
        onCloseHint();
        storeLocalStorageItem(displayModeHintStorageKey, true);
    };

    return (
        <div ref={hintRef} className={styles["display-mode-hint-wrapper"]}>
            <div className={`icon-info ${styles["icon-info"]}`}></div>
            <div className={styles.content}>{t("displayModeHint")}</div>
            <span className={`icon-close ${styles["icon-close"]}`} onClick={() => handleDismissHint()}></span>
        </div>
    );
};
