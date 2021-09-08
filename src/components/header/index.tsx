import React from "react";
import { isMobileOnly } from "react-device-detect";
import { User } from "sc-user-service-client/dist/auth";

import { numberWithCommas } from "../../helpers/number-helper";
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

function UserInfo({ user }: { user: User }) {
    return (
        <div className={Styles["user"]}>
            <div className={Styles["info"]}>
                <div className={Styles["user-name"]}>{user.name}</div>
                <div key={user.red} className={`${Styles.balance}`}>
                    {numberWithCommas(user.red ? user.red : 0)} {user.currency}
                </div>
            </div>
            <div className={Styles["avatar"]}>
                {user.avatarId > 0 && user.avatarId < 41 ? (
                    <img src={`/static/images/avatar/${user.avatarId}.png`} className="img-fluid" height="40" width="40" alt="Avatar" />
                ) : (
                    <span className={`icon-user ${Styles["icon-user"]}`}></span>
                )}
            </div>
        </div>
    );
}

const Header: React.FC<Props> = (props) => {
    return (
        <>
            <header className={Styles.header}>
                <div className="game-container d-flex">
                    <div className={Styles["header-container"]}>
                        <a onClick={() => window.location.reload()} className={Styles["site-name"]}>
                            Saba.mobi
                        </a>
                        <div className={Styles["header-right"]}>
                            {!isMobileOnly && (
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
                            )}
                            <UserInfo user={props.user} />
                        </div>
                    </div>
                </div>
            </header>
            {isMobileOnly && (
                <div className={Styles["settings-container"]}>
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
                </div>
            )}
        </>
    );
};

export default Header;
