import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
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

    useEffect(() => {
        function handleClickOutside(event) {
            if (hintRef && hintRef.current && !hintRef.current.contains(event.target)) {
                onCloseHint();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [hintRef]);

    return (
        <div ref={hintRef} className={`popover-custom bottom ${styles["display-mode-hint-wrapper"]}`}>
            <p className={styles.title}>{t("displayModeHintTitle")}</p>
            <p className={styles.content}>{t("displayModeHint")}</p>
            <button className={`btn-orange ${styles["btn"]}`} onClick={() => handleDismissHint()}>
                {t("confirmDisplayModeHint")}
            </button>
        </div>
    );
};
