import { useTranslation } from "next-i18next";
import { useTheme } from "next-themes";
import React, { useRef, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import { FavoriteSetting } from "../../favorite-setting";
import { Tooltip } from "../tooltip";
import { Menu } from "./menu";
import { Props } from "./types";
import { QuickBetBtn } from "../../bet-settings/quick-bet-btn";
import styles from "./settings.module.scss";

const ButtonSettingClassName = "setting-button";

export const Settings: React.FC<Props> = ({
    enabledNotification,
    onToggleNotification,
    toggleHistoryModal,
    onToggleSound,
    enabledSound,
    toggleGuideModal,
    favoriteGames,
    updateFavoriteGames,
    enabledQuickBet,
    updateEnabledQuickBet,
    isShowQuickBet = false,
}) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const [showFavoriteSetting, setShowFavoriteSetting] = useState(false);
    const toggleHistoryBtnRef = useRef<HTMLDivElement>(null);
    const toggleSoundBtnRef = useRef<HTMLDivElement>(null);
    const favoriteToggleBtnRef = useRef<HTMLDivElement>(null);
    const specialClassByDevice = !isMobileOnly ? "desktop-style" : "";

    return (
        <div className={styles["settings-container"]}>
            {isShowQuickBet && isMobileOnly && (
                <div className={styles["setting-left"]}>
                    <QuickBetBtn
                        enabledQuickBet={enabledQuickBet}
                        updateEnabledQuickBet={(enabled) => updateEnabledQuickBet(enabled)}
                        isHeaderSetting={true}
                    />
                </div>
            )}
            <div className={styles["setting-right"]}>
                <div
                    ref={toggleSoundBtnRef}
                    id="sound-settings"
                    className={`${styles[ButtonSettingClassName]} ${styles[specialClassByDevice]}`}
                    onClick={() => onToggleSound()}
                >
                    <span
                        className={enabledSound ? styles[`${"icon-sound-on-"}${theme}`] : styles[`${"icon-sound-off-"}${theme}`]}
                    ></span>
                    <Tooltip message={`${t("sound")}: ${enabledSound ? t("on") : t("off")}`} hoverWrapper={toggleSoundBtnRef} />
                </div>

                <div
                    ref={toggleHistoryBtnRef}
                    id="ticket-history"
                    className={`${styles[ButtonSettingClassName]} ${styles[specialClassByDevice]}`}
                    onClick={() => toggleHistoryModal()}
                >
                    <span className={styles[`${"icon-ticket-history-"}${theme}`]}></span>
                    <Tooltip message={t("popupTitleHistory")} hoverWrapper={toggleHistoryBtnRef} />
                </div>

                <div
                    id="favorite-setting"
                    className={`${styles[ButtonSettingClassName]} ${styles[specialClassByDevice]}`}
                    onClick={() => setShowFavoriteSetting(!showFavoriteSetting)}
                    ref={favoriteToggleBtnRef}
                >
                    <span className={`icon-favorite ${styles["icon-favorite"]}`}></span>
                    <Tooltip message={t("menu-favorite-setting")} hoverWrapper={favoriteToggleBtnRef} />
                </div>

                <Menu
                    handleToggleNotification={onToggleNotification}
                    enabledNotification={enabledNotification}
                    handleToggleGuideModal={toggleGuideModal}
                />
            </div>
            {showFavoriteSetting && (
                <FavoriteSetting
                    currentFavoriteGames={favoriteGames}
                    onCloseModal={() => setShowFavoriteSetting(false)}
                    updateFavorite={updateFavoriteGames}
                    toggleBtnRef={favoriteToggleBtnRef}
                />
            )}
        </div>
    );
};
