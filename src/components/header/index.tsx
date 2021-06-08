import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { Navbar } from "reactstrap";
import { UserSettings } from "sc-user-service-client/dist/auth";

import { Themes } from "../../common/constants";
import { useAuthContext } from "../../contexts/auth";
import { numberWithCommas } from "../../helpers/number-helper";
import { UserClientCommunication } from "../../services";
import Styles from "./header.module.scss";

type Props = {
    UID: number;
    avatarId: number;
    currency: string;
    name: string;
    balance: number;
    settings: UserSettings;
};

const Header: React.FC<Props> = (props) => {
    const pathAvatar = `/static/images/avatar/${props.avatarId}.png`;
    const userSettingsService = UserClientCommunication.getUserClientInstance().userSettings;
    const authContext = useAuthContext();
    const { theme, setTheme } = useTheme();
    const [isOpenSideNav, setIsOpenSideNav] = useState<boolean>(false);

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
                <span className={`icon-arrow-left ${Styles["btn-close"]}`} onClick={closeSlideNav}></span>
                <div className={Styles["profile-picture"]}>
                    {props.avatarId > 0 && props.avatarId < 41 ? (
                        <img src={pathAvatar} className={Styles["avartar"]} alt="Avatar" />
                    ) : (
                        <span className={`icon-user ${Styles["icon-user"]}`}></span>
                    )}
                </div>
                <div className={Styles["user-name"]}>{props.name}</div>

                <div className={Styles["setting-container"]}>
                    <div className={Styles["setting-item"]}>
                        <label>Hạn mức còn lại</label>
                        <div key={props.balance} className={Styles.balance}>
                            {numberWithCommas(props.balance ? props.balance : 0)} {props.currency}
                        </div>
                    </div>
                    <div className={Styles["setting-item"]}>
                        <label>Giao diện Tối</label>
                        <div className={`${Styles["toggle"]}`}>
                            <input className={Styles["toggle-checkbox"]} id="toggle-theme" type={"checkbox"} />
                            <label className={Styles["toggle-btn"]} htmlFor="toggle-theme"></label>
                        </div>
                    </div>

                    <div className={Styles["setting-item"]}>
                        <label>Âm thanh</label>
                        <div className={`${Styles["toggle"]}`}>
                            <input className={Styles["toggle-checkbox"]} id="toggle-sound" type={"checkbox"} checked />
                            <label className={Styles["toggle-btn"]} htmlFor="toggle-sound"></label>
                        </div>
                    </div>
                    <div className={Styles["setting-item"]}>
                        <label>Thông báo con đường thuận lợi</label>
                        <div className={`${Styles["toggle"]}`}>
                            <input className={Styles["toggle-checkbox"]} id="toggle-good-way" type={"checkbox"} />
                            <label className={Styles["toggle-btn"]} htmlFor="toggle-good-way"></label>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
