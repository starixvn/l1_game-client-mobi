import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { localStorageKeys, storeLocalStorageItem } from "../../common/local-storage";
import styles from "./compact-mode-hint.module.scss";

const compactModeHintStorageKey = localStorageKeys.compactModeHint;

export const CompactModeHint: React.FC<{ onCloseHint: Function }> = ({ onCloseHint }) => {
    const { t } = useTranslation("common");
    const hintRef = useRef<HTMLDivElement>(null);

    const handleDismissHint = () => {
        onCloseHint();
        storeLocalStorageItem(compactModeHintStorageKey, true);
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
        <div className={styles["compact-mode-hint-container"]}>
            <div ref={hintRef} className={styles["compact-mode-hint-wrapper"]}>
                <div className="content">{t("compactModeHint")}</div>
                <div className="action">
                    <button className={`btn-grey ${styles["btn-dismiss"]}`} onClick={() => handleDismissHint()}>
                        {t("dismiss")}
                    </button>
                </div>
            </div>
        </div>
    );
};
