import React from "react";
import { useTranslation } from "next-i18next";
import { isMobileOnly, isIOS } from "react-device-detect";

import { User } from "sc-user-service-client/dist/auth";
import { UserInfo } from "../user-info";
import { ChipSlider } from "./chip-slider";
import { QuickBetBtn } from "./quick-bet-btn";
import Styles from "./bet-setting.module.scss";

type Props = {
    updateBetValue: (betValue: number) => void;
    enabledQuickBet: boolean;
    updateEnabledQuickBet: (value: boolean) => void;
    enabledSound: boolean;
    user: User;
};

const BetSettings: React.FC<Props> = ({ updateBetValue, enabledQuickBet, updateEnabledQuickBet, enabledSound, user }) => {
    const { t } = useTranslation("common");
    var deviceClass = "";

    if (isMobileOnly) {
        deviceClass = isIOS ? Styles["ios-device"] : Styles["adroid-device"];
    }

    return (
        <div className={`${Styles["bet-settings"]} ${deviceClass}`}>
            <div className={Styles["settings-container"]}>
                <div className={`game-container ${Styles["container"]}`}>
                    <div className={Styles["wrapper-chips"]}>
                        {!isMobileOnly && (
                            <QuickBetBtn
                                enabledQuickBet={enabledQuickBet}
                                updateEnabledQuickBet={updateEnabledQuickBet}
                                isHeaderSetting={false}
                            />
                        )}
                        <div className={Styles["chips-container"]}>
                            <ChipSlider updateBetValue={updateBetValue} enabledSound={enabledSound} enabledQuickBet={enabledQuickBet} />
                        </div>
                    </div>
                </div>
            </div>

            {isMobileOnly && (
                <div className={Styles["footer"]}>
                    <div className={Styles["user-info"]}>
                        <UserInfo user={user} customizeClass={"footer"} />
                    </div>
                    <div className={Styles["phone-quick-bet"]}>
                        <QuickBetBtn
                            enabledQuickBet={enabledQuickBet}
                            updateEnabledQuickBet={updateEnabledQuickBet}
                            isHeaderSetting={false}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(BetSettings);
