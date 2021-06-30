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
                <div
                    id="notification-settings"
                    className={styles[`${"setting_button_"}${theme}`]}
                    onClick={() => props.onToggleNotification()}
                >
                    <span
                        className={
                            props.enabledNotification ? styles[`${"icon_notify_on_"}${theme}`] : styles[`${"icon_notify_off_"}${theme}`]
                        }
                    ></span>
                </div>
                <div id="sound-settings" className={styles[`${"setting_button_"}${theme}`]} onClick={() => props.onToggleSound()}>
                    <span
                        className={props.enabledSound ? styles[`${"icon_sound_on_"}${theme}`] : styles[`${"icon_sound_off_"}${theme}`]}
                    ></span>
                </div>
                <div
                    id="theme-settings"
                    className={styles[`${"setting_button_"}${theme}`]}
                    onClick={() => setTheme(theme === Themes.dark ? Themes.light : Themes.dark)}
                >
                    <span className={theme === Themes.dark ? styles["icon_dark_mode"] : styles["icon_light_mode"]}></span>
                </div>
            </div>
        </div>
    );
};
