import { useTranslation } from "next-i18next";
import React from "react";
import { browserVersion, isIOS, isMobileOnly } from "react-device-detect";

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
    const { t } = useTranslation("common");
    var deviceClass = "";

    if (isIOS) {
        deviceClass = Styles["ios-device"];
    }

    const isShowFooter = isIOS && browserVersion !== "15";

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
            {isShowFooter && (
                <div className={Styles["footer"]}>
                    {enabledQuickBet && (
                        <div className={Styles["one-click-bet-turn-on"]}>
                            <span className={Styles["left"]}></span>
                            <span className={Styles["content"]}>{t("common:oneClickBetOn")}</span>
                            <span className={Styles["right"]}></span>
                        </div>
                    )}
                    <span className={Styles["copyright"]}>Powered by Saba.club</span>
                </div>
            )}
        </div>
    );
};

export default React.memo(BetSettings);
