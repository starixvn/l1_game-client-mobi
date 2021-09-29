import React from "react";
import { isMobileOnly } from "react-device-detect";

import { UserInfo } from "../user-info";
import { User } from "sc-user-service-client/dist/auth";
import { Settings } from "../shared/settings";
import Styles from "./header.module.scss";

type Props = {
    user: User;
    enabledSound: boolean;
    enabledNotification: boolean;
    onToggleSound: Function;
    onToggleNotification: Function;
    toggleHistoryModal: Function;
    toggleGuideModal: Function;
    updateFavoriteGames: Function;
    favoriteGames: number[];
    enabledQuickBet?: boolean;
    updateEnabledQuickBet?: Function;
};

const Header: React.FC<Props> = (props) => {
    return (
        <>
            <header className={`${Styles.header} ${isMobileOnly ? Styles["mobile"] : ""}`}>
                <div className="game-container d-flex">
                    <div className={Styles["header-container"]}>
                        <a onClick={() => window.location.reload()} className={Styles["site-name"]}>
                            Saba.mobi
                        </a>
                        <div className={Styles["header-right"]}>
                            {
                                <Settings
                                    enabledSound={props.enabledSound}
                                    enabledNotification={props.enabledNotification}
                                    onToggleSound={props.onToggleSound}
                                    onToggleNotification={props.onToggleNotification}
                                    toggleHistoryModal={props.toggleHistoryModal}
                                    toggleGuideModal={props.toggleGuideModal}
                                    favoriteGames={props.favoriteGames}
                                    updateFavoriteGames={props.updateFavoriteGames}
                                    enabledQuickBet={props.enabledQuickBet}
                                    updateEnabledQuickBet={props.updateEnabledQuickBet}
                                />
                            }
                            {!isMobileOnly && <UserInfo user={props.user} />}
                        </div>
                    </div>
                </div>
            </header>
            {isMobileOnly && <div className={Styles["settings-container"]}></div>}
        </>
    );
};

export default Header;
