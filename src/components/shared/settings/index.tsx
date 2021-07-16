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
                        isHeaderSetting={true}
                    />
                </div>
            )}
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
                {/* <div
                    id="sound-settings"
                    className={`header-button ${styles["setting_button"]} ${!isMobileOnly ? styles["desktop-style"] : ""}`}
                    onClick={() => props.onToggleSound()}
                >
                    <span
                        className={props.enabledSound ? styles[`${"icon_sound_on_"}${theme}`] : styles[`${"icon_sound_off_"}${theme}`]}
                    ></span>
                </div>
                <div
                    id="theme-settings"
                    className={`header-button ${styles["setting_button"]} ${!isMobileOnly ? styles["desktop-style"] : ""}`}
                    onClick={() => setTheme(theme === Themes.dark ? Themes.light : Themes.dark)}
                >
                    <span className={theme === Themes.dark ? styles["icon_dark_mode"] : styles["icon_light_mode"]}></span>
                </div> */}
            </div>
        </div>
    );
};
