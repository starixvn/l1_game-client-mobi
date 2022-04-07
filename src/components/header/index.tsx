import axios from "axios";
import React from "react";
import { isMobileOnly } from "react-device-detect";
import { SSOResponse, User } from "sc-user-service-client/dist/auth";
import appSettings from "../../common/app-settings";
import { getLocalStorageItem, localStorageKeys } from "../../common/local-storage";

import { Settings } from "../shared/settings";
import { UserInfo } from "../user-info";
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
    offerGames: number[];
    enabledQuickBet?: boolean;
    updateEnabledQuickBet?: Function;
};

const Header: React.FC<Props> = (props) => {
    const redirectToSC = async () => {
        const userSession = getLocalStorageItem<SSOResponse>(localStorageKeys.session);

        if (userSession) {
            const { proxy } = appSettings;
            const userServiceUri = `${proxy.ssl ? "https" : "http"}://${proxy.uri + proxy.path}/user`;
            const request = {
                session: userSession.ss,
                system: 1,
            };

            const { redirect_token, url } = (await axios.post(`${userServiceUri}/auth/redirectToken`, request)).data;
            window.location.href = `${url}?redirectToken=${redirect_token}`;
        }
    };

    return (
        <>
            <header className={`${Styles.header} ${isMobileOnly ? Styles["mobile"] : ""}`} data-testid="header">
                <div className="game-container d-flex">
                    <div className={Styles["header-container"]}>
                        <a onClick={() => window.location.reload()} className={Styles["site-name"]}>
                            Saba.mobi
                        </a>
                        <a onClick={() => redirectToSC()} className={Styles["site-name"]}>
                            Saba Club
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
                                    offerGames={props.offerGames}
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
        </>
    );
};

export default Header;
