import React from "react";
import { isIOS, isMobileOnly } from "react-device-detect";

import Styles from "./bet-setting.module.scss";
import { ChipSlider } from "./chip-slider";
import { QuickBetBtn } from "./quick-bet-btn";

type Props = {
    updateBetValue: (betValue: number) => void;
    enabledQuickBet: boolean;
    updateEnabledQuickBet: (value: boolean) => void;
    enabledSound: boolean;
};

const BetSettings: React.FC<Props> = ({ updateBetValue, enabledQuickBet, updateEnabledQuickBet, enabledSound }) => {
    var deviceClass = "";

    if (isIOS) {
        deviceClass = Styles["ios-device"];
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
        </div>
    );
};

export default React.memo(BetSettings);
