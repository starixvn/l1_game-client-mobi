import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
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
    const [isBalanceAnim, setIsBalanceAnim] = useState<boolean>(false);
    const pathAvatar = `/static/images/avatar/${props.avatarId}.png`;
    const userSettingsService = UserClientCommunication.getUserClientInstance().userSettings;
    const authContext = useAuthContext();
    const { theme, setTheme } = useTheme();

    const handleChangeTheme = () => {
        const newTheme = theme === Themes.dark ? Themes.light : Themes.dark;

        userSettingsService.updateUserThemeSetting(authContext.session.ss, authContext.session.username, newTheme);
        setTheme(newTheme);
    };

    useEffect(() => {
        setTheme(props.settings?.theme || Themes.light);
    }, [props.settings]);

    useEffect(() => {
        setIsBalanceAnim(true);
    }, [props.balance]);

    useEffect(() => {
        const timeOut = setTimeout(() => setIsBalanceAnim(false), 500);
        return () => {
            clearTimeout(timeOut);
        };
    }, [isBalanceAnim]);

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
                                    <div className={`${Styles.balance} ${isBalanceAnim ? "heart-beat-animation" : ""}`}>
                                        {numberWithCommas(props.balance)} {props.currency}
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
                            {theme !== undefined && (
                                <div className={Styles["cirle-theme"]} onClick={handleChangeTheme}>
                                    <span className={`icon-moon ${Styles["icon-theme"]}`}></span>
                                </div>
                            )}
                        </div>
                    </div>
                </Navbar>
            </div>
        </header>
    );
};

export default Header;
