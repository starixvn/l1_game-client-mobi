import { useTranslation } from "next-i18next";
import React, { useEffect, useRef, useState } from "react";
import { isMobileOnly, isIOS } from "react-device-detect";
import { ChipLabelMapper, ChipMapper } from "../../common/constants";
import Styles from "./bet-setting.module.scss";
import { ChipSlider } from "./chip-slider";
import { QuickBetBtn } from "./quick-bet-btn";

type Props = {
    updateBetValue: (betValue: number) => void;
    enabledQuickBet: boolean;
    updateEnabledQuickBet: (value: boolean) => void;
    enabledSound: boolean;
    betValue: number;
};

const BetSettings: React.FC<Props> = ({ updateBetValue, enabledQuickBet, updateEnabledQuickBet, enabledSound, betValue }) => {
    const { t } = useTranslation("common");
    const [isCollapse, setIsCollapse] = useState(false);
    const [isChangingMode, setIsChangingMode] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    var deviceClass = "";

    const clickSliderCollapseHandle = () => {
        setIsChangingMode(true);

        setTimeout(() => {
            setIsCollapse(false);
            setIsChangingMode(false);
        }, 300);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!isCollapse && wrapperRef?.current && !wrapperRef.current.contains(event.target)) {
                setIsChangingMode(true);

                setTimeout(() => {
                    setIsCollapse(true);
                    setIsChangingMode(false);
                }, 300);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    if (isMobileOnly) {
        deviceClass = isIOS ? Styles["ios-device"] : Styles["adroid-device"];
    }

    return (
        <>
            {isCollapse && isMobileOnly ? (
                <div
                    className={`${Styles["slider-collapse"]} ${isChangingMode ? Styles["collapse-animation"] : ""}`}
                    onClick={clickSliderCollapseHandle}
                >
                    <img
                        src={`/static/images/chips/${ChipMapper[betValue]}.svg`}
                        className={`img-fluid ${Styles["chip"]}`}
                        width="60"
                        height="62"
                        alt="Chip"
                    />
                    <span className={Styles["value"]}>{ChipLabelMapper[betValue]}</span>
                    {enabledQuickBet && <span>Enable</span>}
                </div>
            ) : (
                <div
                    ref={wrapperRef}
                    className={`${Styles["bet-settings"]} ${deviceClass}  ${isChangingMode ? Styles["expand-animation"] : ""}`}
                >
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
                                    <ChipSlider
                                        updateBetValue={updateBetValue}
                                        enabledSound={enabledSound}
                                        enabledQuickBet={enabledQuickBet}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {isMobileOnly && (
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
            )}
        </>
    );
};

export default React.memo(BetSettings);
