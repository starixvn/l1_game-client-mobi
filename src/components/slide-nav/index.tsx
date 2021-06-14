import { useTranslation } from "next-i18next";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { isMobileOnly } from "react-device-detect";

import { languageNameMapper, Themes } from "../../common/constants";
import { useAuthContext } from "../../contexts/auth";
import { numberWithCommas } from "../../helpers/number-helper";
import { UserClientCommunication } from "../../services";
import ProfilePicture from "../profile-picture";
import LanguageSelection from "./language-selection";
import Styles from "./slide-nav.module.scss";

type Props = {
    avatarId: number;
    name: string;
    balance: number;
    currency: string;
    enabledPlaySound: boolean;
    onPlaySoundToggle: () => void;
    enabledWinningStreakNotification: boolean;
    onWinningStreakToggle: () => void;
    onClose: () => void;
};

const SlideNav: React.FC<Props> = (props) => {
    const { t } = useTranslation("common");
    const { theme, setTheme } = useTheme();
    const userSettingsService = UserClientCommunication.getUserClientInstance().userSettings;
    const authContext = useAuthContext();
    const [showLanguageSelection, setShowLanguageSelection] = useState<boolean>(false);
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const { locale } = useRouter();
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleChangeTheme = () => {
        const newTheme = theme === Themes.dark ? Themes.light : Themes.dark;

        userSettingsService.updateUserThemeSetting(authContext.session.ss, authContext.session.username, newTheme);
        setTheme(newTheme);
    };

    const handleClose = () => {
        setCollapsed(true);
        setTimeout(props.onClose, 300);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                handleClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    return (
        <div ref={wrapperRef} className={`${Styles["navigation"]} ${collapsed ? Styles["collapsed"] : ""}`}>
            {isMobileOnly ? (
                <div className={Styles["header"]}>
                    <span className={`icon-back ${Styles["btn-back"]}`} onClick={handleClose}></span>
                    <h1 className={Styles["title"]}>{t("setting")}</h1>
                </div>
            ) : (
                <span className={`icon-close ${Styles["btn-close"]}`} onClick={handleClose}></span>
            )}
            <div className={Styles["avatar"]}>
                <ProfilePicture avatarId={props.avatarId} />
            </div>
            <div className={Styles["user-name"]}>{props.name}</div>
            <div className={Styles["setting-container"]}>
                <SettingItem label={t("betCredit")}>
                    <div key={props.balance} className={Styles.balance}>
                        {numberWithCommas(props.balance ? props.balance : 0)} {props.currency}
                    </div>
                </SettingItem>
                <SettingItem label={t("darkMode")}>
                    <Toggle id="toggle-theme" value={theme === Themes.dark} onChange={handleChangeTheme} />
                </SettingItem>
                <SettingItem label={t("sound")}>
                    <Toggle id="toggle-sound" value={props.enabledPlaySound} onChange={props.onPlaySoundToggle} />
                </SettingItem>
                <SettingItem label={t("winningStreakNotification")}>
                    <Toggle id="toggle-good-way" value={props.enabledWinningStreakNotification} onChange={props.onWinningStreakToggle} />
                </SettingItem>
                <SettingItem label={t("language")}>
                    <div className={Styles["language-group"]} onClick={() => setShowLanguageSelection(!showLanguageSelection)}>
                        <span className={Styles["name"]}>{languageNameMapper[locale]}</span>
                        <span className={`icon-arrow-right ${Styles["icon-arrow-right"]}`}></span>
                    </div>
                </SettingItem>
            </div>
            {showLanguageSelection && <LanguageSelection onClose={() => setShowLanguageSelection(false)} />}
        </div>
    );
};

const SettingItem: React.FC<{ label: string }> = ({ label, children }) => {
    return (
        <div className={Styles["setting-item"]}>
            <label>{label}</label>
            {children}
        </div>
    );
};

const Toggle: React.FC<{ id: string; value: boolean; onChange?: () => void }> = ({ id, value, onChange }) => {
    return (
        <div className={`${Styles["toggle"]}`}>
            <input className={Styles["toggle-checkbox"]} id={id} type={"checkbox"} onChange={onChange} checked={value} />
            <label className={Styles["toggle-btn"]} htmlFor={id}></label>
        </div>
    );
};

export default SlideNav;
