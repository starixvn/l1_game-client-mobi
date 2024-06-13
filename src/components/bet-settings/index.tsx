import React, { useMemo } from "react";
import { isMobileOnly, isIOS } from "react-device-detect";
import { useTranslation } from "next-i18next";
import { User } from "sc-user-service-client/dist/auth";
import { UserInfo } from "../user-info";
import { ChipSlider } from "./chip-slider";
import { ChipLabelMapper, ChipMapper, systemName, LanguageLocaleMapper } from "../../common/constants";
import Styles from "./bet-setting.module.scss";

type Props = {
    updateBetValue: (betValue: number) => void;
    enabledQuickBet: boolean;
    updateEnabledQuickBet: (value: boolean) => void;
    enabledSound: boolean;
    user: User;
    toggleSlidingChip: () => void;
    isShowSlidingChip: boolean;
    toggleAnnouncementModal: () => void;
    betValue: number;
    isNewPromotion: boolean;
    isShowToolbarGuide: boolean;
};

const BetSettings: React.FC<Props> = ({
    updateBetValue,
    enabledQuickBet,
    updateEnabledQuickBet,
    enabledSound,
    user,
    toggleSlidingChip,
    isShowSlidingChip,
    toggleAnnouncementModal,
    betValue,
    isNewPromotion,
    isShowToolbarGuide,
}) => {
    const { i18n } = useTranslation();

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
                                <>
                                    {/* <QuickBetBtn
                                        enabledQuickBet={enabledQuickBet}
                                        updateEnabledQuickBet={updateEnabledQuickBet}
                                        isHeaderSetting={false}
                                        isShowToolbarGuide={isShowToolbarGuide}
                                    /> */}

                                    {isNewPromotion && (
                                        <div className={Styles["promotion"]} onClick={() => toggleAnnouncementModal()}>
                                            <img
                                                className={Styles["promo-light"]}
                                                src={`/static/images/promotion-light.svg?v=1`}
                                                width="97"
                                                alt="promotion"
                                            />
                                            <img
                                                className={Styles["promo-img"]}
                                                src={`/static/images/promotion_${LanguageLocaleMapper[i18n.language]}.svg?v=3`}
                                                width="97"
                                                alt="promotion"
                                            />
                                        </div>
                                    )}
                                </>
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
                        <div
                            className={`${Styles["chip-container"]} ${Styles[ChipMapper[systemName][betValue]]}`}
                            onClick={toggleSlidingChip}
                        >
                            <div
                                className={`${Styles["chip-toggle"]} ${
                                    isShowSlidingChip ? Styles["open-animation"] : Styles["close-animation"]
                                }`}
                            >
                                <img className={Styles["chip-default"]} src={`/static/images/chips/chip-close.svg`} alt="Chip" />
                                <img
                                    className={Styles["chip-selected"]}
                                    src={`/static/images/chips/${systemName}/${ChipMapper[systemName][betValue]}.svg`}
                                    alt="Chip"
                                />
                            </div>
                            <span className={Styles["value"]}>{ChipLabelMapper[systemName][betValue]}</span>
                        </div>
                        {isNewPromotion && (
                            <div className={Styles["promotion"]} onClick={() => toggleAnnouncementModal()}>
                                <img
                                    className={Styles["promo-light"]}
                                    src={`/static/images/promotion-light.svg?v=1`}
                                    width="74"
                                    alt="promotion"
                                />
                                <img
                                    className={Styles["promo-img"]}
                                    src={`/static/images/promotion_${LanguageLocaleMapper[i18n.language]}.svg?v=3`}
                                    width="74"
                                    alt="promotion"
                                />
                            </div>
                        )}
                        <div className={Styles["phone-quick-bet"]}>
                            {/* <QuickBetBtn
                                enabledQuickBet={enabledQuickBet}
                                updateEnabledQuickBet={updateEnabledQuickBet}
                                isHeaderSetting={false}
                                isShowToolbarGuide={isShowToolbarGuide}
                            /> */}
                        </div>
                    </div>
                )}
            </div>
        );
    }, [
        user?.red,
        updateBetValue,
        enabledQuickBet,
        updateEnabledQuickBet,
        enabledSound,
        isShowSlidingChip,
        betValue,
        isNewPromotion,
        isShowToolbarGuide,
    ]);
};

export default BetSettings;
