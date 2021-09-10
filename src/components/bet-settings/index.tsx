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
                    <span className={`${Styles["icon-expand"]} ${enabledQuickBet ? Styles["quick-bet"] : ""}`}></span>
                    <div className={Styles["chip-container"]}>
                        <img
                            src={`/static/images/chips/${ChipMapper[betValue]}.svg`}
                            className={`img-fluid ${Styles["chip"]}`}
                            width="40"
                            height="42"
                            alt="Chip"
                        />
                        <span className={Styles["value"]}>{ChipLabelMapper[betValue]}</span>
                    </div>

                    {enabledQuickBet && <img
                        src={`/static/images/icon-quick-bet-active.svg?v=1625225065074`}
                        className={`img-fluid ${Styles["icon-enable-quickbet"]}`}
                        width="20"
                        height="20"
                        alt="Chip"
                    />}
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
                </div>
            )}
        </>
    );
};

export default React.memo(BetSettings);
