import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { Navbar } from "reactstrap";
import { UserSettings } from "sc-user-service-client/dist/auth";

import { Themes } from "../../common/constants";
import { useAuthContext } from "../../contexts/auth";
import { numberWithCommas } from "../../helpers/number-helper";
import { UserClientCommunication } from "../../services";
import ProfilePicture from "../profile-picture";
import Styles from "./header.module.scss";

type Props = {
    UID: number;
    avatarId: number;
    currency: string;
    name: string;
    balance: number;
    settings: UserSettings;
    enabledWinningStreakNotification: boolean;
    onWinningStreakToggle: () => void;
    enabledPlaySound: boolean;
    onPlaySoundToggle: () => void;
};

const Header: React.FC<Props> = (props) => {
    const pathAvatar = `/static/images/avatar/${props.avatarId}.png`;
    const userSettingsService = UserClientCommunication.getUserClientInstance().userSettings;
    const authContext = useAuthContext();
    const { theme, setTheme } = useTheme();
    const [isOpenSideNav, setIsOpenSideNav] = useState<boolean>(false);
    const { t } = useTranslation("common");

    const handleChangeTheme = () => {
        const newTheme = theme === Themes.dark ? Themes.light : Themes.dark;

        userSettingsService.updateUserThemeSetting(authContext.session.ss, authContext.session.username, newTheme);
        setTheme(newTheme);
    };

    const openSlideNav = () => {
        setIsOpenSideNav(true);
    };

    const closeSlideNav = () => {
        setIsOpenSideNav(false);
    };

    useEffect(() => {
        props.settings?.theme && setTheme(props.settings?.theme);
    }, [props.settings?.theme]);

    return (
        <header className={Styles.header}>
            <div className="game-container d-flex">
                <Navbar expand="md" className={Styles["navbar-custom"]}>
                    <div className={Styles["header-container"]}>
                        <div className={Styles["logo"]}>
                            <a href="/">
                                <img src={`/static/images/logo-custom-saba.svg`} className="img-fluid" alt="logo" />
                            </a>
                        </div>
                        <div className="d-flex">
                            <div className={Styles["user"]}>
                                <div className={Styles["info"]}>
                                    <div className={Styles["user-name"]}>{props.name}</div>
                                    <div key={props.balance} className={`${Styles.balance} ${"heart-beat-animation"}`}>
                                        {numberWithCommas(props.balance ? props.balance : 0)} {props.currency}
                                    </div>
                                </div>
                                <div className={Styles["avatar"]}>
                                    {props.avatarId > 0 && props.avatarId < 41 ? (
                                        <img src={pathAvatar} className="img-fluid" alt="Avatar" />
                                    ) : (
                                        <span className={`icon-user ${Styles["icon-user"]}`}></span>
                                    )}
                                </div>
                            </div>
                            <span onClick={openSlideNav} className={`icon-menu ${Styles["icon-menu"]}`}></span>
                        </div>
                    </div>
                </Navbar>
            </div>

            <div className={`${Styles["slide-nav"]} ${isOpenSideNav ? Styles["active"] : ""}`}>
                {isMobileOnly ? (
                    <span className={`icon-arrow-left ${Styles["btn-close"]}`} onClick={closeSlideNav}></span>
                ) : (
                    <span className={`icon-close ${Styles["btn-close"]}`} onClick={closeSlideNav}></span>
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
                    <SettingItem label={t("goodRoadNotification")}>
                        <Toggle
                            id="toggle-good-way"
                            value={props.enabledWinningStreakNotification}
                            onChange={props.onWinningStreakToggle}
                        />
                    </SettingItem>
                </div>
            </div>
        </header>
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

export default Header;
