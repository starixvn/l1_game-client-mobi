import { useTranslation } from "next-i18next";
import React from "react";
import { isMobileOnly } from "react-device-detect";
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

    return (
        <div className={Styles["bet-settings"]}>
            <div className={Styles["settings-container"]}>
                <div className={`game-container ${Styles["container"]}`}>
                    <div className={Styles["wrapper-chips"]}>
                        {!isMobileOnly && (
                            <QuickBetBtn
                                enabledQuickBet={enabledQuickBet}
                                updateEnabledQuickBet={updateEnabledQuickBet}
                                hasQuickBetLabel={true}
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
                    Powered by Saba.club
                    {enabledQuickBet && <span className={Styles["one-click-bet-turn-on"]}>1-Click Bet đã bật</span>}
                </div>
            )}
        </div>
    );
};

export default React.memo(BetSettings);
