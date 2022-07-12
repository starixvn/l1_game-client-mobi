import React, { useMemo } from "react";
import { isMobileOnly, isIOS } from "react-device-detect";

import { User } from "sc-user-service-client/dist/auth";
import { UserInfo } from "../user-info";
import { ChipSlider } from "./chip-slider";
import { QuickBetBtn } from "./quick-bet-btn";
import { ChipLabelMapper, ChipMapper, ChipValues } from "../../common/constants";
import Styles from "./bet-setting.module.scss";

type Props = {
    updateBetValue: (betValue: number) => void;
    enabledQuickBet: boolean;
    updateEnabledQuickBet: (value: boolean) => void;
    enabledSound: boolean;
    user: User;
    toggleSlidingChip: () => void;
    isShowSlidingChip: boolean;
    betValue: number;
};

const BetSettings: React.FC<Props> = ({
    updateBetValue,
    enabledQuickBet,
    updateEnabledQuickBet,
    enabledSound,
    user,
    toggleSlidingChip,
    isShowSlidingChip,
    betValue,
}) => {
    return useMemo(() => {
        let deviceClass = "";

        if (isMobileOnly) {
            deviceClass = isIOS ? Styles["ios-device"] : Styles["android-device"];
        }
        return (
            <div className={`${Styles["bet-settings"]} ${deviceClass}`}>
                <div
                    className={`${Styles["settings-container"]} ${
                        isShowSlidingChip ? Styles["open-animation"] : Styles["close-animation"]
                    }`}
                >
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
                                <ChipSlider
                                    updateBetValue={updateBetValue}
                                    enabledSound={enabledSound}
                                    enabledQuickBet={enabledQuickBet}
                                    toggleSlidingChip={toggleSlidingChip}
                                    betValue={betValue}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {isMobileOnly && (
                    <div className={Styles["footer"]}>
                        <div className={Styles["user-info"]}>
                            <UserInfo user={user} customizeClass={"footer"} />
                        </div>
                        <div className={`${Styles["chip-container"]} ${Styles[ChipMapper[betValue]]}`} onClick={toggleSlidingChip}>
                            <div className={`${Styles["chip-toggle"]} ${isShowSlidingChip ? Styles["open-animation"] : Styles["close-animation"]}`}>
                                <img className={Styles["chip-default"]} src={`/static/images/chips/chip-1.svg`} alt="Chip" />
                                <img className={Styles["chip-selected"]} src={`/static/images/chips/${ChipMapper[betValue]}.svg`} alt="Chip" />
                            </div>                            
                            <span className={Styles["value"]}>{ChipLabelMapper[betValue]}</span>
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
    }, [user?.red, updateBetValue, enabledQuickBet, updateEnabledQuickBet, enabledSound, isShowSlidingChip, betValue]);
};

export default BetSettings;
