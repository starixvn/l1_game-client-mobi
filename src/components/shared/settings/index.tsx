import { useTheme } from "next-themes";
import React from "react";
import { isMobileOnly } from "react-device-detect";
import { Themes } from "../../../common/constants";
import { QuickBetBtn } from "../../bet-settings/quick-bet-btn";
import styles from "./settings.module.scss";
import { Props } from "./types";

export const Settings: React.FC<Props> = (props) => {
    const { theme, setTheme } = useTheme();

    return (
        <div className={styles["settings-container"]}>
            {isMobileOnly && (
                <div className={styles["setting-left"]}>
                    <QuickBetBtn
                        enabledQuickBet={props.enabledOneClickBet}
                        updateEnabledQuickBet={(enabled) => props.updateEnabledQuickBet(enabled)}
                    />
                </div>
            )}
            <div className={styles["setting-right"]}>
                <span
                    id="notification-settings"
                    className={`${styles["notification-setting"]} ${props.enabledNotification ? styles["enabled"] : ""}`}
                    onChange={() => props.onToggleNotification()}
                ></span>
                <span
                    id="sound-settings"
                    className={`${styles["sound-setting"]} ${props.enabledSound ? styles["enabled"] : ""}`}
                    onChange={() => props.onToggleSound()}
                ></span>
                <span
                    id="theme-settings"
                    className={`${styles["theme-setting"]} ${theme === Themes.dark ? styles["enabled"] : ""}`}
                    onChange={() => setTheme(theme === Themes.dark ? Themes.light : Themes.dark)}
                ></span>
            </div>
        </div>
    );
};
