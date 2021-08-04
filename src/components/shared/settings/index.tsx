import { useTranslation } from "next-i18next";
import { useTheme } from "next-themes";
import React, { useRef } from "react";
import { isMobileOnly } from "react-device-detect";
import BetSettings from "../bet-settings";
import { Tooltip } from "../tooltip";
import { Menu } from "./menu";
import styles from "./settings.module.scss";
import { Props } from "./types";

export const Settings: React.FC<Props> = (props) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const toggleHistoryBtnRef = useRef<HTMLDivElement>(null);
    const toggleWinningStreakBtnRef = useRef<HTMLDivElement>(null);

    const {
        updateBetSetting,
        globalBetSetting,
        enabledNotification,
        onToggleNotification,
        toggleHistoryModal,
        onToggleSound,
        enabledSound,
        toggleGuideModal,
    } = props;

    return (
        <div className={styles["settings-container"]}>
            <div className={styles["setting-left"]}>
                <BetSettings updateBetSetting={updateBetSetting} betSettings={globalBetSetting} />
            </div>
            <div className={styles["setting-right"]}>
                <div
                    ref={toggleWinningStreakBtnRef}
                    id="notification-settings"
                    className={`header-button ${styles["setting-button"]} ${!isMobileOnly ? styles["desktop-style"] : ""}`}
                    onClick={() => onToggleNotification()}
                >
                    <span
                        className={enabledNotification ? styles[`${"icon-notify-on-"}${theme}`] : styles[`${"icon-notify-off-"}${theme}`]}
                    ></span>
                    <Tooltip
                        message={`${t("winningStreakNotification")}: ${enabledNotification ? t("on") : t("off")}`}
                        hoverWrapper={toggleWinningStreakBtnRef}
                    />
                </div>

                <div
                    ref={toggleHistoryBtnRef}
                    id="ticket-history"
                    className={`header-button ${styles["setting-button"]} ${!isMobileOnly ? styles["desktop-style"] : ""}`}
                    onClick={() => toggleHistoryModal()}
                >
                    <span className={styles[`${"icon-ticket-history-"}${theme}`]}></span>
                    <Tooltip message={t("popupTitleHistory")} hoverWrapper={toggleHistoryBtnRef} />
                </div>

                <Menu handleToggleSound={onToggleSound} enabledSound={enabledSound} handleToggleGuideModal={toggleGuideModal} />
            </div>
        </div>
    );
};
