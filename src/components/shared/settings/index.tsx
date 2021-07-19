import { useTheme } from "next-themes";
import React from "react";
import { isMobileOnly } from "react-device-detect";
import BetSettings from "../bet-settings";
import styles from "./settings.module.scss";
import { Props } from "./types";

export const Settings: React.FC<Props> = (props) => {
    const { theme } = useTheme();

    return (
        <div className={styles["settings-container"]}>
            <div className={styles["setting-left"]}>
                <BetSettings updateBetSetting={props.updateBetSetting} betSettings={props.globalBetSetting} />
            </div>
            <div className={styles["setting-right"]}>
                <div
                    id="notification-settings"
                    className={`header-button ${styles["setting-button"]} ${!isMobileOnly ? styles["desktop-style"] : ""}`}
                    onClick={() => props.onToggleNotification()}
                >
                    <span
                        className={
                            props.enabledNotification ? styles[`${"icon-notify-on-"}${theme}`] : styles[`${"icon-notify-off-"}${theme}`]
                        }
                    ></span>
                </div>
                <div
                    id="ticket-history"
                    className={`header-button ${styles["setting-button"]} ${!isMobileOnly ? styles["desktop-style"] : ""}`}
                >
                    <span className={styles[`${"icon-ticket-history-"}${theme}`]}></span>
                </div>
                <div
                    id="menu-settings"
                    className={`header-button ${styles["setting-button"]} ${!isMobileOnly ? styles["desktop-style"] : ""}`}
                >
                    <span className={styles[`${"icon-menu-"}${theme}`]}></span>
                </div>
            </div>
        </div>
    );
};
