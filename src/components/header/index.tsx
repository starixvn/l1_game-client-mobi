import { useTranslation } from "next-i18next";
import React from "react";
import { isMobileOnly } from "react-device-detect";

import { numberWithCommas } from "../../helpers/number-helper";
import { Settings } from "../shared/settings";
import Styles from "./header.module.scss";

type Props = {
    avatarId: number;
    currency: string;
    name: string;
    balance: number;
    enabledSound: boolean;
    enabledNotification: boolean;
    onToggleSound: Function;
    onToggleNotification: Function;
};

const Header: React.FC<Props> = (props) => {
    const pathAvatar = `/static/images/avatar/${props.avatarId}.png`;
    const { i18n } = useTranslation();

    return (
        <header className={Styles.header}>
            <div className="game-container d-flex">
                <div className={Styles["header-container"]}>
                    <a href={`/${i18n.language}`} className={Styles["site-name"]}>
                        Saba.mobi
                    </a>
                    <div className={Styles["header-right"]}>
                        {!isMobileOnly && (
                            <Settings
                                enabledSound={props.enabledSound}
                                enabledNotification={props.enabledNotification}
                                onToggleSound={props.onToggleSound}
                                onToggleNotification={props.onToggleNotification}
                            />
                        )}
                        <div className={Styles["user"]}>
                            <div className={Styles["info"]}>
                                <div className={Styles["user-name"]}>{props.name}</div>
                                <div key={props.balance} className={`${Styles.balance}`}>
                                    {numberWithCommas(props.balance ? props.balance : 0)} {props.currency}
                                </div>
                            </div>
                            <div className={Styles["avatar"]}>
                                {props.avatarId > 0 && props.avatarId < 41 ? (
                                    <img src={pathAvatar} className="img-fluid" height="40" width="40" alt="Avatar" />
                                ) : (
                                    <span className={`icon-user ${Styles["icon-user"]}`}></span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
